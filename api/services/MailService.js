var sendgrid  = require('sendgrid')(process.env.SENDGRID_API_KEY);
module.exports = {

    send: function(options,callback){

        sails.hooks.views.render('mail/basic',options, function(err, html) {

            options.html = html;

            var email  = new sendgrid.Email(options);

            sendgrid.send(email,function(err, info){
                if(err) return callback(err);
                return callback(null,info);
            });

        });

    }

};