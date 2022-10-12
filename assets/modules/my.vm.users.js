head.ready(function(){

    my.vm.navigation.utils.modules.register({
        title: "User Management",
        icon: "icon-users",
        route: "/#/users"
    });

    my.vm.app.get('#/users',function() {

        var self = this;

        my.vm.app.setActive(self.path);

        self.load('/template/find/users/users-index')
            .then(function(){
                var context = this;
                context.wait();
                my.vm.users.utils.load(function(){
                    //context.next();
                });
            }).swap();

    });

    my.vm.users = (function(){
        var
            self = this,
            data = {
                count: ko.observable(0),
                collection: ko.observableArray([])
            },
            utils = {
                view: {
                    mode: ko.observable('cards')
                },
                departments: [
                    {label:'MTX',value:'MTX'},
                    {label:'Planning',value:'Planning'},
                    {label:'Sales',value:'Sales'}
                ],
                levels: [
                    {label:'Dev',value:'Dev'},
                    {label:'Boss',value:'Boss'},
                    {label:'User',value:'User'}
                ],
                roles: [
                    {label:'Admin',value:'Admin'},
                    {label:'User',value:'User'}
                ],
                make: function(user){
                    var self = this;
                    if(!user){
                        var user = {
                            id: null,
                            dmm_id: null,
                            department: null,
                            level: null,
                            role: null,
                            first_name: null,
                            last_name: null,
                            email: null,
                            phone: null,
                            password: null,
                            confirmation: null,
                            image: null,
                            online: null,
                            createdAt: moment().format(),
                            updatedAt: moment().format()
                        }
                    }
                    var mustEqual = function(val, other) {
                        if(!val && !other) return false;
                        return val === other;
                    };

                    self.data = {
                        id: ko.observable(),
                        dmm_id: ko.observable(),
                        department: ko.observable(),
                        level: ko.observable(),
                        role: ko.observable().extend({required:true}),
                        name: ko.observable(),
                        first_name: ko.observable().extend({required:true}),
                        last_name: ko.observable().extend({required:true}),
                        email: ko.observable().extend({required:true,email:true}),
                        phone: ko.observable().extend({pattern: {
                            message: 'Invalid phone number.',
                            params: /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/
                        }}),
                        password: ko.observable(),
                        confirmation: ko.observable(),
                        image: ko.observable(),
                        online: ko.observable(),
                        createdAt: ko.observable(),
                        updatedAt: ko.observable()
                    };

                    self.resetPass = ko.observable(false);

                    self.checkPass = function(){
                        if(!self.data.id()||self.resetPass()){
                            return true;
                        } else {
                            return false;
                        }
                    };

                    self.data.email.extend({required:true});
                    self.data.password.extend({required:{params:true,onlyIf:self.checkPass}});
                    self.data.confirmation.extend({required:{params:true,onlyIf:self.checkPass}});

                    self.data.password.extend({
                        validation: { validator: mustEqual, message: 'Passwords do not match!', params: self.data.confirmation, onlyIf:self.resetPass }
                    });
                    self.data.confirmation.extend({
                        validation: { validator: mustEqual, message: 'Passwords do not match?', params: self.data.password, onlyIf:self.resetPass }
                    });

                    self.init = function(user){
                        self.data.id(user.id);
                        self.data.dmm_id(user.dmm_id);
                        self.data.department(user.department);
                        self.data.level(user.level);
                        self.data.role(user.role);
                        self.data.name(user.first_name + ' ' + user.last_name);
                        self.data.first_name(user.first_name);
                        self.data.last_name(user.last_name);
                        self.data.email(user.email);
                        self.data.phone(user.phone);
                        self.data.password(user.password);
                        self.data.confirmation(user.confirmation);
                        self.data.image(user.image);
                        self.data.online(user.online);
                        self.data.createdAt(user.createdAt);
                        self.data.updatedAt(user.updatedAt);
                    };

                    self.init(user);

                    self.dirtyFlag = new ko.dirtyFlag(self.data,self.init.bind(self.data));

                    self.utils = {
                        validation: ko.validation.group(self.data),
                        revert: function(){
                            self.dirtyFlag.revert();
                        }
                    }

                },
                saved: function(data){
                    $('.modal').modal('hide');
                },
                success: function(data){
                    my.vm.users.utils.load();
                    $('#user-add-modal').modal('hide');
                    console.log('success',data);
                },
                fail: function(data){
                    console.log('fail',data);
                },
                clear: function(){
                    my.vm.users.data.count(0);
                    my.vm.users.data.collection([]);
                },
                load: function(callback){
                    var data = {}
                    my.vm.utils.loader.start();
                    data._csrf =  my.vm._csrf;
                    my.vm.socket().post('/users', data , function(res){
                        my.vm.users.utils.clear();
                        my.vm.users.data.count(res.count);
                        _.each(res.results, function(item) {
                            my.vm.users.data.collection.push(new my.vm.users.utils.make(item));
                        });
                        my.vm.utils.loader.done();
                        if(callback) callback();
                    });
                },
                update: function(user){
                    console.log(user);
                    //my.vm.users.current(user);
                    $("#user-update-modal").modal('show');
                },
                destroy: function(user){
                    console.log(user);
                    //my.vm.users.current(user);
                    $("#user-destroy-modal").modal('show');
                },
                destroyed: function(user){
                    my.vm.users.utils.load();
                    $('.modal').modal('hide');
                }
            };

        return {
            data: data,
            utils: utils
        }

    })(my.vm.users);

    ko.bindingHandlers.user = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {

            console.log('hellouser');

            var options = valueAccessor();
            var defaultOptions = {
            };

            ko.renderTemplate(
                "user-tpl",
                options,
                {
                    afterRender: function(renderedElement) {
                        //options.utils.validation.showAllMessages()
                    }
                },
                element,
                "replaceNode"
            );

        }
    }

    my.vm.users.new = new my.vm.users.utils.make();

});