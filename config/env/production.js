/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/


  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

    port: process.env.PORT,
    environment: process.env.NODE_ENV,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

    log: {
        level: 'error'
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