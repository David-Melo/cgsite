var _ = require('lodash');
module.exports = {

    index: function (req,res) {

        var sites = {
            '8952sw10ter.com': {
                mls: 'A10966201',
                agent: 'Jose@CaneroGroup.com'
            }
        }

        let matchedSite = sites[req.header('host')];

        if ( !matchedSite ) {
            
            var emptySearch = Object.keys(req.query).length === 0 && req.query.constructor === Object;

            if(!emptySearch){
    
                SearchService.find({
                    query: req.originalUrl,
                    params: req.query
                },function(err,data){
                    if (err) return res.serverError(err);
    
                    return res.view({
                        search: req.query || false,
                        agent: req.session.agent,
                        mode: req.session.mode == 'agent' ? 'agent' : 'global',
                        results: data
                    });
    
                });
    
            } else {
    
                return res.view({
                    search: req.query || false,
                    agent: req.session.agent,
                    mode: req.session.mode == 'agent' ? 'agent' : 'global',
                    results: false
                });
    
            }

        } else {

            AgencyListings.findOne({mls:matchedSite.mls}, function foundListing (err, listing){

                if(err) return res.serverError(err);
                if(!listing) return res.notFound();
    
                listing.source = listing.model;
                listing.address = listing.full_address;
                listing.link = 'http://.' + req.header('host');
    
                Agents.findOne({email:matchedSite.agent}).populate('image').exec(function foundAgent (err, agent){
                    if(err) return res.serverError(err);

                    //agent.id = agent._id;
    
                    return res.view('listings/index',{
                        agents: [agent],
                        source: listing.model,
                        listing: listing,
                        agent: agent,
                        mode: req.session.agent ? 'agent' : 'global'
                    });
                });
    
            });

        }

        

    },

    agents: function (req,res) {
        Agents.find()
            .sort('id ASC')
            .populate('image')
            .exec(function(err,agents){
            var listed = [];
            var notlisted = [];
            _.each(agents,function(item){
                console.log(item)
                if(item.listed.toString()=='true'){
                    listed.push(item);
                } else {
                    notlisted.push(item);
                }
            });
            return res.view({
                agents: _.concat(listed, notlisted),
                agent: req.session.agent,
                mode: req.session.mode == 'agent' ? 'agent' : 'global'
            });
        });
    },

    services: function (req,res) {
        return res.view({
            agent: req.session.agent,
            mode: req.session.mode == 'agent' ? 'agent' : 'global'
        });
    },

    about: function (req,res) {
        return res.view({
            agent: req.session.agent,
            mode: req.session.mode == 'agent' ? 'agent' : 'global'
        });
    },

    contact: function (req,res) {
        return res.view({
            agent: req.session.agent,
            mode: req.session.mode == 'agent' ? 'agent' : 'global'
        });
    },

    sitemap: function(req,res) {

        function generate_xml_sitemap() {

            var urls = [
                '',
                'search',
                'about',
                'agents',
                'services',
                'contact'
            ];

            var root_path = 'http://canerogroup.com/';

            var priority = 0.5;
            var freq = 'daily';
            var xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
            for (var i in urls) {
                xml += '<url>';
                xml += '<loc>'+ root_path + urls[i] + '</loc>';
                xml += '<changefreq>'+ freq +'</changefreq>';
                xml += '<priority>'+ priority +'</priority>';
                xml += '</url>';
                i++;
            }
            xml += '</urlset>';
            return xml;
        }

        var sitemap = generate_xml_sitemap();
        res.header('Content-Type', 'text/xml');
        return res.send(sitemap);

    },

    robots: function(req,res){
        var robots = 'User-Agent: *';
        res.header('Content-Type', 'text/plain');
        return res.send(robots);
    }

};