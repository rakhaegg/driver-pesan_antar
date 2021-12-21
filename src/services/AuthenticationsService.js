const mysql = require('mysql');
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

    await this._connection.query("INSERT INTO authentications VALUES (?) ", [token], function (error, results, fields) {
      if (error) throw error

    });
  }

  async verifyRefreshToken(token) {
    var checkTokenValid = 0
    await this._connection.query("SELECT token FROM authentications WHERE token = ? ", [token], function (error, results, fields) {
      if (error) throw error
      checkTokenValid = results.length

    });

    let sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    await sleep(1000)

    if (checkTokenValid == 0) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async deleteRefreshToken(token) {
    await this.verifyRefreshToken(token);


    await this._connection.query("DELETE FROM authentications WHERE token = ? ", [token], function (error, results, fields) {
      if (error) throw error

    });
  }
}

module.exports = AuthenticationsService;