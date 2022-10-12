head.ready(function(){

    my.vm.navigation.utils.modules.register({
        title: "Dashboard",
        icon: "icon-gauge",
        route: "/#/"
    });

    my.vm.navigation.utils.modules.register({
        title: "My Calendar",
        icon: "icon-calendar",
        route: "/#/settings/site"
    });

    my.vm.navigation.utils.modules.register({
        title: "Group Calendar",
        icon: "icon-users",
        route: "/#/settings/site"
    });

    my.vm.navigation.utils.modules.register({
        title: "My Messages",
        icon: "icon-mail",
        route: "/#/settings/site"
    });

    my.vm.navigation.utils.modules.register({
        title: "My Tasks",
        icon: "icon-download",
        route: "/#/settings/site"
    });

    my.vm.navigation.utils.modules.register({
        title: "My Reports",
        icon: "icon-print",
        route: "/#/settings/site"
    });

    // Routes
    /*my.vm.app.get('#/',function() {

        var self = this;

        my.vm.app.setActive(self.path);

        var department = my.vm.session.data.current().data.department();
        var level = my.vm.session.data.current().data.level();

        console.log(level);

        self.load('/template/find/dashboards/' + department + '/' + level)
            .then(function(content){

                if(level=='Boss'){

                    // Get Unassigned Plans
                    my.vm.planning.utils.load.unassigned(function(){
                        my.vm.planning.utils.load.assigned(function(){
                            my.vm.planning.utils.load.planners(function(){
                                self.swap(content,function(){
                                    console.log('LOADEDBOSS');
                                });
                            });
                        });
                    });

                }
                else if (level=='User'){

                    console.log('runuser');

                    my.vm.planning.utils.load.planner(function(){
                        console.log('plannercallback')
                        self.swap(content,function(){
                            console.log('loadeduser');
                        });
                    });

                }


            });

    });*/



    my.vm.test = {};

    // View Model
    my.vm.planning = (function(){
        var self = this;
        var data = {
            test: { // @TODO Modularize barCharts
                stacked: true,
                horizontal: false,
                height: 100,
                showChartLabels:false,
                marginRight: 10,
                marginLeft: 10,
                marginTop: 5,
                marginBottom: 10,
                legend: {

                },
                axis: {
                    y: {
                        textStyle: { fill: '#000', 'font-family': 'Arial', 'font-weight' : 'normal' },
                        labels: {style: {fill: '#000', 'font-weight' : 'normal'} },
                        gridMajor: {visible:true, style:{stroke:'#DDD'}},
                        gridMinor: {visible:true, style:{stroke:'#AAA','stroke-dasharray':'. '}}
                    }
                },
                seriesList: [{
                    label: 'Tasks',
                    legendEntry: true,
                    data: {
                        x: ['Mon','Tue','Wed','Thu','Fri'],
                        y: [4,2,5,3,5]
                    }
                }],
                seriesStyles: [
                    { fill: '#01A2D7', stroke: '#01A2D7','stroke-width':'0',opacity: 0.8 },
                    { fill: '#CC3C3C', stroke: '#CC3C3C','stroke-width':'0',opacity: 0.8 },
                    { fill: '#FFE44D', stroke: '#FFE44D','stroke-width':'0',opacity: 0.8 },
                    { fill: '#9ECC3C', stroke: '#9ECC3C','stroke-width':'0',opacity: 0.8 }],
                seriesHoverStyles: [{
                    'stroke-width': 1.5, opacity: 1
                }, {
                    'stroke-width': 1.5, opacity: 1
                }, {
                    'stroke-width': 1.5, opacity: 1
                }]
            },
            assigned: ko.observableArray(),
            unassigned: ko.observableArray(),
            planners: ko.observableArray(),
            plans: ko.observableArray(),
            myplans: ko.observableArray(),
            current: ko.observableArray()
        };
        var utils = {
            load: {
                unassigned: function(callback){

                    my.vm.socket().post('/plans/unassigned', { _csrf: my.vm._csrf } , function(res){

                        if(res.err) console.log(err);

                        my.vm.planning.data.unassigned([]);

                        var results = [];

                        _.each(res,function(item){
                            results.push(new my.vm.planning.item(item))
                        });

                        my.vm.planning.data.unassigned(results);

                        if(callback) return callback();

                    });

                },
                planners: function(callback){

                    my.vm.socket().post('/users', {_csrf:my.vm._csrf,department:'Planning'} , function(res){
                        if(res.err) console.log(err);
                        my.vm.planning.data.planners([]);
                        _.each(res.results, function(item) {
                            my.vm.planning.data.planners.push(new my.vm.users.utils.make(item));
                        });
                        if(callback) return callback();
                    });

                },
                assigned: function(callback){

                    my.vm.socket().post('/plans/planners', { _csrf: my.vm._csrf } , function(res){

                        if(res.err) console.log(err);

                        my.vm.planning.data.assigned([]);

                        var results = [];

                        _.each(res,function(item){
                            results.push(new my.vm.planning.item(item))
                        });

                        my.vm.planning.data.assigned(results);

                        if(callback) return callback();

                    });

                },
                plans: function(filter,callback){

                    var data = {
                        _csrf: my.vm._csrf,
                        filter: filter
                    };

                    console.log('run')

                    my.vm.socket().post('/viewplans', data , function(res){

                        if(res.err) console.log(err);

                        my.vm.planning.data.plans([]);

                        var results = [];

                        _.each(res.results,function(item){
                            results.push(new my.vm.planning.item(item))
                        });

                        my.vm.planning.data.plans(results);


                        if(callback) return callback();

                    });

                },
                plan: function(filter,callback){

                    var data = {
                        _csrf: my.vm._csrf,
                        filter: filter
                    };

                    console.log('run')

                    my.vm.socket().post('/viewplans/one', data , function(res){

                        if(res.err) console.log(err);

                        console.log(res);

                        my.vm.planning.data.current(new my.vm.planning.item(res));

                        if(callback) return callback();

                    });

                },
                planner: function(callback){

                    var data = {
                        _csrf: my.vm._csrf,
                        id: my.vm.session.data.current().data.id()
                    };

                    console.log('run')

                    my.vm.socket().post('/plans/byplanner', data , function(res){

                        if(res.err) console.log(err);

                        my.vm.planning.data.myplans([]);

                        var results = [];

                        console.log(res);

                        _.each(res,function(item){
                            results.push(new my.vm.planning.item(item))
                        });

                        my.vm.planning.data.myplans(results);

                        if(callback) return callback();

                    });

                },
                test: function(callback){

                    var data = {
                        _csrf: my.vm._csrf,
                        page: my.vm.planning.data.grid.pageIndex()+1,
                        limit: my.vm.planning.data.grid.pageSize(),
                        filter: {status: 'new'},
                        sort:{
                            by: my.vm.planning.data.grid.sortBy(),
                            order: my.vm.planning.data.grid.sortOrder()
                        }
                    };

                    console.log('run')

                    my.vm.socket().post('/viewplans', data , function(res){

                        if(res.err) console.log(err);

                        my.vm.planning.data.plans([]);

                        var results = [];

                        _.each(res.results,function(item){
                            results.push(new my.vm.planning.item(item))
                        });

                        my.vm.planning.data.grid.totalRows(res.count);
                        my.vm.planning.data.plans(results);

                        $("#data").wijgrid("ensureControl",true)
                        if(callback) return callback();

                    });

                }
            }
        };
        var plan = function(options) {

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

            self.init = function(plan){
                self.id = plan.id =
                self.status = plan.status;
                self.client_id = plan.client_id;
                self.client_name = plan.client_name;
                self.salesrep_id = plan.salesrep_id;
                self.planner_id = plan.planner_id;
                self.salesrep = plan.SR_name;
                self.planner = plan.AP_name;
                self.rfp_name = plan.rfp_name;
                self.renewal = plan.renewal;
                self.media_type = plan.media_type;
                self.budget = plan.budget;
                self.integrated = plan.integrated;
                self.assigned = plan.assigned;
                self.industry = plan.industry;
                self.plan_url = plan.plan_url;
                self.contact_type = plan.contact_type;
                self.agency = plan.agency;
                self.first_name = plan.first_name;
                self.last_name = plan.last_name;
                self.request_date = plan.request_date;
                self.completion_date = plan.completion_date;
                self.due_date = plan.due_date;
                self.createdAt = plan.createdAt;
                self.updatedAt = plan.updatedAt;
            }

            self.utils = {
                validation: ko.validation.group(self)
            }

            self.init(plan);

        };

        var item = function(options) {

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

            self.utils = {
                validation: ko.validation.group(self)
            }

            self.init(plan);

        };

        return {
            data: data,
            utils: utils,
            item: item,
            plan: plan
        }

    })(my.vm.planning);

    // Custom Bindings
    ko.bindingHandlers.assignments = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            console.log('assignemtnsbound');

            var options = valueAccessor();

            var planner = options.id();


            var plans = [];

            _.each(my.vm.planning.data.assigned(),function(item){
                if(planner === item.planner_id()){
                    plans.push(item);
                }
            })

            console.log(plans);

            ko.renderTemplate(
                "assignments-tpl",
                plans,
                {
                    afterRender: function(renderedElement) {

                    }
                },
                element,
                "replaceNode"
            );

        }
    };

    my.vm.planning.data.grid = {
        pageSize: ko.observable(5),
        pageIndex: ko.observable(0),
        sorted: function(e, data){
            console.log('sorted');
            my.vm.planning.data.grid.pageIndex(0);
            my.vm.planning.data.grid.sortBy(data.column.dataKey);
            my.vm.planning.data.grid.sortOrder(data.sortDirection);
        },
        paged: function(e, data){
            console.log('paged',data);
            if(data){
                my.vm.planning.data.grid.pageIndex(data.newPageIndex);
            }
        },
        sortBy: ko.observable('id'),
        sortOrder: ko.observable('ASC'),
        totalRows: ko.observable(),
        filter: {
            criteria: ko.observable('')
        }
    }

    my.vm.planning.data.wijmo = {
        data: my.vm.planning.data.plans,
        columnsAutogenerationMode: 'none',
        highlightCurrentCell: false,
        selectionMode: 'singleRow',
        showSelectionOnRender: 'false',
        allowPaging: true,
        allowSorting: true,
        pageSize: my.vm.planning.data.grid.pageSize,
        pageIndex: my.vm.planning.data.grid.pageIndex,
        pageIndexChanged: my.vm.planning.data.grid.paged,
        sorted: my.vm.planning.data.grid.sorted,
        totalRows: my.vm.planning.data.grid.totalRows,
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
            { headerText: 'Planner', dataKey: 'planner',
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

    my.vm.planning.data.grid.filter.criteria.subscribe(function (newValue) {
        var filters = ['client_name','rfp_name']
        //my.vm.planning.data.grid.pageIndex(0);
        console.log('criteriachanged')
    });
    my.vm.planning.data.grid.pageSize.subscribe(function (newValue) {
        console.log('pagesizechanged')
    });
    my.vm.planning.data.grid.sortBy.subscribe(function (newValue) {
        my.vm.planning.data.grid.pageIndex(0);
        console.log('sortby')
    });
    my.vm.planning.data.grid.sortOrder.subscribe(function (newValue) {
        my.vm.planning.data.grid.pageIndex(0);
        console.log('sortorder')
    });
    my.vm.planning.data.grid.pageIndex.subscribe(function (newValue) {
        console.log('pageindex')
    });
    my.vm.planning.data.grid.totalRows.subscribe(function (newValue) {
        console.log('totalreoschanged');
        $("#data").wijgrid("ensureControl",true)
    });
    
});