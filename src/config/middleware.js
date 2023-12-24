
const bodyParser = require('body-parser');

const setupMiddleware = (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
};

module.exports = setupMiddleware;