const express = require('express');

const app = express();

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
