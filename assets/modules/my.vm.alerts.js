head.ready(function(){

    my.vm.alerts = (function(){
        var
            data = {
                collection: ko.observableArray([])
            },
            item = function(options){

                var self = this;
                var defaultOptions = {
                    id: null,
                    mode: 'info',
                    title: null,
                    message: 'Notification',
                    sticky: false,
                    link: {
                        title: null,
                        url: null
                    },
                    createdAt: moment().format(),
                    updatedAt: moment().format()
                }

                var alert = $.extend(true, {}, defaultOptions, options);

                self.data = {
                    id: ko.observable(),
                    mode: ko.observable(),
                    title: ko.observable(),
                    message: ko.observable(),
                    sticky: ko.observable(),
                    link: {
                        title: ko.observable(),
                        url: ko.observable()
                    },
                    createdAt: ko.observable(),
                    updatedAt: ko.observable()
                };

                self.destroy = function(){
                    if(!self.data.sticky()){
                        my.vm.alerts.data.collection.remove(self);
                    }
                }

                self.init = function(alert){
                    self.data.id(alert.id);
                    self.data.mode(alert.mode);
                    self.data.title(alert.title);
                    self.data.message(alert.message);
                    self.data.sticky(alert.sticky);
                    self.data.link.title(alert.link.title);
                    self.data.link.url(alert.link.url);
                    self.data.createdAt(alert.createdAt);
                    self.data.updatedAt(alert.updatedAt);
                    setTimeout(function(){
                        self.destroy()
                    }, 5000);
                }

                self.init(alert);
            },
            utils = {
                create: function(alert){
                    var exists = ko.utils.arrayFirst(my.vm.alerts.data.collection(), function(item) {
                        return item.data.id = alert.id;
                    });
                    if(!exists){
                        my.vm.alerts.data.collection.push(new my.vm.alerts.item(alert));
                    }
                },
                remove: function(alert){
                    var alert = ko.utils.arrayFirst(my.vm.alerts.data.collection(), function(item) {
                        return item.data.id == alert.id;
                    });
                    if(alert){
                        alert.data.sticky(false);
                        alert.destroy();
                    }
                }
            }

        return {
            data: data,
            item: item,
            utils: utils
        }

    })(my.vm.alerts);

    my.vm.alerts.data.filtered = ko.computed(function(){

        var alerts = {
            all: [],
            sticky: []
        }

        _.each(my.vm.alerts.data.collection(),function(alert){

            switch(alert.data.sticky()){

                case true:
                    alerts.sticky.push(alert);
                    break;

                case false:
                    alerts.all.push(alert);
                    break;

            }
        })

        return alerts;

    });

});



