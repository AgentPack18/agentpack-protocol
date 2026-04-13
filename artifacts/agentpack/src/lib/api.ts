const isDev = import.meta.env.DEV;
export const API_BASE = isDev ? "/api" : "/api";
