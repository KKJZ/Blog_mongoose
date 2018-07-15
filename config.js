'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || "mongod://localhost/Blog";
exports.PORT = process.env.PORT || 8080;