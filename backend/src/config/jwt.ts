export const jwtConfig = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'dev_access_secret_change_in_production',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_in_production',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
};
