import 'dotenv/config'
export default {
  port: process.env.PORT,
  host:  process.env.HOST,
  dbUri: process.env.DB_URI,
  saltWorkFactor: process.env.SALT,
  accessTokenTtl:process.env.ACCESSTTL,
  refreshTokenTtl: process.env.REFRESHTTL,
  privateKey: process.env.PRIVATE_KEY,
};