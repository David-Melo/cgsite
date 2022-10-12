/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

    // Utility Views
    '/template/find/:a?/:b?/:c?': 'TemplateController.find',
    '/template/mustache/:folder/:file': 'TemplateController.mustache',

    // Site Routes
    '/': 'Site.index',
    '/about': 'SiteController.about',
    '/agents': 'SiteController.agents',
    '/services': 'SiteController.services',
    '/contact': 'SiteController.contact',

    '/search': 'SearchController.index',

    '/listings/:mls': 'ListingsController.index',
    '/print/:mls/:agent': 'ListingsController.print',

/*    // Custom Listing Pages
    '/3304virginia' : 'ListingsController.3304virginia',
    '/7402sw122ct' : 'ListingsController.7402sw122ct',
    '/7666pinemanor': 'ListingsController.pinemanor',
    '/costabella': 'ListingsController.costabella',
    '/2801nw102st': 'ListingsController.2801nw102st',
    '/600sw122ct': 'ListingsController.600sw122ct',
    '/birdroadtownhomes': 'ListingsController.birdroadtownhomes',
    '/iconbrickell1803': 'ListingsController.iconbrickell1803',
    '/9325sw68st': 'ListingsController.9325sw68st',
    '/6360sw39st': 'ListingsController.6360sw39st'*/

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
