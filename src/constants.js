/**
 * @type {{ ADMIN: "ADMIN"; USER: "USER"} as const}
 */
export const UserRolesEnum = {
    ADMIN: "ADMIN",
    USER: "USER",
  };
export const AvailableUserRoles = Object.values(UserRolesEnum);
export const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000; // 20 minutes
 
export const DB_NAME = "bitspeed-data";

  export const UserLoginType = {
    GOOGLE: "GOOGLE",
    EMAIL_PASSWORD: "EMAIL_PASSWORD",
  };
  
  export const AvailableSocialLogins = Object.values(UserLoginType);