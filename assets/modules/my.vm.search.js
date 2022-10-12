head.ready(function(){

    var SearchIndex = 'listings';

    my.vm.search = (function(){
        var
            self = this,
            data = {
                count: ko.observable(0),
                results: ko.observable(null),
                collection: ko.observableArray([]),
                sortBy: ko.observable({ value: '', label: 'Sort By Relevance' }),
                refinements: ko.observableArray([]),
                agent: ko.observable()
            },
            utils = {
                query: ko.observable(''),
                facets: ko.observableArray([]),
                load: function(callback){

                    my.vm.utils.loader.start();

                    my.vm.search.app.helper.setQuery(my.vm.search.utils.query());

                    if(my.vm.search.app.helper.hasRefinements('parent')){
                        my.vm.search.app.helper.removeFacetRefinement('parent');
                    }

                    if(my.vm.search.app.helper.hasRefinements('finance')){
                        my.vm.search.app.helper.removeFacetRefinement('finance');
                    }

                    my.vm.search.app.helper.addFacetRefinement('parent',my.vm.search.utils.parentMode().value);
                    my.vm.search.app.helper.addFacetRefinement('finance',my.vm.search.utils.financialMode().value);

                    my.vm.search.app.helper.search();

                    if(callback) return callback();

                },
                item: function(){},
                facet: function(facet){
                    var self = {
                        facet: ko.observable(facet.name),
                        title: ko.observable(facet.title),
                        values: ko.observable(facet.values),
                        mode: ko.observable(facet.mode),
                        has_other_values: ko.observable(facet.has_other_values),
                        other_values: ko.observable(facet.other_values),
                        disjunctive: ko.observable(facet.disjunctive)
                    }
                    if(facet.mode=='slider'){
                        self.range = (facet.slider.value===Array)? true:false;
                        self.min = ko.observable(facet.slider.min);
                        self.max = ko.observable(facet.slider.max);
                        self.step = ko.observable(facet.slider.step);
                        self.value = ko.observableArray([facet.slider.min,facet.slider.max]);
                    }
                    return self;
                },
                sorts: [
                    { value: '', label: 'Sort By Relevance' },
                    { value: '_newest', label: 'Sort By Newest First' },
                    { value: '_oldest', label: 'Sort By Oldest First' },
                    { value: '_price_low', label: 'Sort By Lowest Price' },
                    { value: '_price_high', label: 'Sort By Highest Price' },
                ],
                openResult: function(item,b,c,s){

                    if($(b.target).parents('.btn-group').hasClass("share-options")){
                        return false;
                    }

                    my.vm.utils.loader.start();

                    var tabs = $('#search-tabs');
                    var tab = $('#search-tabs a[href="#' + item.sysid + '"]').length;

                    if(!tab){

                        var template = ':)';

                        tabs.append(
                            $('<li><a id="tab' + item.sysid + '" href="#' + item.sysid + '" data-toggle="tab" class="result-tab-link">' +
                            'Listing #' + item.sysid +
                            '<button data-bind="click: search.utils.closeResult" class="close close-btn" type="button" ' +
                            'title="Close Tab">×</button>' +
                            '</a></li>'));

                        $('#search-tabs-content').append(
                            $('<div class="tab-pane result-tab-container" id="' + item.sysid +
                            '"><div id="result' + item.sysid + '" class="result-tab-panel">' + template + '</div></div>'));

                        ko.renderTemplate(
                            "search-result-item-tpl",
                            item,
                            {
                                afterRender: function(renderedElement) {

                                }
                            },
                            $('#result' + item.sysid),
                            "replaceNode"
                        );

                        $('#search-tabs a[href="#' + item.sysid + '"]').tab('show');
                        $("body").animate({ scrollTop: 0 }, "fast");

                        ko.applyBindings(my.vm,document.getElementById('tab' + item.sysid));

                        my.vm.utils.loader.done();

                    } else {

                        console.log('theresatab');
                        $('#search-tabs a[href="#' + item.sysid + '"]').tab('show');
                        NProgress.done();

                    }

                },
                closeResult: function(d,e){
                    var item = String($(e.target.offsetParent).attr('href'));
                    var listing = (item).replace('#','');

                    $('#search-tabs a[href="#results"]').tab('show');
                    $('#tab'+listing).remove();
                    $('#result'+listing).remove();
                    $('#'+listing).remove();
                }
            };

        return {
            data: data,
            utils: utils
        }

    })(my.vm.search);

    my.vm.agents = (function(){
        var
            self = this,
            data = {
                collection: ko.observableArray([])
            },
            utils = {
                load: function(callback){
                    var data = {}
                    my.vm.utils.loader.start();
                    data._csrf =  my.vm._csrf;
                    my.vm.socket().post('/agents/index', data , function(res){
                        my.vm.agents.data.collection(res);
                        my.vm.utils.loader.done();
                        if(callback) callback();
                    });
                    if(callback) return callback();
                },
                random: function(){
                    return _.find(_.shuffle(my.vm.agents.data.collection()),function(item){
                        return 1==1;
                    })
                }
            };

        return {
            data: data,
            utils: utils
        }

    })(my.vm.agents);

    var noSearch = Object.keys(window.search).length === 0 && window.search.constructor === Object;

    var defaultParent = {facet:'parent',value:'RES',display:'Residential'};
    var defaultFinance = {facet:'finance',value:'BUY',display:'For Sale'};

    if (noSearch){

    } else {

        if (window.search.fR){

            if (window.search.fR.parent){

                if(window.search.fR.parent[0]=='COM'){
                    defaultParent = {facet:'parent',value:'COM',display:'Commercial'};
                }

            }

            if (window.search.fR.finance){

                if(window.search.fR.finance[0]=='RNT'){
                    defaultFinance = {facet:'finance',value:'RNT',display:'For Rent'};
                }

            }

        }

        if(window.search.q){
            if(window.search.q.length){
                my.vm.search.utils.query(window.search.q);
            }
        }

        $(".search-container").animate({'padding-top':20},"fast");
        $(".home-search-box").animate({'margin-bottom':20},"fast");

    }

    my.vm.search.utils.go = function(){
        if(my.vm.search.utils.query()){
            my.vm.search.utils.load();
        }
    };

    my.vm.search.utils.financialMode = ko.observable(defaultFinance);
    my.vm.search.utils.financial = {
        modes: [
            {facet:'finance',value:'BUY',display:'For Sale'},
            {facet:'finance',value:'RNT',display:'For Rent'}
        ],
        select: function(mode){
            my.vm.search.utils.financialMode(mode)
        }
    };

    my.vm.search.utils.parentMode = ko.observable(defaultParent);
    my.vm.search.utils.parent = {
        modes: [
            {facet:'parent',value:'RES',display:'Residential'},
            {facet:'parent',value:'COM',display:'Commercial'}
        ],
        select: function(mode){
            my.vm.search.utils.parentMode(mode)
        }
    };

    ko.bindingHandlers.resultsItem = {
        update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            var options = valueAccessor();

            var unwrapped = ko.utils.unwrapObservable(options);

            ko.renderTemplate(
                "search-result-item-tpl",
                options,
                {
                    afterRender: function(renderedElement) {

                    }
                },
                element,
                "replaceNode"
            );

        }
    };

    my.vm.search.app = instantsearch({
        appId: 'I0WOUHYKF3',
        apiKey: 'f66c5934d0cbc0714e058d21467feb2d',
        indexName: SearchIndex,
        urlSync: true,
        searchFunction: function(helper){

            if (helper.state.query === '') {
                return;
            }

            helper.search();

        },
        searchParameters: {
            disjunctiveFacets: ['zip'],
            facets: ['parent','finance'],
            hitsPerPage: 10
        }
    });

    my.vm.search.app.addWidget(
        instantsearch.widgets.pagination({
            container: '#pagination-container'
        })
    );

    my.vm.search.app.addWidget(
        instantsearch.widgets.menu({
            container: '#facet-proptype',
            attributeName: 'proptype',
            sortBy: ['count'],
            limit: 5,
            showMore: {
                limit: 15,
                templates: {
                    active: '<div class="list-group-item list-group-toggle-header" style="cursor: pointer">Show Less</div>',
                    inactive: '<div class="list-group-item list-group-toggle-header" style="cursor: pointer">Show More</div>'
                }
            },
            collapsible: true,
            templates: {
                header: '<h4 class="panel-title">Property Type</h4>'
            },
            cssClasses: {
                root: 'panel panel-default',
                header: 'panel-heading',
                count: 'badge pull-right',
                body: 'panel-collapse collapse in',
                list: 'list-group',
                item: 'list-group-item'
            }
        })
    );

    my.vm.search.app.addWidget(
        instantsearch.widgets.menu({
            container: '#facet-city',
            attributeName: 'city',
            sortBy: ['count'],
            limit: 5,
            showMore: {
                limit: 15,
                templates: {
                    active: '<div class="list-group-item list-group-toggle-header" style="cursor: pointer">Show Less</div>',
                    inactive: '<div class="list-group-item list-group-toggle-header" style="cursor: pointer">Show More</div>'
                }
            },
            collapsible: true,
            templates: {
                header: '<h4 class="panel-title">City</h4>'
            },
            cssClasses: {
                root: 'panel panel-default',
                header: 'panel-heading',
                count: 'badge pull-right',
                body: 'panel-collapse collapse in',
                list: 'list-group',
                item: 'list-group-item'
            }
        })
    );

    my.vm.search.app.addWidget(
        instantsearch.widgets.menu({
            container: '#facet-county',
            attributeName: 'county',
            sortBy: ['count'],
            limit: 5,
            showMore: {
                limit: 15,
                templates: {
                    active: '<div class="list-group-item list-group-toggle-header" style="cursor: pointer">Show Less</div>',
                    inactive: '<div class="list-group-item list-group-toggle-header" style="cursor: pointer">Show More</div>'
                }
            },
            collapsible: true,
            templates: {
                header: '<h4 class="panel-title">County</h4>'
            },
            cssClasses: {
                root: 'panel panel-default',
                header: 'panel-heading',
                count: 'badge pull-right',
                body: 'panel-collapse collapse in',
                list: 'list-group',
                item: 'list-group-item'
            }
        })
    );

    my.vm.search.app.addWidget(
        instantsearch.widgets.rangeSlider({
            container: '#facet-beds',
            attributeName: 'beds',
            min: 1,
            max: 6,
            collapsible: true,
            templates: {
                header: '<h4 class="panel-title">Bedrooms</h4>'
            },
            cssClasses: {
                root: 'panel panel-default',
                header: 'panel-heading',
                body: 'panel-body'
            }
        })
    );

    my.vm.search.app.addWidget(
        instantsearch.widgets.rangeSlider({
            container: '#facet-baths',
            attributeName: 'bath',
            min: 1,
            max: 6,
            collapsible: true,
            templates: {
                header: '<h4 class="panel-title">Bathrooms</h4>'
            },
            cssClasses: {
                root: 'panel panel-default',
                header: 'panel-heading',
                body: 'panel-body'
            }
        })
    );

    my.vm.search.app.addWidget(
        instantsearch.widgets.priceRanges({
            container: '#facet-price',
            attributeName: 'price',
            labels: {
                currency: '$',
                separator: 'to',
                button: 'Go'
            },
            collapsible: true,
            templates: {
                header: '<h4 class="panel-title">Price</h4>'
            },
            cssClasses: {
                root: 'panel panel-default',
                header: 'panel-heading',
                body: 'panel-collapse collapse in price-range',
                list: 'list-group',
                item: 'list-group-item'
            }
        })
    );

    my.vm.search.app.addWidget(
        instantsearch.widgets.stats({
            container: '#stats-container'
        })
    );

    my.vm.search.app.addWidget(
        instantsearch.widgets.clearAll({
            container: '#clear-all',
            templates: {
                link: 'Reset All Filters'
            },
            autoHideContainer: false
        })
    );

    my.vm.search.app.addWidget(
        instantsearch.widgets.hitsPerPageSelector({
            container: '#perpage',
            options: [
                {value: 5, label: '5 per page'},
                {value: 10, label: '10 per page'},
                {value: 20, label: '20 per page'},
                {value: 50, label: '50 per page'},
                {value: 100, label: '100 per page'}
            ]
        })
    );

    my.vm.search.app.start();

    my.vm.search.app.helper.on("result",function(content){

        $(".search-container").animate({'padding-top':20},"fast");
        $(".home-search-box").animate({'margin-bottom':20},"fast");

        $("#page-content-wrapper").show();
        $("#page-content-preload").hide();

        $('#search-tabs a[href="#results"]').tab('show');

        my.vm.search.data.results(content);
        my.vm.search.data.count(content.nbHits);
        my.vm.search.data.collection(content.hits);
        my.vm.utils.loader.done();
        window.scrollTo(0, 0);

    });

});