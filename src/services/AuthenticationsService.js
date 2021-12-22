const mysql = require('mysql2');
const InvariantError = require('../exception/InvariantError');

class AuthenticationsService {
  constructor() {
    this._connection = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      database: process.env.DB_DATABASE,
      port: 3306
    });
  }

  async addRefreshToken(token) {
    const promisePool = this._connection.promise()

    await promisePool.query("INSERT INTO authentications VALUES (?) ", [token])


  }

  async verifyRefreshToken(token) {
    const promisePool = this._connection.promise()
    const [rows , fields] = await promisePool.query("SELECT token FROM authentications WHERE token = ? ", [token] )

    if (rows.length  == 0){
      throw new InvariantError('User tidak ditemukan')
    }
  }

  async deleteRefreshToken(token) {
    await this.verifyRefreshToken(token);
    const promisePool = this._connection.promise()


    await promisePool.query("DELETE FROM authentications WHERE token = ? ", [token])
  }
}

module.exports = AuthenticationsService;