head.ready(function(){

    var demogrid = function(){

        return {
            data: [
                {id:1,name:'One'},
                {id:2,name:'Two'}
            ],
            columnsAutogenerationMode: 'none',
            scrollMode: 'vertical',
            highlightCurrentCell: false,
            selectionMode: 'none',
            allowPaging: true,
            allowSorting: true,
            pageSize: 10,
            pageIndex: 0,
            //pageIndexChanged: clients.grid.paged,
            //sorted: clients.grid.sorted,
            totalRows: 1,
            columns: [
                {
                    headerText: 'ID',
                    dataKey: 'id'
                },
                {
                    headerText: 'Name',
                    dataKey: 'name'
                }
            ]
        }

    }

    my.vm.demogrid = new demogrid();

    var makeGrid = function(options){

        var self = this;
        var defaultOptions = {
            pageSize: 10,
            pageIndex: 0,
            totalRows: 0,
            columnsAutogenerationMode: 'none',
            scrollMode: 'vertical',
            highlightCurrentCell: false,
            selectionMode: 'none',
            allowPaging: true,
            allowSorting: true
        }

        var grid = $.extend(true, {}, defaultOptions, options);

        self.data = {
            data: ko.observable(),
            pageSize: ko.observable(),
            pageIndex: ko.observable(),
            sortBy: ko.observable(),
            sortOrder: ko.observable(),
            dataRows: ko.observableArray([]),
            totalRows: ko.observable(),
            filter: {
                criteria: ko.observable('')
            }
        };

        self.init = function(site){
            self.data.id(site.id);

        };

        self.utils = {

        }

        self.config = function(){

            return {
                data: [
                    {id:1,name:'One'},
                    {id:2,name:'Two'}
                ],
                columnsAutogenerationMode: 'none',
                scrollMode: 'vertical',
                highlightCurrentCell: false,
                selectionMode: 'none',
                allowPaging: true,
                allowSorting: true,
                pageSize: 10,
                pageIndex: 0,
                //pageIndexChanged: clients.grid.paged,
                //sorted: clients.grid.sorted,
                totalRows: 1,
                columns: [
                    {
                        headerText: 'ID',
                        dataKey: 'id'
                    },
                    {
                        headerText: 'Name',
                        dataKey: 'name'
                    }
                ]
            }

        }

        self.init(site);

    }

    var column = {
        headerText: 'Header',
        dataKey: 'Client',
        sortDirection: 'ascending'
    }

    /*var init = {
        pageSize: ko.observable(20),
        pageIndex: ko.observable(0),
        sortBy: ko.observable(),
        sortOrder: ko.observable(),
        dataRows: ko.observableArray([]),
        totalRows: ko.observable(0),
        filter: {
            criteria: ko.observable('')
        },
        sorted: function (e, data) {
            my.vm.clients.grid.pageIndex(0);
            my.vm.clients.grid.sortBy(data.column.dataKey);
            my.vm.clients.grid.sortOrder(data.sortDirection);
            my.vm.clients.grid.load();
        },
        paged: function (e, data) {
            my.vm.clients.grid.pageIndex(data.newPageIndex);
        },
        clear: function () {
            my.vm.clients.grid.totalRows(0);
            my.vm.clients.grid.dataRows([]);
        }
    }

    var grid = {
        data: clients.grid.dataRows,
        columnsAutogenerationMode: 'none',
        scrollMode: 'vertical',
        highlightCurrentCell: false,
        selectionMode: 'none',
        allowPaging: true,
        allowSorting: true,
        pageSize: clients.grid.pageSize,
        pageIndex: clients.grid.pageIndex,
        pageIndexChanged: clients.grid.paged,
        sorted: clients.grid.sorted,
        totalRows: clients.grid.totalRows,
        columns: []
    }*/

    // table(data-bind="dataGrid: { data: }")

})