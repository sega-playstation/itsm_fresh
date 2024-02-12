export function TokensExist() {
  let authtoken =
    localStorage.getItem('ITSM-ACC') || sessionStorage.getItem('ITSM-ACC');
  let reftoken =
    localStorage.getItem('ITSM-REFRESH') ||
    sessionStorage.getItem('ITSM-REFRESH');

  return authtoken != null && reftoken != null;
}

export function ClearTokens() {
  localStorage.removeItem('ITSM-ACC');
  localStorage.removeItem('ITSM-REFRESH');
  sessionStorage.removeItem('ITSM-ACC');
  sessionStorage.removeItem('ITSM-REFRESH');
}

export function TokenType() {
  if (localStorage.getItem('ITSM-REFRESH') != null) return localStorage;
  if (sessionStorage.getItem('ITSM-REFRESH') != null) return sessionStorage;
  return null;
}
