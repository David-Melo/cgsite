var algoliasearch = require('algoliasearch');
var algoliasearchHelper = require('algoliasearch-helper');
var client = algoliasearch(process.env.algoliaApp, process.env.algoliaKey);
var index = client.initIndex("listings");
module.exports = {

    find: function(options,callback){

        var helper = algoliasearchHelper(client, 'listings', {});

        var state = algoliasearchHelper.url.getStateFromQueryString(options.query);

        helper.setState(state);

        if(options.params){
            if(options.params.q){
                helper.setQuery(options.params.q);
            }
        }

        helper.on('result', function(data){
            return callback(null,data)
        });

        helper.on('error', function(err){
            return callback(err);
        });

        helper.search();

    }

};