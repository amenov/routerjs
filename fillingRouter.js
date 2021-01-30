const express = require('express');

const Router = express.Router();

const checkType = (val, Type) => val.__proto__ === Type.prototype;

module.exports = (routes, paths) => {
  const recursiveFilling = (routes, prevUrl = '', prevMiddleware = []) => {
    for (const route of routes) {
      prevUrl = prevUrl + (route.url ?? '');
      prevMiddleware = [...prevMiddleware];

      const pushPrevMiddleware = (middleware) => {
        prevMiddleware.push(middleware);
      };

      const requireMiddleware = (path) => {
        return require(paths.middleware + '/' + path);
      };

      const routeMiddleware = route.middleware;

      if (routeMiddleware) {
        if (checkType(routeMiddleware, String)) {
          pushPrevMiddleware(requireMiddleware(routeMiddleware));
        } else if (checkType(routeMiddleware, Array)) {
          for (const middleware of routeMiddleware) {
            if (checkType(middleware, String)) {
              pushPrevMiddleware(requireMiddleware(middleware));
            } else if (checkType(middleware, Function)) {
              pushPrevMiddleware(middleware);
            }
          }
        }
      }

      if (route.method && route.controller) {
        const method = route.method.toLowerCase();
        const url = prevUrl;
        const middleware = prevMiddleware;
        const [controllerPath, controllerMethod] = route.controller.split('.');

        const controller = require(paths.controllers + '/' + controllerPath);

        Router[method](
          url,
          ...middleware,
          controllerMethod ? controller[controllerMethod] : controller
        );
      }

      if (route.children?.length) {
        recursiveFilling(route.children, prevUrl, prevMiddleware);
      }
    }
  };

  recursiveFilling(routes);

  return Router;
};
