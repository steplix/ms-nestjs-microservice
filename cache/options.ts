import { trues } from "../constants";

/**
 * Indicate if Cache feature is enabled
 */
export const isCacheEnabled = trues.includes(String(process.env.CACHE_ENABLED).toLowerCase());
