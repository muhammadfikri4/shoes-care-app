export const CONFIG_APP = {
  APP_NAME: import.meta.env.DSC_APP_NAME,
  BASE_URL: import.meta.env.DSC_BASE_URL,
  TOKEN_KEY: btoa(`token${import.meta.env.DSC_SECRET_KEY ?? ""}`),
  REFRESH_TOKEN_KEY: btoa(`refresh${import.meta.env.DSC_SECRET_KEY ?? ""}`),
};

export const API_ENDPOINT = {
  auth: {
    refreshToken: `${CONFIG_APP.BASE_URL}/auth/refresh-token`,
    login: `${CONFIG_APP.BASE_URL}/auth/login`,
    register: `${CONFIG_APP.BASE_URL}/auth/register`,
  },
  check: `${CONFIG_APP.BASE_URL}/check`,
  user: {
    base: `${CONFIG_APP.BASE_URL}/users`,
    profile: `${CONFIG_APP.BASE_URL}/users/profile/me`,
  },
  friend: {
    base: `${CONFIG_APP.BASE_URL}/friends`,
    add: `${CONFIG_APP.BASE_URL}/friends/add`,
  },
  pos: {
    racks: `${CONFIG_APP.BASE_URL}/racks`,
    transactions: `${CONFIG_APP.BASE_URL}/transactions`,
    transactionsMy: `${CONFIG_APP.BASE_URL}/transactions/my`,
    transactionsScan: `${CONFIG_APP.BASE_URL}/transactions/scan`,
    transactionsLookup: `${CONFIG_APP.BASE_URL}/transactions/lookup`,
  },
  authOtp: {
    request: `${CONFIG_APP.BASE_URL}/auth/customer-otp/request`,
    verify: `${CONFIG_APP.BASE_URL}/auth/customer-otp/verify`,
  },
};
