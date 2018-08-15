import path from 'path';

export default = {
  "config": path.resolve('./server/server/config', 'config.json'),
  "models-path": path.resolve('./server/server/models'),
  "seeders-path": path.resolve('./server/server/seeders'),
  "migrations-path": path.resolve('./server/server/migrations')
};
