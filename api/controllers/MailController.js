var sendgrid  = require('sendgrid')(process.env.SENDGRID_API_KEY);
module.exports = {

    grovesky: function(req,res,next){

        var payload = req.body;

        var options = {
            to: ['davidmelo@desmdesigns.com'],
            subject: 'GroveSky Contact Form Submission',
            from: "admin@canerogroup.com",
            fromname: "GroveSky.com",
            replyto: "NoReply@canerogroup.com"
        };

        var body = '';

        _.each(payload.data,function(item){
            console.log(item);
            body = body + '<tr><td>' + item.name + '</td><td>' + item.value + '</td></tr>'
        });

        options.partials = {
            header: "<table width='100%'><tr><td style='text-align:left'>GroveSky Contact Form Submission</td><td style='text-align:right'>GroveSky</td></tr></table>",
            body: '<table>' + body + '</table>',
            footer: "<p>You have been marked as a contact form recipient by an site administrator. <br>GroveSky</p>"
        };
        
        MailService.send(options,function(err,data){
            if(err) return res.serverError(err);
            return res.ok(data);
        });

    },

    send: function(req,res,next){

        var payload = req.body;

        var options = {
            to: ['admin@canerogroup.com','info@canerogroup.com','jose@canerogroup.com',payload.contact],
            subject: payload.subject,
            from: "admin@canerogroup.com",
            fromname: "The Canero Group",
            replyto: "NoReply@canerogroup.com"
        };

        options.partials = {
            header: "<table width='100%'><tr><td style='text-align:left'>" + payload.subject + "</td><td style='text-align:right'>The Canero Group</td></tr></table>",
            body: payload.body,
            footer: "<p>You have been marked as a contact form recipient by an site administrator. <br>The Canero Group</p>"
        };

        MailService.send(options,function(err,data){
            if(err) return res.serverError(err);
            return res.ok(data);
        });

    },

    share: function (req,res) {

        var payload = {
            email: req.body.email,
            link: req.body.link,
            address: req.body.address,
            message: req.body.message,
            image: req.body.image,
            maps: req.body.maps
        };

        var options = {
            to: ['admin@canerogroup.com','info@canerogroup.com','jose@canerogroup.com',req.body.contact],
            subject: 'Somebody has shared a listing with you.',
            from: "admin@canerogroup.com",
            fromname: "The Canero Group",
            replyto: "NoReply@canerogroup.com"
        };

        sails.hooks.views.render('email/share',{data: payload}, function(err, html) {
            if(err) console.log(err);

            options.html = html;

            MailService.send(options,function(err,data){
                if(err) return res.serverError(err);
                return res.ok(data);
            });

        });

    }

};