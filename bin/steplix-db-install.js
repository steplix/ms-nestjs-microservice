#!/usr/bin/env node

//
// imports
//
const fs = require('fs');
const { exec } = require('child_process');
const { name } = require(`${process.cwd()}/package.json`);

//
// constants
//
const help = process.argv.includes('--help');

// Configure this line for each Micro Service
const dbName = process.env.DB_NAME || findArg('name', `steplix_${name}`);
const dbHost = process.env.DB_HOST || findArg('host', 'localhost');
const dbUser = process.env.DB_USER || findArg('user', 'root');
const dbPass = process.env.DB_PASS || findArg('pass', 'WwFFTRDJ7s2RgPWx');

//
// helpers
//

// loggers
const titleLog = (title) => console.log(`\n============== ${title} ==============\n`);
const byeLog = (title) => console.log(`\n👋 Bye!\n`);
const successLog = (error) => console.error(`✅ ${error}`);
const errorLog = (error) => console.error(`❌ ${error}`);

// used to resolve argument value
function findArg (name, defaultValue) {
  const prefix = `--${name}=`;
  const arg = process.argv.find((arg) => arg.startsWith(prefix));
  return arg ? arg.replace(prefix, '') : defaultValue;
}

// used to build path file
function buildPathFile (filename) {
  const path = `${process.cwd()}/database/${filename}`;

  if (!fs.existsSync(path)) {
    return;
  }
  return path;
}

// used to execute mysql script
async function execute (command, successMessage) {
  return new Promise(resolve => {
    (async () => {
      try {
        const child = await exec(command);

        child.stderr.on('data', data => {
          if (data && data.includes('ERROR')) {
            errorLog(`error: ${data}`);
            process.exit(1);
          }
        });

        child.on('close', () => {
          successLog(successMessage);
          resolve();
        });
      }
      catch (error) {
        errorLog(`error: ${error && error.message}`);
        process.exit(1);
      }
    })();
  });
}

// usage represents the help guide
function usage () {
  console.log(`
  Install database

  usage:
     node install <options>

  options:
    - host {string} Database host
    - user {string} Database username
    - pass {string} Database user password

  environment vars:
    - DB_HOST {string} Database host
    - DB_USER {string} Database username
    - DB_PASS {string} Database user password

  example:
     node install --pass=secret
  `);
}

// used to execute mysql script
async function run (filename, database, successMessage) {
  const path = buildPathFile(filename);

  if (path) {
    await execute(`mysql -h ${dbHost} -u ${dbUser} -p${dbPass} ${database} < ${path}`, successMessage);
  }
}

//
// source code
//

(async () => {
  if (help) return usage();

  titleLog('Installing Database');

  await run('database.sql', '', /* success message */ `Database created`);
  await run('tables.sql', dbName, /* success message */ `Tables created`);
  await run('basedata.sql', dbName, /* success message */ `Base data inserted`);
  await run('dummies.sql', dbName, /* success message */ `Dummies created`);

  byeLog();
})();
