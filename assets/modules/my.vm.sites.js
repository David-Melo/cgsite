/**
 * Created by dmelo on 2/18/14.
 */
head.ready(function(){

    my.vm.sites = (function(){
        var
            self = this,
            data = {
                current: ko.observable(),
                collection: ko.observable()
            },
            utils = {
                view: {
                    mode: ko.observable('cards')
                },
                modals: {
                    discard: function(cb){
                        $('#content-discard-modal').modal('show');
                        if(cb) cb();
                    }
                },
                options: {
                },
                make: function(options){

                    var self = this;
                    var defaultOptions = {
                        id: null,
                        name: null,
                        url: null,
                        email: null,
                        phone: null,
                        address1: null,
                        address2: null,
                        city: null,
                        state: null,
                        zip: null,
                        logo: null,
                        layout: null,
                        theme: null,
                        homepage: null,
                        description: null,
                        createdAt: moment().format(),
                        updatedAt: moment().format()
                    }

                    var site = $.extend(true, {}, defaultOptions, options);

                    self.data = {
                        id: ko.observable(),
                        name: ko.observable().extend({required:true}),
                        url: ko.observable().extend({required:true}),
                        email: ko.observable().extend({required:true},{email:true}),
                        phone: ko.observable(),
                        address1: ko.observable(),
                        address2: ko.observable(),
                        city: ko.observable(),
                        state: ko.observable(),
                        zip: ko.observable(),
                        logo: ko.observable(),
                        layout: ko.observable(),
                        theme: ko.observable(),
                        homepage: ko.observable(),
                        description: ko.observable(),
                        createdAt: ko.observable(),
                        updatedAt: ko.observable()
                    };

                    self.init = function(site){
                        self.data.id(site.id);
                        self.data.name(site.name);
                        self.data.url(site.url);
                        self.data.email(site.email);
                        self.data.phone(site.phone);
                        self.data.address1(site.address1);
                        self.data.address2(site.address2);
                        self.data.city(site.city);
                        self.data.state(site.state);
                        self.data.zip(site.zip);
                        self.data.logo(site.logo);
                        self.data.layout(site.layout);
                        self.data.theme(site.theme);
                        self.data.homepage(site.homepage);
                        self.data.description(site.description);
                        self.data.createdAt(site.createdAt);
                        self.data.updatedAt(site.updatedAt);
                    };

                    self.utils = {
                        validation: ko.validation.group(self.data),
                        revert: function(){
                            self.dirtyFlag.revert();
                            self.dirtyFlag.reset();
                        }
                    }

                    self.init(site);

                    self.dirtyFlag = new ko.dirtyFlag(self.data,self.init.bind(self.data));

                },
                success: function(data){
                    my.vm.sites.utils.load();
                    console.log('success',data);
                },
                fail: function(data){
                    console.log('fail',data);
                },
                clear: function(){
                    my.vm.sites.data.count(0);
                    my.vm.sites.data.collection([]);
                },
                load: function(callback){

                },
                update: function(sites){
                    console.log(sites);
                },
                destroy: function(sites){
                    console.log(sites);
                },
                save: function(){

                }
            };

        return {
            data: data,
            utils: utils
        }

    })(my.vm.sites);

});