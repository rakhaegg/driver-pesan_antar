
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../exception/InvariantError');
const NotFoundError = require('../exception/NotFoundError');
const AuthenticationError = require('../exception/AuthenticationError');

const mysql = require('mysql2');
const { func } = require('joi');
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

        const result = await this._connection.query(query, [values], function (error, results, fields) {
            if (error) throw error
        })


    }

    async verifyNewUsername(username) {

        var isZero = 0
        const result = await this._connection.query('SELECT username FROM driver WHERE username = ?', [username], function (error, results, fields) {
            isZero = results.length
            console.log(isZero)
        })
        
        let sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
        await sleep(1000)
        if (isZero != 0) {
            throw new InvariantError('User telah ada')
        }
    }


    async getDriverById(userId) {
        var check = 0 
        var result = {"id" : " ", "username" : " " , "fullname" : " "}
        this._connection.query("SELECT id, username, fullname FROM driver WHERE id = ? ", [userId] , function (error, results, fields) {
            if (error) throw error
            result.fullname = results[0].fullname
            result.id = results[0].id
            result.username = results[0].username
            check = results.length
        })
        let sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
        await sleep(1000)

        if (check == 0) throw new NotFoundError('User tidak ditemukan')
        return result
    }   

    async verifyUserCredential(username, password) {
        var isZero = 0

        this._connection.query('SELECT id, password FROM driver WHERE username = ?', [username], async function (error, results, fields) {
            if (error) throw error
            isZero = results.length

            

        })
        let sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
        await sleep(1000)
        
        if (isZero == 0) {
            throw new NotFoundError('Tidak ditemuka')
        }


        var check = false
        this._connection.query('SELECT id, password FROM driver WHERE username = ?', [username], async function (error, results, fields) {
            if (error) throw error
            isZero = results.length

            const { id, password: hashedPassword } = results[0]
            const match = await bcrypt.compare(password, hashedPassword)
            check = match
            return id;


        })
        await sleep(1000)
        if (!check) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah');
        }


    }
}

module.exports = DriverService;