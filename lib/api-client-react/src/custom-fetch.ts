export type AuthTokenGetter = () => Promise<string | null>;

let authTokenGetter: AuthTokenGetter | null = null;

export const setBaseUrl = (_url: string) => {};
export const setAuthTokenGetter = (getter: AuthTokenGetter) => {
  authTokenGetter = getter;
};

export const customFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const fullUrl = url.startsWith("http") ? url : url;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  return fetch(fullUrl, { ...options, headers });
};
