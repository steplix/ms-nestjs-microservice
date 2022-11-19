import { map } from "lodash";
import { fn, col } from "sequelize";
import { properties } from "./properties";

//
// source code
//
export const fields = (query: any, options: any = {}): any => {
  const result = properties(query, "fields", options);

  if (result && result.fields) {
    const fields = map(result.fields, (field) => {
      const parts = field.split("-");

      if (parts.length <= 1) {
        return field;
      }
      return [fn(parts[0], col(parts[1])), parts[2] || (parts[1] !== "*" ? parts[1] : parts[0])];
    });

    result.fields = fields && fields.length === 1 && fields[0] === "*" ? null : fields;
  }
  return result;
};
