import 'dotenv/config'

export default {
  port: Number(process.env.DB_PORT),
  host: process.env.DB_HOST,
  dbUri: process.env.DB_URI,
  saltWorkFactor: Number(process.env.SALT_WORK_FACTOR),
  accessTokenTtl: process.env.ACCESS_TOKEN_TL,
  refreshTokenTtl: process.env.REFRESH_TOKEN_TL,
  privateKey: process.env.PRIVATE_KEY
};
