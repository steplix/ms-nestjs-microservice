<div id="top"></div>

# @steplix/microservice

Based NodeJs + NestJs microservice.

## Index

* [Download & Install][install]
* [How is it used?][how_is_it_used]
  + [Getting started][getting_started]
  + [Configure][configure]
    * [App / Server][configure-server]
    * [Database][configure-database]
    * [Database replication][configure-database-replication]
    * [Debug / Logger][configure-logger]
    * [Micro Services][configure-micro-services]
    * [Services][configure-services]
    * [Statics][configure-statics]
    * [JWT][configure-jwt]
    * [Cache][configure-cache]
    * [Tracking][configure-tracking]
    * [Documentation][configure-doc]
  + [Communication between microservices][communication-between-microservices]
  + [Interceptors][interceptors]
  + [Logger][logger]
* [Tests][tests]

## Download & Install

### Install
```sh
npm i git+https://<STEPLIX_GITHUB_TOKEN>:x-oauth-basic@github.com/steplix/steplix-microservice.git#develop
```

Or add next line on your package.json
```sh
{
  ...
  "dependencies": {
    "@steplix/microservice": "git+https://<STEPLIX_GITHUB_TOKEN>:x-oauth-basic@github.com/steplix/steplix-microservice.git#develop"
    ...
  }
}
```

### Source code
```sh
git clone https://github.com/steplix/steplix-microservice.git
cd steplix-microservice
npm i
```

### Update
```sh
npm up @steplix/microservice
```

### Publish
```sh
# on NPM
npm run build
npm publish

# or
# on GIT
npm run build
git add .
git commit -m "Support for ..."
git push origin develop
```

## How is it used?
> NOTE: Based on NestJs.


### Recommended structure

```
|
| -> src
|    | -> config
|    | -> constants
|    | -> entities
|    |    | -> your-entity-class. Example, "category"
|    |    | -> category.ts (example)
|    | -> modules
|    |    | -> your-module-name. Example, "categories"
|    |    | -> categories (example)
|    |    |    | -> controller.ts
|    |    |    | -> service.ts
|    |    |    | -> module.ts
|    | -> app.module.ts
|    | -> app.ts
|    | -> main.ts
|
```

### Getting started

See helloworld folder for real life example. And a better way to start 😁

### Configure

#### For app/server

| Environment variable           | Values                        | Type    | Default value           | Description                                                                        |
|:-------------------------------|:------------------------------|:--------|:------------------------|:-----------------------------------------------------------------------------------|
| SERVER_PORT / PORT             | port number                   | number  | `8000`                  | Port where the server listens                                                      |
| SERVER_HEALTH_PATH             | health check path             | string  | `"/health"`             | Route for health check endpoint                                                    |
| HEALTH_FAILURE_ON_ERROR        | health check failure on error | boolean | `false`                 | Indicate if health check endpoint return status != 200 on error                    |
| HEALTH_LOG_HTTP_ACCESS         | health check log http access  | boolean | `false`                 | Indicate if log http access for health check endpoint                              |

<p align="right">(<a href="#top">go to top</a>)</p>


#### For database

##### Simple configuration
| Environment variable           | Values                 | Type    | Default value                  | Description                                                                        |
|:-------------------------------|:-----------------------|:--------|:-------------------------------|:-----------------------------------------------------------------------------------|
| DB_ENABLED                     | true/false             | boolean | `true`                         | Indicate if need support for database                                              |
| DB_ENTITIES_DIR                | entities pathname      | string  | `'entities/!(index).js'`       | Indicate location entities class                                                   |
| DB_NAME                        | db name                | string  | null                           |                                                                                    |
| DB_HOST                        | db host name           | string  | `'localhost'`                  |                                                                                    |
| DB_PORT                        | db port                | number  | `3306`                         |                                                                                    |
| DB_USER                        | db user                | string  | `'username'`                   |                                                                                    |
| DB_PASS                        | db password            | string  | null                           |                                                                                    |
| DB_TIMEZONE                    | db timezone            | string  | `'+00:00'`                     |                                                                                    |

<p align="right">(<a href="#top">go to top</a>)</p>


