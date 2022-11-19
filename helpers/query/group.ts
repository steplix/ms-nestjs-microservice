//
// constants
//
const defaultSeparator = ",";

//
// source code
//
export const group = (query: any): any => {
  if (!query || !query.group) {
    return;
  }
  return query.group.split(query.groupSeparator || defaultSeparator);
};
