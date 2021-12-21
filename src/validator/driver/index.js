const InvariantError = require('../../exception/InvariantError');
const { DriverPayloadSchema } = require('./schema');

const DriversValidator = {
  validateDriverPayload: (payload) => {
    const validationResult = DriverPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = DriversValidator;