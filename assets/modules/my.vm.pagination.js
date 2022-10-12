head.ready(function(){

    my.vm.paginator = function(model){
        var
            proto = model,
            self = {
                perPage: ko.observable('10'),
                curPage: ko.observable(1),
                numPages: ko.observable(0),
                offset: ko.observable(0),
                pages: ko.observableArray([]),
                stats: ko.observable(),
                results: ko.observable(),
                getArray: function(a,b){
                    var arr = [];
                    for (var i = a; i <= b; i++) {
                        arr.push(i);
                    }
                    return arr
                },
                firstPage: function(){
                    model.utils.pagination.curPage(1);
                    model.utils.load();
                },
                toPage: function(page){
                    console.log('ToPage',page)
                    model.utils.pagination.curPage(page);
                    model.utils.load();
                },
                prevPage: function(){
                    var fromPage = model.utils.pagination.curPage();
                    var toPage = fromPage-1;
                    if(toPage>0){
                        model.utils.pagination.curPage(toPage);
                        model.utils.load();
                    }
                },
                nextPage: function(){
                    var fromPage = model.utils.pagination.curPage();
                    var totPages = model.utils.pagination.numPages();
                    var toPage = fromPage+1;
                    if(toPage<totPages){
                        model.utils.pagination.curPage(toPage);
                        model.utils.load();
                    }
                },
                lastPage: function(){
                    var lastPage = model.utils.pagination.numPages();
                    model.utils.pagination.curPage(lastPage);
                    model.utils.load();
                },
                refresh: function(){
                    model.utils.load();
                }
            };

        self.stats= {
            results: ko.computed(function(){
                return 'Showing Results <b>' + (parseInt(self.offset()) + 1) + '</b> - <b>' + ( ( (parseInt(self.offset())+self.perPage()) < proto.data.count() ) ? (parseInt(self.offset()) + +self.perPage()) : model.data.count()) + '</b> of <b> ' + Globalize.format(model.data.count(),'n0') + '</b>';
            }),
            pages: ko.computed(function(){
                return 'Page <b>' + self.curPage() + '</b> of <b>' + self.numPages();
            })
        };

        return self;

    };

});


ko.bindingHandlers.pagiNator = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        var options = valueAccessor();

        var unwrapped = ko.utils.unwrapObservable(options);

        ko.renderTemplate(
            "paginator-tpl",
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