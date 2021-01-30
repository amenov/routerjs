const express = require('express');

const Router = express.Router();

const checkType = (val, Type) => val.constructor === Type;

module.exports = (routes, paths) => {
  const recursiveFilling = (routes, parentUrl = '', parentMiddleware = []) => {
    for (const route of routes) {
      const url = parentUrl + (route.url ?? '');
      const middleware = [...parentMiddleware];

      const pushMiddleware = (handler) => {
        middleware.push(handler);
      };

      const requireMiddleware = (path) => {
        const handler = require(paths.middleware + '/' + path);

        return handler;
      };

      if (route.middleware) {
        const handlers = [];

        if (!checkType(route.middleware, Array)) {
          handlers.push(route.middleware);
        } else {
          handlers.push(...route.middleware);
        }

        for (const handler of handlers) {
          if (checkType(handler, String)) {
            pushMiddleware(requireMiddleware(handler));
          } else if (checkType(handler, Function)) {
            pushMiddleware(handler);
          }
        }
      }

      if (route.method && route.controller) {
        const method = route.method.toLowerCase();
        const [controllerPath, controllerMethod] = route.controller.split('.');

        const controller = require(paths.controllers + '/' + controllerPath);

        Router[method](
          url,
          ...middleware,
          controllerMethod ? controller[controllerMethod] : controller
        );
      }

      if (route.children?.length) {
        recursiveFilling(route.children, url, middleware);
      }
    }
  };

  recursiveFilling(routes);

  return Router;
};
