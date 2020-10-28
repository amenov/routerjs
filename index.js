const router = require("express").Router();

module.exports = (routes, paths) => {
  const parser = (routes, parentUrl = "", parentMiddleware = []) => {
    routes.forEach((route) => {
      const url = parentUrl + route.url ? route.url : "";

      const middleware = [...parentMiddleware];

      if (route.middleware) {
        if (!Array.isArray(route.middleware)) {
          route.middleware = route.middleware.split();
        }

        route.middleware.forEach((middlewarePath) => {
          middleware.push(require(paths.middleware + middlewarePath));
        });
      }

      if (route.method && route.controller) {
        const method = route.method.toLowerCase();

        const [controllerPath, controllerMethod] = route.controller.split(".");

        const controller = require(paths.controllers + controllerPath);

        router[method](url, ...middleware, controller[controllerMethod]);
      }

      if (route.children?.length) {
        parser(route.children, url, middleware);
      }
    });
  };

  parser(routes);

  return router;
};
