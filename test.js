const test = require('./index');

const routes = [
  {
    method: 'GET',
    url: '/',
    middleware: 'test',
    controller: 'test.controller',
  },
];

const paths = {
  controllers: __dirname + '/controllers',
  middleware: __dirname + '/middleware',
};

const Router = test(routes, paths);

console.log(Router);