##### Read/Write replication configuration
| Environment variable           | Values                | Type    | Default value                   | Description                                                                          |
|:-------------------------------|:----------------------|:--------|:--------------------------------|:-------------------------------------------------------------------------------------|
| DB_NAME_WRITE                  | db name               | string  | `DB_NAME`                       | DB name for write replication                                                        |
| DB_HOST_WRITE                  | db host name          | string  | `DB_HOST`                       | DB host name for write replication                                                   |
| DB_PORT_WRITE                  | db port               | number  | `DB_PORT`                       | DB port for write replication                                                        |
| DB_USER_WRITE                  | db user               | string  | `DB_USER`                       | DB username for write replication                                                    |
| DB_PASS_WRITE                  | db password           | string  | `DB_PORT`                       | DB password for write replication                                                    |
| DB_NAME_READ                   | db name               | string  | `DB_NAME`                       | DB name for read replication                                                         |
| DB_HOST_READ                   | db host name          | string  | `DB_HOST`                       | DB host name for read replication                                                    |
| DB_PORT_READ                   | db port               | number  | `DB_PORT`                       | DB port for read replication                                                         |
| DB_USER_READ                   | db user               | string  | `DB_USER`                       | DB username for read replication                                                     |
| DB_PASS_READ                   | db password           | string  | `DB_PORT`                       | DB password for read replication                                                     |

<p align="right">(<a href="#top">go to top</a>)</p>


#### For debug/logger

| Environment variable           | Values                        | Type    | Default value           | Description                                                                        |
|:-------------------------------|:------------------------------|:--------|:------------------------|:-----------------------------------------------------------------------------------|
| LOGGER_NAME / APP_NAME         | application name              | string  | `'app'`                 | Description used for logger                                                        |
| LOGGER_ROUTES                  | pattern for log request       | string  | `"*"`                   | Pattern for filter request paths                                                   |
| LOGGER_LEVEL                   | logger level                  | string  | `"debug"`               | Logger level                                                                       |

<p align="right">(<a href="#top">go to top</a>)</p>


#### For communication between microservices

| Environment variable           | Values                 | Type    | Default value           | Description                                                                               |
|:-------------------------------|:-----------------------|:--------|:------------------------|:------------------------------------------------------------------------------------------|
| SERVICE_BASE_URL               | protocol + domain      | string  | `''`                    | Base MS URL. The port will be concatenated automatically. Example, http://localhost       |
| SERVICE_{MS NAME}_URL          | protocol + full domain | string  | `''`                    | Full MS URL. Example, http://localhost:{MS PORT}                                          |
| SERVICE_{MS NAME}_HEALTH       | Health pathname        | string  | `"/health"`             | Route for health check endpoint                                                           |

<p align="right">(<a href="#top">go to top</a>)</p>


#### For services

| Environment variable           | Values                | Type    | Default value           | Description                                                                                |
|:-------------------------------|:----------------------|:--------|:------------------------|:-------------------------------------------------------------------------------------------|
| SERVICE_AGENT                  | service agent name    | string  | `''`                    |                                                                                            |
| SERVICE_CONNECTION_TIMEOUT     | number in miliseconds | number  | 21000                   |                                                                                            |
| SERVICE_REQUEST_TIMEOUT        | number in miliseconds | number  | 20000                   |                                                                                            |
| SERVICE_DEPENDENCIES           | microservices related | string  | `''`                    | Indicate list of microservices dependencies                                                |

<p align="right">(<a href="#top">go to top</a>)</p>


#### For statics/publics assets

| Environment variable           | Values                | Type    | Default value           | Description                                                                                |
|:-------------------------------|:----------------------|:--------|:------------------------|:-------------------------------------------------------------------------------------------|
| STATICS_ENABLED                | enabled statics       | boolean | `false`                 | Indicate if is available statics (/public)                                                 |
| STATICS_SERVE_ROOT             | statics pathname      | string  | `'/public'`             |                                                                                            |
| STATICS_ROOT_PATH              | statics dir location  | string  | `'../public'`           |                                                                                            |

<p align="right">(<a href="#top">go to top</a>)</p>


#### For JWT

| Environment variable           | Values                 | Type    | Default value            | Description                                                                                |
|:-------------------------------|:-----------------------|:--------|:-------------------------|:-------------------------------------------------------------------------------------------|
| JWT_ALGORITHM                  | crypto algorithm       | string  | `RS256`                  |                                                                                            |
| JWT_PUBLIC_KEY                 | public key             | string  | `null`                   |                                                                                            |
| JWT_PRIVATE_KEY                | private key            | string  | `null`                   |                                                                                            |
| JWT_PUBLIC_KEY_FILE            | path file public key   | string  | `null`                   |                                                                                            |
| JWT_PRIVATE_KEY_FILE           | path file private key  | string  | `null`                   |                                                                                            |
| JWT_SECRET                     | public and private key | string  | `"SECRET"`               | Only used when public and/or private key is not defined                                    |


