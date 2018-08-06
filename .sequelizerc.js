const path = require('path');

module.exports = {
  "config": path.resolve('./lib/server/config', 'config.json'),
  "models-path": path.resolve('./lib/server/models'),
  "seeders-path": path.resolve('./lib/server/seeders'),
  "migrations-path": path.resolve('./lib/server/migrations')
};
