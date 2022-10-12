var fs = require('fs');

module.exports = {

    find: function (req,res) {

        var params = [];
        _.each(req.route.keys,function(item){
            if(_.isString(req.param(item.name))){
                params.push(req.param(item.name));
            }
        });
        var templatePath = params.join('/');
        console.log('looking for template/' + templatePath);
        res.render(templatePath,{agent:req.session.agent});

    },

    hogan: function(){



    },

    mustache: function (req,res,next) {

        var params = [];
        _.each(req.route.keys,function(item){
            if(_.isString(req.param(item.name))){
                params.push(req.param(item.name));
            }
        });
        var templatePath = 'views/templates/' + params.join('/') + '.mustache';
        console.log('looking for mustache template/' + templatePath);;
        var template = fs.readFile(templatePath, 'utf-8', function (err, template) {
            if (err) next(err);
            res.send(template);
        });

    }

};
