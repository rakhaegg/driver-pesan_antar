

require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')




// authentications
const authentications = require('./api/authentications')
const AuthenticationsService = require('./services/AuthenticationsService')
const TokenManager = require('./tokenize/TokenManager')
const AuthenticationsValidator = require('./validator/authentications');


// driver
const driver = require('./api/driver')
const DriverService = require('./services/DriversService')
const DriversValidator = require('./validator/driver')


// mysql


const init = async () => {
    
    const driverService = new DriverService()
    const authenticationsService = new AuthenticationsService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            }
        }

    })

    await server.register([
        {
            plugin: Jwt
        }
    ])

    server.auth.strategy('pesan_antar_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    })


    await server.register([
      
        {
            plugin: driver,
            options: {
                service: driverService,
                validator: DriversValidator
            }
        },
        {
            plugin: authentications,
            options: {
                authenticationsService,
                driverService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            },
        },


    ]);
    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
}
init()