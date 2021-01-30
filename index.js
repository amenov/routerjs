const fillingRouter = require('./fillingRouter');

module.exports = (routes, paths) => {
  const Router = fillingRouter(routes, paths);

  return Router;
};
