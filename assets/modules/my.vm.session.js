head.ready(function(){

    /*my.vm.app.addCheck('session_exists',function(app,callback){

        // If signing in, proceed
        var isLogin = (app.path.match(/\/login/)) ? true : false;
        if (isLogin) {
            if(my.vm.session.data.current()){
                return app.redirect('#/');
            }
            return callback(null,true);

        }

        my.vm.session.utils.refresh(function(session){
            if(session){
                my.vm.navigation.utils.render();
                return callback(null,true);
            } else {
                return app.redirect('#/login');
            }
        });

    });*/

    my.vm.app.get('#/login',function() {

        var self = this;

        my.vm.utils.loader.start();

        self.load('/template/find/components/form-login-modal')
            .then(function(content){
                my.vm.utils.loader.done();
                if(!document.getElementById('login-modal')) {
                    $('body').append(content);
                    ko.applyBindingsToDescendants(my.vm, document.getElementById('login-modal'));
                }
                $('#login-modal').modal('show');
            });

        my.vm.app.setActive('User Login','login');

    });

    my.vm.login = (function(){
        var
            self = this,
            data = {},
            item = function(options){

                var self = this;
                var defaultOptions = {
                    email: null,
                    password: null
                }

                var session = $.extend(true, {}, defaultOptions, options);

                self.data = {
                    email: ko.observable().extend({required:true,email:true}),
                    key: ko.observable().extend({required:true})
                }

                self.init = function(session){
                    self.data.email(session.email);
                    self.data.key(session.key);
                }

                self.utils = {
                    validation: ko.validation.group(self.data)
                }

                self.init(session);

            },
            utils = {
                fail: function(data){
                    console.log('LoginFailCallBack',data)
                }
            };

        return {
            item: item,
            data: data,
            utils: utils
        }

    })(my.vm.login);

    my.vm.login.new = new my.vm.login.item();

    my.vm.session = (function(){
        var
            self = this,
            data = {
                navigation: ko.observable(),
                current: ko.observable()
            },
            utils = {
                create: function(data){
                    my.vm.sites.data.current(new my.vm.sites.utils.make(data.site));
                    my.vm.session.data.current(new my.vm.users.utils.make(data.user));
                    $('#login-modal').modal('hide');
                    //my.vm.app.setLocation('#/');
                    window.location = '/';
                },
                refresh: function(callback){
                    my.vm.socket().post('/session/get', { _csrf: my.vm._csrf }, function (data) {
                        if(!data.user) return callback(false);
                        my.vm.sites.data.current(new my.vm.sites.utils.make(data.site));
                        my.vm.session.data.current(new my.vm.users.utils.make(data.user));
                        return callback(true);

                    });
                }
            };

        return {
            data: data,
            utils: utils
        }

    })(my.vm.session);

    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("active").toggleClass("inactive");
        $("#sidebar-wrapper").toggleClass("active").toggleClass("inactive");
    });

    $('.login-button a,.manage-site').click(function(e){
        e.preventDefault();
        e.stopPropagation();
        var login = my.vm.app.run('#/');
        if(!login){
            my.vm.app.setLocation('#/');
        }
    });

});