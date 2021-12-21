const DriverHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'drivers',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const usersHandler = new DriverHandler( service, validator);
    server.route(routes(usersHandler));
  },
};