module.exports = function(req, res, next) {

    sails.log('router');

    if(req.headers.host=="grovesky.com"||req.headers.host=="www.grovesky.com"){
        return res.redirect('welcome');
    }

    return next();

};
