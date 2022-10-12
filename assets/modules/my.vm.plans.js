head.ready(function(){

    my.vm.app.get('#/plan/:id',function() {

        var self = this;
        var planId = this.params['id'];
        var query = {
            id: planId
        };

        my.vm.app.setActive(self.path);

        self.load('/template/find/planning/item')
            .then(function(content){
                my.vm.planning.utils.load.plan(query,function(){
                    self.swap(content,function(){

                    });
                })
            });

    });

    my.vm.app.get('#/plans/assignments',function() {

        var self = this;

        my.vm.app.setActive(self.path);

        // Get Unassigned Plans
        // Get Users
        // Get Plans By Users

        my.vm.users.utils.load();

        self.load('/template/find/planning/assignments')
            .then(function(content){
                my.vm.plans.utils.load({status:'new'},function(){
                    self.swap(content,function(){

                    });
                })
            });

    });

    my.vm.app.get('#/plans/view/:filter/:criteria',function() {

        var self = this;
        var filter = this.params['filter'];
        var criteria = this.params['criteria'];
        var query= {};
        query[filter] = criteria;

        my.vm.app.setActive(self.path);

        my.vm.users.utils.load();

        self.load('/template/find/planning/list')
            .then(function(content){
                my.vm.plans.utils.load(query,function(){
                    self.swap(content,function(){

                    });
                })
            });

    });

    my.vm.plans = (function(){
        var
            self = this,
            data = {
                count: ko.observable(0),
                collection: ko.observableArray([])
            },
            utils = {
                drop: {
                    assign: function(){
                        console.log('assigned');
                    },
                    moved: function(a,b,c){
                        console.log('moved',a,b,c)
                    },
                    draggable: {
                        distance: 5,
                        cursor: "move",
                        zIndex: 99999,
                        helper: 'clone'
                    },
                    sortable: {
                        placeholder: "content-item-wrapper-placeholder",
                        helper: 'clone'
                    }
                },
                collection: function(options){

                    var self = this;
                    var defaultOptions = {
                        user: null,
                        plans: []
                    }

                    var collection = $.extend(true, {}, defaultOptions, options);

                    self.data = {
                        user: ko.observable(),
                        plans: ko.observableArray()
                    }

                    self.init = function(collection){
                        self.data.user(collection.user);
                        self.data.plans(collection.plans);
                    }

                    self.sync = ko.computed(function(){

                        _.each(self.data.plans(), function(item,index) {
                            item.assigned(self.data.user());
                        });

                    });

                    self.utils = {
                        revert: function(){
                            self.dirtyFlag.revert();
                            self.dirtyFlag.reset();
                        }
                    }

                    self.init(collection);

                    self.dirtyFlag = new ko.dirtyFlag(self.data,self.init.bind(self.data));

                },
                item: function(options) {

                    var self = this;
                    var defaultOptions = {
                        id: null,
                        status: null,
                        client_id: null,
                        client_name: null,
                        salesrep_id:  null,
                        planner_id:  null,
                        salesrep: null,
                        planner: null,
                        rfp_name: null,
                        renewal: null,
                        budget: null,
                        media_type: null,
                        integrated: null,
                        assigned: null,
                        industry: null,
                        plan_url: null,
                        contact_type: null,
                        agency: null,
                        first_name: null,
                        last_name: null,
                        request_date: null,
                        completion_date: null,
                        due_date: null,
                        createdAt: moment().format(),
                        updatedAt: moment().format()
                    }

                    var plan = $.extend(true, {}, defaultOptions, options);

                    self.id = ko.observable();
                    self.client_id = ko.observable();
                    self.status = ko.observable();
                    self.client_name = ko.observable();
                    self.salesrep_id = ko.observable();
                    self.planner_id = ko.observable();
                    self.salesrep = ko.observable();
                    self.planner = ko.observable();
                    self.rfp_name = ko.observable();
                    self.renewal = ko.observable();
                    self.budget = ko.observable();
                    self.media_type = ko.observable();
                    self.integrated = ko.observable();
                    self.assigned = ko.observable();
                    self.industry = ko.observable();
                    self.plan_url = ko.observable();
                    self.contact_type = ko.observable();
                    self.agency = ko.observable();
                    self.first_name = ko.observable();
                    self.last_name = ko.observable();
                    self.request_date = ko.observable();
                    self.completion_date = ko.observable();
                    self.due_date = ko.observable();
                    self.createdAt = ko.observable();
                    self.updatedAt = ko.observable();

                    self.init = function(plan){
                        self.id(plan.id);
                        self.status(plan.status);
                        self.client_id(plan.client_id);
                        self.client_name(plan.client_name);
                        self.salesrep_id(plan.salesrep_id);
                        self.planner_id(plan.planner_id);
                        self.salesrep(plan.SR_name);
                        self.planner(plan.AP_name);
                        self.rfp_name(plan.rfp_name);
                        self.renewal(plan.renewal);
                        self.media_type(plan.media_type);
                        self.budget(plan.budget);
                        self.integrated(plan.integrated);
                        self.assigned(plan.assigned);
                        self.industry(plan.industry);
                        self.plan_url(plan.plan_url);
                        self.contact_type(plan.contact_type);
                        self.agency(plan.agency);
                        self.first_name(plan.first_name);
                        self.last_name(plan.last_name);
                        self.request_date(plan.request_date);
                        self.completion_date(plan.completion_date);
                        self.due_date(plan.due_date);
                        self.createdAt(plan.createdAt);
                        self.updatedAt(plan.updatedAt);
                    }

                    self.serialize = function(){
                        var obj = ko.toJS(self);
                        var keys = _.keys(defaultOptions);
                        return _.pick(obj,keys);
                    };

                    self.utils = {
                        validation: ko.validation.group(self),
                        revert: function(){
                            self.dirtyFlag.revert();
                            self.dirtyFlag.reset();
                        }
                    };

                    self.init(plan);

                    self.dirtyFlag = new ko.dirtyFlag(self,self.init.bind(self));

                },
                load: function(filter,callback){

                    console.log(filter);

                    if(!filter) {
                        var filter = { status: 'new' };
                    }

                    console.log(filter);

                    my.vm.utils.loader.start()

                    var data = {
                        _csrf: my.vm._csrf,
                        page: my.vm.plans.utils.pagination.curPage(),
                        limit: my.vm.plans.utils.pagination.perPage(),
                        filter: filter,
                        sort:{
                            by: my.vm.plans.data.grid.sortBy(),
                            order: my.vm.plans.data.grid.sortOrder()
                        }
                    };

                    my.vm.socket().post('/viewplans', data , function(res){

                        if(res.err) console.log(err);

                        var results = [];

                        _.each(res.results,function(item){
                            console.log(item);
                            results.push(new my.vm.plans.utils.item(item))
                        });

                        my.vm.plans.data.count(res.count);
                        my.vm.plans.data.collection(results);

                        my.vm.utils.loader.done()

                        if(callback) return callback();

                    });
                },
                doload: function(filter,callback){

                    console.log(filter);

                    if(!filter) {
                        var filter = { status: 'new' };
                    }

                    console.log(filter);

                    my.vm.utils.loader.start()

                    var data = {
                        _csrf: my.vm._csrf,
                        page: my.vm.plans.utils.pagination.curPage(),
                        limit: my.vm.plans.utils.pagination.perPage(),
                        filter: filter,
                        sort:{
                            by: my.vm.plans.data.grid.sortBy(),
                            order: my.vm.plans.data.grid.sortOrder()
                        }
                    };

                    my.vm.socket().post('/viewplans', data , function(res){

                        if(res.err) console.log(err);

                        var results = {
                            count: 0,
                            data: []
                        };

                        _.each(res.results,function(item){
                            results.data.push(new my.vm.plans.utils.item(item))
                        });

                        results.count = res.count;

                        my.vm.utils.loader.done()

                        if(callback) return callback(results);

                    });
                }
            };

        return {
            data: data,
            utils: utils
        }

    })(my.vm.plans);

    my.vm.plans.utils.pagination = new my.vm.paginator(my.vm.plans);

    my.vm.plans.data.grid = {
        clicked: function(e,data){
            //console.log('clciked');
        },
        selected: function(e, data){
            //var selection = $("#data").wijgrid("selection").selectedCells();
            //console.log(selection);
            //console.log(my.vm.plans.data.collection()[selection.item(0).rowIndex()].client_name());
        },
        sorted: function(e, data){
            console.log('sorted');
            my.vm.plans.utils.pagination.curPage(1);
            my.vm.plans.data.grid.sortBy(data.column.dataKey);
            my.vm.plans.data.grid.sortOrder(data.sortDirection);
            my.vm.plans.utils.load()
        },
        sortBy: ko.observable('id'),
        sortOrder: ko.observable('ASC'),
        filter: {
            criteria: ko.observable('')
        }
    }

    my.vm.plans.data.wijmo = {
        data: my.vm.plans.data.collection,
        columnsAutogenerationMode: 'none',
        highlightCurrentCell: false,
        selectionMode: 'singleRow',
        selectionChanged: my.vm.plans.data.grid.selected,
        showSelectionOnRender: false,
        allowSorting: true,
        pageSize: my.vm.plans.utils.pagination.perPage,
        pageIndex: my.vm.plans.utils.pagination.curPage,
        pageIndexChanged: my.vm.plans.data.grid.paged,
        sorted: my.vm.plans.data.grid.sorted,
        totalRows: my.vm.plans.data.count,
        columns: [
            { headerText: 'Status', dataKey: 'status',
                cellFormatter: function (args) {
                    var rt = $.wijmo.wijgrid.rowType;
                    if (args.row.type & rt.data && args.row.type !== rt.header) {

                        switch(args.formattedValue){
                            case 'Planning':
                                var css = 'label-danger';
                                break;
                            case 'New':
                                var css = 'label-default';
                                break;
                            default:
                                var css = 'label-default';
                                break;
                        }
                        args.$container
                            .empty()
                            .append($("<h4 class='grid-label remove-bottom'><span class='label " + css + " '>" + args.formattedValue + "</span></h4>"));

                        return true;
                    }

                }
            },
            { headerText: 'Planner', dataKey: 'planner' },
            { headerText: 'ID', dataKey: 'id' },
            { headerText: 'Client Name', dataKey: 'client_name' },
            { headerText: 'Campaign', dataKey: 'rfp_name' },
            { headerText: 'Sales Rep', dataKey: 'salesrep' },
            { headerText: 'Budget', dataKey: 'budget', dataType: 'currency' },
            { headerText: 'Media Requested', dataKey: 'media_type' },
            { headerText: 'Requested Date', dataKey: 'request_date', dataType: 'datetime' },
            { headerText: 'Due Date', dataKey: 'due_date', dataType: 'datetime' }
        ]
    };

    my.vm.plans.utils.pager = ko.computed(function(){
        var numResults = my.vm.plans.data.count();
        var currPage = my.vm.plans.utils.pagination.curPage();
        var perPage = my.vm.plans.utils.pagination.perPage();
        var numPages = Math.ceil(numResults/perPage) || 0;
        var offset = perPage*(currPage-1);

        var rangeStart = ((currPage-4)>0)? currPage-4 : 1;
        var rangeEnd = (rangeStart>4) ? (((currPage + 4)>numPages)? numPages : currPage + 4) : ((numPages<10) ? numPages : 10);

        var pages = my.vm.plans.utils.pagination.getArray(rangeStart,rangeEnd);

        my.vm.plans.utils.pagination.pages(pages);
        my.vm.plans.utils.pagination.numPages(numPages);
        my.vm.plans.utils.pagination.offset(offset);
    });

    my.vm.plans.utils.pagination.perPage.subscribe(function(){
        my.vm.plans.utils.pagination.curPage(1);
        my.vm.plans.utils.load();
    });

    my.vm.users.data.planners = ko.computed(function(){
        var planners = [];
        _.each(my.vm.users.data.collection(),function(item){
            if( item.data.department()=='Planning' && item.data.level()=='User' ){
                planners.push(item);
            }
        });
        return planners;
    });

    my.vm.plans.utils.sync = ko.computed(function(){
        var dirty = [];
        _.each(my.vm.plans.data.collection(),function(item){
            if(item.dirtyFlag.isDirty()){
                dirty.push(item);
            }
        });
        return dirty;
    });

    ko.bindingHandlers.myAssignments = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            console.log('assignemtnsbound');

            var options = valueAccessor();

            console.log(options);

            var myplans = [];


            my.vm.plans.utils.doload({assigned:options.data.id()},function(results){

                _.each(results.data,function(item){
                    myplans.push(item);
                });

                var plans = new my.vm.plans.utils.collection({
                    user: options.data.id(),
                    plans: myplans
                });

                ko.renderTemplate(
                    "my-assignments-tpl",
                    plans,
                    {
                        afterRender: function(renderedElement) {

                        }
                    },
                    element,
                    "replaceNode"
                );
            });



        }
    };

});