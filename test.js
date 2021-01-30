const express = require('express');

const app = express();

const test = require('./index');

const testMiddleware = require('./middleware/test');

const routes = [
  {
    method: 'GET',
    url: '/test',
    middleware: testMiddleware,
    controller: 'test.controller',
    children: [
      {
        method: 'GET',
        url: '/children',
        controller: 'test.controller',
      },
    ],
  },
  {
    method: 'GET',
    url: '/test-2',
    middleware: 'test',
    controller: 'test.controller',
    children: [
      {
        method: 'GET',
        url: '/children',
        middleware: 'test',
        controller: 'test.controller',
      },
    ],
  },
];

const paths = {
  controllers: __dirname + '/controllers',
  middleware: __dirname + '/middleware',
};

const Router = test(routes, paths);

console.log(Router);

app.use('/', Router);

//  ###  ---------------------------------------------- ||
//  ###  const Router = express.Router();
//  ###
//  ###  Router.get(
//  ###    '/',
//  ###    require('./middleware/test'),
//  ###    require('./controllers/test').controller
//  ###  );
//  ###
//  ###  console.log(Router);
//  ###
//  ###  app.use('/', Router);
//  ###  ---------------------------------------------- ||

const PORT = process.env.PORT ?? 7777;

app.listen(PORT, () => {
  console.log('App listening on port: ' + PORT);
  console.log('Press Ctrl+C to quit.');
});
