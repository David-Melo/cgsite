head.ready(function(){

    my.vm.navigation = (function(){
        var
            data = {
                elem: ko.observable(),
                modules: ko.observableArray([])
            },
            utils = {
                toggle: function(){
                    var wrapper = $("#wrapper");
                    var sidebar = $('#sidebar-wrapper');
                    wrapper.toggleClass("active").toggleClass("inactive");
                    sidebar.toggleClass("active").toggleClass("inactive");
                },
                render: function(){

                    // Only Render If Session Exists
                    if(my.vm.session.data.current()){

                        var wrapper = $("#wrapper");

                        // If Nav Doesn't Exists
                        if(!document.getElementById('sidebar-wrapper')){

                            $("<div/>",{id:"sidebar-wrapper",class:"inactive offline"}).prependTo(wrapper);
                            $('#menu-toggle').show();

                            var sidebar = $('#sidebar-wrapper');

                            $("<div/>",{'data-bind':'nav: { modules: navigation.data.modules }'}).appendTo(sidebar);

                            ko.applyBindings(my.vm,document.getElementById('sidebar-wrapper'))

                            my.vm.navigation.utils.toggle();

                        }

                    }

                },
                append: function(config){
                    my.vm.navigation.utils.modules.register(config);
                    $('.side-nav').metisMenu();
                },
                modules: {
                    make: function(options){

                        var self = this;
                        var defaultOptions = {
                            title: "Navigation Title",
                            route: null,
                            icon: null,
                            routes: []
                        }

                        var module = $.extend(true, {}, defaultOptions, options);

                        self.data = {
                            title: ko.observable(),
                            icon: ko.observable(),
                            route: ko.observable(),
                            routes: ko.observableArray()
                        };

                        self.init = function(module){
                            self.data.title(module.title);
                            self.data.icon(module.icon);
                            self.data.route(module.route);
                            self.data.routes(module.routes);
                        };

                        self.utils = {
                            validation: ko.validation.group(self.data)
                        }

                        self.init(module);

                        self.dirtyFlag = new ko.dirtyFlag(self.data,self.init.bind(self.data));
                    },
                    register: function(module){
                        my.vm.navigation.data.modules.push(new my.vm.navigation.utils.modules.make(module))
                    }
                }
            }

        return {
            data: data,
            utils: utils
        }

    })(my.vm.navigation);

    ko.bindingHandlers.nav = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {

            var options = valueAccessor();
            var defaultOptions = {
            }

            my.vm.navigation.data.elem($(element));

            ko.renderTemplate(
                "navigation-tpl",
                viewModel,
                {
                    afterRender: function(renderedElement) {
                        $(renderedElement).metisMenu({
                            doubleTapToGo: true
                        });
                        my.vm.session.data.navigation($(renderedElement));
                    }
                },
                element,
                "replaceNode"
            );

        }
    };

})