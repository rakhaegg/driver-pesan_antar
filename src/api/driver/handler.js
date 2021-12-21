
const ClientError = require('../../exception/ClientError');

class DriverHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postDriverHandler = this.postDriverHandler.bind(this);
    this.getDriverByIdHandler = this.getDriverByIdHandler.bind(this);
  }

  async postDriverHandler(request, h) {
    try {
      console.log(typeof this._validator)
      this._validator.validateDriverPayload(request.payload);
      const { username, password, fullname } = request.payload;

      const driverId = await this._service.addDriver({ username, password, fullname });

      const response = h.response({
        status: 'success',
        message: 'User berhasil ditambahkan',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getDriverByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const user = await this._service.getDriverById(id);
      return {
        status: 'success',
        data: {
          user,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = DriverHandler;