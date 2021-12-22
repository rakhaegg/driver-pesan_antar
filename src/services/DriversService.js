
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../exception/InvariantError');
const NotFoundError = require('../exception/NotFoundError');
const AuthenticationError = require('../exception/AuthenticationError');

const mysql = require('mysql2');
const { func } = require('joi');
const { use } = require('bcrypt/promises');
class DriverService {
    constructor() {
        this._connection = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            database: process.env.DB_DATABASE,
            port: 3306
        });
    }

    async addDriver({ username, password, fullname }) {
        await this.verifyNewUsername(username);
        const id = `driver-${nanoid(16)}`;
        const hashedPassword = await bcrypt.hash(password, 10);
        var query = 'INSERT INTO driver VALUES ? '
        var values = [
            [id, username, hashedPassword, fullname],
        ]
        this._connection.promise().query(query, [values]).then((results) => {
        }).catch(console.log)
    }

    async verifyNewUsername(username) {
        const promisePool = this._connection.promise()
        const [rows, fields] = await promisePool.query('SELECT username FROM driver WHERE username = ?', [username])
        if (rows.length != 0) {
            throw new InvariantError('User telah ada')
        }
    }


    async getDriverById(userId) {
        var result = { "id": " ", "username": " ", "fullname": " " }
        const promisePool = this._connection.promise()
        const [rows, fields] = await promisePool.query("SELECT id, username, fullname FROM driver WHERE id = ? ", [userId])
        if (rows.length == 0) {
            throw new NotFoundError('User tidak ada')
        }
        result.id = rows[0].id
        result.username = rows[0].username
        result.fullname = rows[0].fullname
        return result
    }

    async verifyUserCredential(username, password) {
        const promisePool = this._connection.promise()


        const [rows , fields ] = await promisePool.query('SELECT id, password FROM driver WHERE username = ?' , [username])
        
        if (rows.length == 0) {
            throw new NotFoundError('User tidak ada')
        }
        const { id, password: hashedPassword } = rows[0]

        const match = await bcrypt.compare(password, hashedPassword)
        if(!match){
            throw new AuthenticationError('Kredensial yang diberikan salah')
        }
        // const [rows , fields  ] =  await promisePool.query('SELECT id, password FROM driver WHERE username = ?'  . [username])
        return id

    }
}

module.exports = DriverService;