import { isObject, isString, reduce } from "lodash";

//
// constants
//
const defaultSeparator = ",";
const defaultConcatenator = ".";
const defaultRemotePrefix = "r-";
const mapTypes = {
  fields: "attributes",
};

//
// helpers
//
const getDefaultSeparator = (type: string, options: any): string => {
  return (isObject(options) ? options[`${type}Separator`] : defaultSeparator) || defaultSeparator;
};

const getDefaultConcatenator = (type: string, options: any): string => {
  return (isObject(options) ? options[`${type}Concatenator`] : defaultConcatenator) || defaultConcatenator;
};

/**
 * Indicate if property is remote property
 *
 *   r-person
 *   \/ -> This is the remote prefix. Then, return true
 *
 *   person
 *   \____/ -> This is the normal property. Then, return false
 */
const isRemoteProperty = (property: string): boolean => property.startsWith(defaultRemotePrefix);

/**
 * Normalize remote property if necesary
 *
 *   r-person
 *   \______/ -> This is the remote prefix. Then, return "person"
 *
 *   person
 *   \____/ -> This is the normal property. Then, return "person"
 */
const normalizeRemoteProperty = (property: string): string => property.replace(defaultRemotePrefix, "");

/**
 * Save related property in correct location
 *
 *   r-person
 *   \______/ -> This is the remote prefix. Then, save in opts.remotes
 *
 *   person
 *   \____/ -> This is the normal property. Then, save in carry
 */
const resolveProperty = (opts: any, property: string, carry: any) => {
  // Check if property is remote property
  //
  //   r-person
  //   \/ -> This is the remote prefix
  //
  if (isRemoteProperty(property)) {
    const rawProperty = normalizeRemoteProperty(property);
    opts.remotes = opts.remotes || [];

    if (!opts.remotes.includes(rawProperty)) {
      opts.remotes.push(rawProperty);
    }
  }
  // Handle simple property
  //
  //   user
  //   \__/ -> This is the simple property
  //
  else if (!carry.includes(property)) {
    carry.push(property);
  }
};

const resolveRelationship = (context: any, type: string, property: string): any => {
  type = mapTypes[type] || type;

  if (!isRemoteProperty(property)) {
    context[type] = context[type] || [];
  }
  resolveProperty(context, property, context[type]);
};

//
// source code
//
export const properties = (query: any, type: string, options: any = {}): any => {
  if (!query || !query[type]) {
    return;
  }

  const concatenator = getDefaultConcatenator(type, options);
  const properties = isString(query[type]) ? query[type].split(getDefaultSeparator(type, options)) : query[type];
  const opts: any = {
    [type]: [],
  };

  opts[type] = reduce(
    properties,
    (carry, property) => {
      let isFirstLevelProperty = true;
      let parentPropertyName;
      let parentPropertyOpts;

      // Check if property is complex.
      //
      //  user.status
      //      | -> This is the concatenator
      //
      if (property.includes(concatenator)) {
        property.split(concatenator).forEach((partOfProperty: string) => {
          const rawProperty = normalizeRemoteProperty(partOfProperty);

          // Check if is initial part of property.
          //
          //  user.status
          //  \__/ -> This part
          //
          if (isFirstLevelProperty) {
            isFirstLevelProperty = false;
            resolveProperty(opts, partOfProperty, carry);
          } else {
            // prepare relations options
            parentPropertyOpts.relations = parentPropertyOpts.relations || {};
            parentPropertyOpts.relations[parentPropertyName] = parentPropertyOpts.relations[parentPropertyName] || {};

            // Resolve no first parts of property.
            //
            //  user.status...
            //       \_____________ -> This parts
            //
            resolveRelationship(parentPropertyOpts.relations[parentPropertyName], type, partOfProperty);
          }

          // save previous property options
          parentPropertyOpts =
            (parentPropertyOpts &&
              parentPropertyOpts.relations &&
              parentPropertyOpts.relations[parentPropertyName || rawProperty]) ||
            opts;

          // save previous property name
          parentPropertyName = normalizeRemoteProperty(partOfProperty);
        });
      }
      // Handle single property
      //
      //  status
      //    | -> Property without concatenator
      //
      else {
        resolveProperty(opts, property, carry);
      }
      return carry;
    },
    opts[type]
  );

  return opts;
};
