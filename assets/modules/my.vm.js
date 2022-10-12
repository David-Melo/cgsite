var my = my || {};
head.ready(function(){

    my.vm = (function(){
        var
            app =  $.sammy('#page-content-wrapper',function() {

                self = this;

                self._checkFormSubmission = function() {
                    return (false);
                };

                self.swap = function(content, callback) {
                    var context = this;
                    $('.popover').popover('hide');
                    $('.tooltip').tooltip('hide');
                    context.$element().fadeOut('fast', function() {
                        context.$element().html(content);
                        ko.applyBindingsToDescendants(my.vm,context.$element()[0]);
                        context.$element().fadeIn('fast', function() {
                            $('.tooltips').tooltip();
                            if (callback) callback.apply();
                        });
                    });
                };

                // Checks have to be BOOLEAN; True, route runs, False, It doesn't
                self.checks = {};

                self.addCheck = function(id,check){
                    if(!self.checks[id]) {
                        self.checks[id] = check;
                    }
                };

                self.around(function(callback) {
                    var app = this;
                    window.last = window.current;
                    window.current = app.path;
                    var checks = [];
                    if(_.isEmpty(self.checks)){
                        $("#page-content-wrapper").html('');
                        callback();
                    } else {
                        _.each(self.checks, function (item) {
                            checks.push(item.bind(this, app));
                        });
                        async.series(checks,
                            function (err, results) {
                                if(err) console.log(err);
                                var pass = _.every(results,function(result){
                                    return result;
                                });
                                // If all Checks Pass
                                if(pass){
                                    $("#page-content-wrapper").html('');
                                    callback();
                                } else {
                                    window.next = window.current;
                                }
                            });
                    }
                });

                self.after(function(){});

                self.notFound = function(data){
                    console.log('notfound',data)
                    self.setLocation('#/');
                };

                self.setActive = function(route,others){
                    $('#sidebar-wrapper li.active').toggleClass('active');
                    $('[href="' + route + '"]').parent('li').toggleClass('active');
                    _.each(others, function(route){
                        $('[href="' + route + '"]').parent('li').toggleClass('active');
                    })
                };

            }),
            _csrf = $('body').data('csrf');
        socket = ko.observable(io.socket);
        utils = {
            loader: {
                start: function(){
                    my.vm.utils.isBusy(true);
                    NProgress.start();
                },
                done: function(){
                    my.vm.utils.isBusy(false);
                    NProgress.done();
                }
            },
            isBusy: ko.observable()
        };

        return {
            app: app,
            _csrf: _csrf,
            utils: utils,
            socket: socket
        }

    })(my.vm);

});