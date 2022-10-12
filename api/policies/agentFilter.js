module.exports = function(req, res, next) {

    sails.log('agent-filter');

    // Check to See If We Have A Site Context Already
    if(req.session.site){
        return next();
    }

    // If We Want The Root Sites
    if(req.headers.host=='www.canerogroup.com'||req.headers.host=='canerogroup.com'){

        // Get All Listed Agents
        Agents.find({listed:true}).populate('image').exec(function(err, agents){
            if(err) sails.log(err);
            if(!agents.length) return next();

            // Get Random Listed Agent
            var agent = agents[Math.floor(Math.random() * agents.length)];
            req.session.agent = agent;
            req.session.site = req.headers.host;
            req.session.mode = 'global';
            return next();

        });

    } else {

        // If Not, Lets Try To Match An Agent
        Agents.findOne({url:req.headers.host}).populate('image').exec(function(err,agent){
            if(err) sails.log(err);

            // If No Agent, Get Random And Send to Site
            if(!agent){

                // Get All Listed Agents
                Agents.find({listed:true}).populate('image').exec(function(err, agents){
                    if(err) sails.log(err);
                    if(!agents.length) return next();
                    // Get Random Listed Agent
                    var agent = agents[Math.floor(Math.random() * agents.length)];
                    req.session.agent = agent;
                    req.session.site = agent.url;
                    req.session.mode = 'global';
                    return next();

                });

            } else {

                // If We Found An Agent, Set It
                req.session.agent = agent;
                req.session.site = agent.url;
                req.session.mode = 'agent';
                return next();

            }

        });

    }

};
