module.exports = (router, routes, paths) => {
  const parser = (arr, parentUrl = "", parentMiddleware = []) => {
    arr.forEach((route) => {
      const url = parentUrl + route.url;

      const middleware = [...parentMiddleware];

      if (route?.middleware?.length) {
        route.middleware.forEach((middlewarePath) =>
          middleware.push(require(paths.middleware + middlewarePath))
        );
      }

      if (route.method && route.controller) {
        const method = route.method.toLowerCase();

        const [controllerPath, controllerMethod] = route.controller.split(".");

        const controller = require(paths.controllers + controllerPath);

        router[method](url, ...middleware, controller[controllerMethod]);
      }

      if (route?.children?.length) parser(route.children, url, middleware);
    });
  };

  parser(routes);

  return router;
};
