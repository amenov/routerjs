const express = require('express');

const Router = express.Router();

const checkType = (val, Type) => val.__proto__ === Type.prototype;

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

      const routeMiddleware = route.middleware;

      if (routeMiddleware) {
        if (checkType(routeMiddleware, String)) {
          pushMiddleware(requireMiddleware(routeMiddleware));
        } else if (checkType(routeMiddleware, Array)) {
          for (const handler of routeMiddleware) {
            if (checkType(handler, String)) {
              pushMiddleware(requireMiddleware(handler));
            } else if (checkType(handler, Function)) {
              pushMiddleware(handler);
            }
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

      const routeChildren = route.children;

      if (routeChildren?.length) {
        recursiveFilling(routeChildren, url, middleware);
      }
    }
  };

  recursiveFilling(routes);

  return Router;
};
