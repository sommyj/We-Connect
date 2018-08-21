import path from 'path';

const configPaths = {
  "config": path.resolve('./server/server/config', 'config.json'),
  "models-path": path.resolve('./server/server/models'),
  "seeders-path": path.resolve('./server/server/seeders'),
  "migrations-path": path.resolve('./server/server/migrations')
};

export default configPaths;