<p align="right">(<a href="#top">go to top</a>)</p>


#### For Cache

| Environment variable           | Values                 | Type    | Default value            | Description                                                                                |
|:-------------------------------|:-----------------------|:----    |:-------------------------|:-------------------------------------------------------------------------------------------|
| CACHE_ENABLED                  | true/false             | string  | `true`                   | Indicate if is eanble this feature                                                         |
| CACHE_TYPE                     | memory/redis           | string  | `'memory'`               |                                                                                            |


**Redis**

| Environment variable           | Values                 | Type    | Default value            | Description                                                                                |
|:-------------------------------|:-----------------------|:----    |:-------------------------|:-------------------------------------------------------------------------------------------|
| CACHE_HOST                     | redis hostname         | string  | `'localhost'`            |                                                                                            |
| CACHE_PORT                     | redis port number      | number  | `6379`                   |                                                                                            |


<p align="right">(<a href="#top">go to top</a>)</p>


#### For Tracking

| Environment variable           | Values                | Type    | Default value            | Description                                                                                |
|:-------------------------------|:----------------------|:--------|:-------------------------|:-------------------------------------------------------------------------------------------|
| TRACKING_ENABLED               | true/false            | boolean | `true`                   | Indicate if send requests to tracking service                                              |
| TRACKING_DEBUG                 | true/false            | boolean | `false`                  | Indicate if debug all success or failure request to tracking service                       |
| TRACKING_PREFIX                | application name      | string  | `pkg.name` / `'app'`     | Description used for base prefix tracking event name                                       |

<p align="right">(<a href="#top">go to top</a>)</p>


#### For documentation

| Environment variable           | Values                | Type    | Default value            | Description                                                                                |
|:-------------------------------|:----------------------|:--------|:-------------------------|:-------------------------------------------------------------------------------------------|
| DOC_SWAGGER_URL                | Doc pathname          | string  | `'/api/doc'`             |                                                                                            |
| DOC_SWAGGER_TITLE              | Doc title             | string  | package.json name        |                                                                                            |
| DOC_SWAGGER_DESCRIPTION        | Doc description       | string  | package.json description |                                                                                            |
| DOC_SWAGGER_VERSION            | Doc version           | string  | package.json version     |                                                                                            |
| DOC_SWAGGER_AUTH_TOKEN         | Doc auth token name   | string  | `'token'`                | Cookie auth name                                                                           |
| DOC_SWAGGER_SERVER             | Base API server       | string  | `'localhost:<port>'`     | Indicate base URL for try it out endpoints                                                 |

<p align="right">(<a href="#top">go to top</a>)</p>


#### Communication between microservices

```js
const { Service } = require('@steplix/microservice');

// ...

const usersService = Service.get('users');

// Use HTTP method GET - for get user by ID.
const user = await usersService.get(`/api/v1/users/${userId}`);

// Use HTTP method GET - for get only one user. (Take the first orden on list)
const user = await usersService.getOne('/api/v1/users');

// Use HTTP method POST - for create an user.
const user = await usersService.post({
  uri: '/api/v1/users',
  data: payload
});

// Use HTTP method PUT - for update an user. (WARNING: This endpoint does not exists. Is only explanatory)
const user = await usersService.put({
  uri: `/api/v1/users/${userId}`,
  data: payload
});

// Use HTTP method PATCH - for partial update an user. (WARNING: This endpoint does not exists. Is only explanatory)
const user = await usersService.patch({
  uri: `/api/v1/users/${orderId}/status`,
  data: {
    statusId: 0
  }
});

// ...
```

> By default, the microservice base URL is `"http://localhost:{MS PORT}"`. Example for Subscriptions `"http://localhost:3001"`

> For configure other MS URL, use <a href="#for-communication-between-microservices">environment configuration</a>

##### Available services

 - auth
 - users
 - locations
 - notifications
 - feature_toggler

> 
> 💡 NOTE: NOTE: To configure more services, add the same ones in `config/services.ts` constant `remoteServices`;
> 

<p align="right">(<a href="#top">go to top</a>)</p>


