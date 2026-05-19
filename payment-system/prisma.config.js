'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const node_path_1 = require('node:path');
const dotenv_1 = require('dotenv');
const config_1 = require('prisma/config');
(0, dotenv_1.config)({
  path: node_path_1.default.resolve(process.cwd(), '.env'),
});
exports.default = (0, config_1.defineConfig)({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  engine: 'classic',
  datasource: {
    url: (0, config_1.env)('DATABASE_URL'),
  },
});
//# sourceMappingURL=prisma.config.js.map
