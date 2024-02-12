const _access_token_name = 'ITSM-ACC';
const _refresh_token_name = 'ITSM-REF';

export const GetAccessToken = () =>
  localStorage.getItem(_access_token_name) ||
  sessionStorage.getItem(_access_token_name);
export const GetRefreshToken = () =>
  localStorage.getItem(_refresh_token_name) ||
  sessionStorage.getItem(_refresh_token_name);
export const GetTokens = () => ({
  access: GetAccessToken(),
  refresh: GetRefreshToken(),
});
export const SetAccessToken = (storage_medium, token_data) =>
  storage_medium.setItem(_access_token_name, token_data);
export const SetRefreshToken = (storage_medium, token_data) =>
  storage_medium.setItem(_refresh_token_name, token_data);

export const ClearAccessToken = () => {
  localStorage.removeItem(_access_token_name);
  sessionStorage.removeItem(_access_token_name);
};

export const ClearRefreshToken = () => {
  localStorage.removeItem(_refresh_token_name);
  sessionStorage.removeItem(_refresh_token_name);
};
export const ClearTokens = () => {
  ClearAccessToken();
  ClearRefreshToken();
};

export const TokensExist = () =>
  GetAccessToken() != null && GetRefreshToken() != null;

export const TokenType = () => {
  if (localStorage.getItem(_refresh_token_name) != null) return localStorage;
  if (sessionStorage.getItem(_refresh_token_name) != null)
    return sessionStorage;
  return null;
};
