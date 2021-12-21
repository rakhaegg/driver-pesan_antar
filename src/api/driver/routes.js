const routes = (handler) => [
    {
      method: 'POST',
      path: '/drivers',
      handler: handler.postDriverHandler,
    },
    {
      method: 'GET',
      path: '/drivers/{id}',
      handler: handler.getDriverByIdHandler,
    },

    
  ];
  
  module.exports = routes;