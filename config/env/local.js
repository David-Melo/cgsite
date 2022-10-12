module.exports = {
    port: process.env.PORT,
    environment: process.env.NODE_ENV,
    log: {
        level: 'debug'
    }
};

module.exports.socket = {
    adapter: 'redis',
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    db: process.env.REDIS_DB,
    pass: process.env.REDIS_PASS
};

module.exports.session = {
    adapter: 'redis',
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    db: process.env.REDIS_DB,
    pass: process.env.REDIS_PASS,
    prefix: 'sess:'
};