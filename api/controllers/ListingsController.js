var algoliasearch = require('algoliasearch');
module.exports = {

    index: function(req,res){

        var mls = req.param('mls');

        var client = algoliasearch(process.env.algoliaApp, process.env.algoliaKey);
        var index = client.initIndex("listings");

        index.search({
            facetFilters:  [
                "mls:" + mls
            ]
        }, function(err, results) {

            if (err) return res.serverError(err);

            if ( !results.hits.length || results.hits.length > 1 ) return res.notFound();

            var listing = results.hits[0];

            listing.address = listing.full_address;
            listing.link = 'http://www.canerogroup.com/listings/' + listing.mls;

            // Get All Listed Agents
            Agents.find({listed:true}).populate('image').exec(function(err, agents){
                if (err) return res.serverError(err);

                var agent = agents[Math.floor(Math.random() * agents.length)];

                var things;

                return res.view({
                    source: listing.model,
                    listing: listing,
                    agent: agent,
                    mode: 'global'
                });

            });
            
        });


    },

    print: function (req,res) {

        var mls = req.param('mls');
        var agentId = req.param('agent');

        var client = algoliasearch(process.env.algoliaApp, process.env.algoliaKey);
        var index = client.initIndex("listings");

        index.search({
            facetFilters:  [
                "mls:" + mls
            ]
        }, function(err, results) {

            if(!results.hits.length || results.hits.length > 1) return res.notFound();

            var listing = results.hits[0];

            listing.address = listing.full_address;
            listing.link = 'http://www.canerogroup.com/listings/' + listing.mls;

            Agents.findOne(agentId).populate('image').exec(function foundAgent (err, agent){
                if(err) return res.serverError(err);
                if(!agent) return res.notFound(err);
                return res.view({
                    agents: [agent],
                    source: listing.model,
                    listing: listing,
                    agent: agent,
                    mode: 'global'
                });

            });
        });

    },

    'pinemanor': function (req, res){
        return res.redirect('/');
    },

    'birdroadtownhomes': function (req, res){
        return res.redirect('/');
    },

    'costabella': function (req, res){

        // 339954714

        AgencyListings.findOne({sysid:339954714}, function foundListing (err, listing){

            if(err) return res.serverError(err);
            if(!listing) return res.notFound();

            listing.source = listing.model;
            listing.address = listing.full_address;
            listing.link = 'http://www.costabella1507.com';

            Agents.findOne({id:5}).populate('image').exec(function foundAgent (err, agent){
                if(err) return res.serverError(err);

                return res.view('listings/index',{
                    agents: [agent],
                    source: listing.model,
                    listing: listing,
                    agent: req.session.agent ? req.session.agent : agent,
                    mode: req.session.agent ? 'agent' : 'global'
                });
            });

        });

    },

    '2801nw102st': function (req, res){

        // 340085930

        AgencyListings.findOne({sysid:340085930}, function foundListing (err, listing){

            if(err) return res.serverError(err);
            if(!listing) return res.notFound();

            listing.source = listing.model;
            listing.address = listing.full_address;
            listing.link = 'http://www.2801nw102st.com';

            Agents.findOne({id:5}).populate('image').exec(function foundAgent (err, agent){
                if(err) return res.serverError(err);

                return res.view('listings/index',{
                    agents: [agent],
                    source: listing.model,
                    listing: listing,
                    agent: req.session.agent ? req.session.agent : agent,
                    mode: req.session.agent ? 'agent' : 'global'
                });
            });

        });

    },

    '600sw122ct': function (req, res){

        // 340782981

        AgencyListings.findOne({sysid:340782981}, function foundListing (err, listing){

            if(err) return res.serverError(err);
            if(!listing) return res.notFound();

            listing.source = listing.model;
            listing.address = listing.full_address;
            listing.link = 'http://www.600sw122ct.com';

            Agents.findOne({id:5}).populate('image').exec(function foundAgent (err, agent){
                if(err) return res.serverError(err);

                return res.view('listings/index',{
                    agents: [agent],
                    source: listing.model,
                    listing: listing,
                    agent: req.session.agent ? req.session.agent : agent,
                    mode: req.session.agent ? 'agent' : 'global'
                });
            });

        });

    },

    '3304virginia': function (req, res){

        // 341337751

        AgencyListings.findOne({sysid:341337751}, function foundListing (err, listing){

            if(err) return res.serverError(err);
            if(!listing) return res.notFound();

            listing.source = listing.model;
            listing.address = listing.full_address;
            listing.link = 'http://www.3304virginia.com';

            Agents.findOne({id:159}).populate('image').exec(function foundAgent (err, agent){
                if(err) return res.serverError(err);

                return res.view('listings/index',{
                    agents: [agent],
                    source: listing.model,
                    listing: listing,
                    agent: req.session.agent ? req.session.agent : agent,
                    mode: req.session.agent ? 'agent' : 'global'
                });
            });

        });

    },

    '7402sw122ct': function (req, res){

        // 341544062

        AgencyListings.findOne({sysid:341544062}, function foundListing (err, listing){

            if(err) return res.serverError(err);
            if(!listing) return res.notFound();

            listing.source = listing.model;
            listing.address = listing.full_address;
            listing.link = 'http://www.7402sw122ct.com';

            Agents.findOne({id:143}).populate('image').exec(function foundAgent (err, agent){
                if(err) return res.serverError(err);

                return res.view('listings/index',{
                    agents: [agent],
                    source: listing.model,
                    listing: listing,
                    agent: req.session.agent ? req.session.agent : agent,
                    mode: req.session.agent ? 'agent' : 'global'
                });
            });

        });

    },

    'iconbrickell1803': function (req, res){

        // 341794160

        AgencyListings.findOne({sysid:341794160}, function foundListing (err, listing){

            if(err) return res.serverError(err);
            if(!listing) return res.notFound();

            listing.source = listing.model;
            listing.address = listing.full_address;
            listing.link = 'http://www.iconbrickell1803.com';

            Agents.findOne({email:'Mchacin@CaneroGroup.com'}).populate('image').exec(function foundAgent (err, agent){
                if(err) return res.serverError(err);

                console.log(agent)

                return res.view('listings/index',{
                    agents: [agent],
                    source: listing.model,
                    listing: listing,
                    agent: req.session.agent ? req.session.agent : agent,
                    mode: req.session.agent ? 'agent' : 'global'
                });
            });

        });

    },

    '9325sw68st': function (req, res){

        // 342144886

        AgencyListings.findOne({sysid:342144886}, function foundListing (err, listing){

            if(err) return res.serverError(err);
            if(!listing) return res.notFound();

            listing.source = listing.model;
            listing.address = listing.full_address;
            listing.link = 'http://www.9325sw68st.com';

            Agents.findOne({email:'Jose@CaneroGroup.com'}).populate('image').exec(function foundAgent (err, agent){
                if(err) return res.serverError(err);

                console.log(agent)

                return res.view('listings/index',{
                    agents: [agent],
                    source: listing.model,
                    listing: listing,
                    agent: req.session.agent ? req.session.agent : agent,
                    mode: req.session.agent ? 'agent' : 'global'
                });
            });

        });

    },

    '6360sw39st': function (req, res){

        // 342954556

        AgencyListings.findOne({sysid:342954556}, function foundListing (err, listing){

            if(err) return res.serverError(err);
            if(!listing) return res.notFound();

            listing.source = listing.model;
            listing.address = listing.full_address;
            listing.link = 'http://www.6360sw39st.com';

            Agents.findOne({email:'Jose@CaneroGroup.com'}).populate('image').exec(function foundAgent (err, agent){
                if(err) return res.serverError(err);

                return res.view('listings/index',{
                    agents: [agent],
                    source: listing.model,
                    listing: listing,
                    agent: req.session.agent ? req.session.agent : agent,
                    mode: req.session.agent ? 'agent' : 'global'
                });
            });

        });

    }

};