#### Interceptors

Authenticate user by JWT

```js
const { RequiredAuthUserInterceptor } = require('@steplix/microservice');

...
export class SubscriptionsController {
  ...
  @Post()
  @UseInterceptors(RequiredAuthUserInterceptor)
  create(@Req() req: Request, @Body() body: CreateSubscriptionDto) {
    body.user = (req as any).user;
    ...
  }
  ...
}
```

Cache controller endpoints

```js
const { CacheInterceptor, Cache } = require('@steplix/microservice');

...
@UseInterceptors(CacheInterceptor)
export class SubscriptionsController {
  ...
  @Get()
  @Cache()
  find(@Query query: any) {
    ...
  }
  ...
  @Get()
  @Cache({
    time: 6 * 3600000 // 6 hours
  })
  getById(@Query query: any) {
    ...
  }
  ...
  @Get()
  @Cache({
    key: "my-custom-key"
  })
  listSubscribableProducts() {
    ...
  }
  ...
}
```

##### Available interceptors

 - RequiredAuthUserInterceptor
 - AuthUserInterceptor
 - CacheInterceptor

<p align="right">(<a href="#top">go to top</a>)</p>


#### Logger

```js
const { logger } = require('@steplix/microservice');

logger.error(new Error('Not Found'));
logger.error('This is an error');
logger.warn('This is a warning');
logger.info('Hello World!');
logger.debug('Hello World!');
```

<p align="right">(<a href="#top">go to top</a>)</p>


#### Tracking

```js
const { tracking } = require('@steplix/microservice');

// Increment: Increments a stat by a value (default is 1)
tracking.increment('my_counter');
// Incrementing multiple items
tracking.increment(['these', 'are', 'different', 'stats']);
// Sampling, this will sample 25% of the time the StatsD Daemon will compensate for sampling
tracking.increment('my_counter', 1, 0.25);

// Decrement: Decrements a stat by a value (default is -1)
tracking.decrement('my_counter');

// Gauge: Gauge a stat by a specified amount
tracking.gauge('my_gauge', 123.45);

// Timing: sends a timing command with the specified milliseconds
tracking.timing('response_time', 42);

// Histogram: send data for histogram stat
tracking.histogram('my_histogram', 42);
// Tags, this will add user-defined tags to the data
tracking.histogram('my_histogram', 42, ['foo', 'bar']);
// Sampling, tags and callback are optional and could be used in any combination
tracking.histogram('my_histogram', 42, 0.25); // 25% Sample Rate
tracking.histogram('my_histogram', 42, ['tag']); // User-defined tag
tracking.histogram('my_histogram', 42, next); // Callback
tracking.histogram('my_histogram', 42, 0.25, ['tag']);
tracking.histogram('my_histogram', 42, 0.25, next);
tracking.histogram('my_histogram', 42, ['tag'], next);
tracking.histogram('my_histogram', 42, 0.25, ['tag'], next);

// Set: Counts unique occurrences of a stat (alias of unique)
tracking.unique('my_unique', 'foobarbaz');
tracking.set('my_unique', 'foobar');
tracking.set(['foo', 'bar'], 42, function(error, bytes){
  // this only gets called once after all messages have been sent
  if (error) {
    console.error('Oh noes! There was an error:', error);
  } else {
    console.log('Successfully sent', bytes, 'bytes');
  }
});
```

<p align="right">(<a href="#top">go to top</a>)</p>


## Tests

In order to see more concrete examples, **I INVITE YOU TO LOOK AT THE TESTS :)**

### Run the unit tests
```sh
npm test
```

<p align="right">(<a href="#top">go to top</a>)</p>


<!-- deep links -->
[install]: #download--install
[how_is_it_used]: #how-is-it-used
[getting_started]: #getting-started
[configure]: #configure
[configure-server]: #for-appserver
[configure-database]: #for-database
[configure-database-replication]: #readwrite-replication-configuration
[configure-logger]: #for-debuglogger
[configure-micro-services]: #for-communication-between-microservices
[configure-services]: #for-services
[configure-statics]: #for-staticspublics-assets
[configure-jwt]: #for-jwt
[configure-cache]: #for-cache
[configure-tracking]: #for-tracking
[configure-doc]: #for-documentation
[communication-between-microservices]: #communication-between-microservices
[interceptors]: #interceptors
[logger]: #logger
[tests]: #tests
