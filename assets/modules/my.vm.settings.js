/**
 * Created by dmelo on 2/18/14.
 */
head.ready(function(){

    my.vm.navigation.utils.modules.register({
        title: "Portal Settings",
        icon: "icon-cogs",
        routes: [
            {
                title:"Portal Details",
                route: "/#/settings/site"
            }
        ]
    });

    my.vm.app.get('#/settings',function() {
        var self = this;
        self.redirect('#/settings/site');
    });

    my.vm.app.get('#/settings/site',function() {
        var self = this;
        self.load('/template/find/settings/settings-index')
            .then(function(content){
                my.vm.settings.utils.site.load(function(){
                    console.log('beforeswamp');
                    self.swap(content,function(){
                        console.log('after');
                        my.vm.app.setActive(self.path,['/#/']);
                    });
                });
            });
    });

    my.vm.app.get('#/settings/theme',function() {

        var self = this;

        my.vm.themes.utils.load(function(){

            self.load('/template/find/settings/settings-template')
                .then(function(content){
                    my.vm.settings.utils.site.load(function(){
                        self.swap(content,function(){
                            my.vm.app.setActive(self.path,['/#/settings']);
                        });
                    });
                });

        });

    });


    my.vm.settings = (function(){
        var
            self = this,
            data = {},
            utils = {
                site: {
                    load: function(callback){
                        my.vm.utils.loader.start();
                        my.vm.socket().post('/settings/get', {_csrf:  my.vm._csrf } , function(res){
                            my.vm.sites.data.current(new my.vm.sites.utils.make(res.site));
                            my.vm.utils.loader.done();
                            if(callback) callback();
                        });
                    },
                    save: function(){
                        my.vm.settings.utils.site.set(function(){
                            my.vm.alerts.utils.create({mode:'success',message:'Site Settings Saved'});
                        });
                    },
                    set: function(callback){
                        my.vm.utils.loader.start();
                        var data = my.vm.sites.data.current().dirtyFlag.changes();
                        data._csrf = my.vm._csrf;
                        my.vm.socket().post('/settings/set', data , function(res){
                            if(res.err) if(callback) callback(res.err);
                            my.vm.sites.data.current().dirtyFlag.reset();
                            my.vm.utils.loader.done();
                            if(callback) callback(null);
                        });
                    },
                    success: function(data){
                        my.vm.settings.utils.site.load();
                    },
                    fail: function(data){
                        console.log('fail',data);
                    },
                    layout: {
                        select: function(data){
                            my.vm.sites.data.current().data.layout(data);
                            my.vm.settings.utils.site.set(function(err){
                                if(err) console.log(err);
                                console.log('hmmmm')
                                my.vm.alerts.utils.create({mode:'success',message:'New Layout Selected'});
                            })
                        }
                    },
                    theme: {
                        select: function(data){
                            my.vm.sites.data.current().data.theme(data);
                            my.vm.settings.utils.site.set(function(err){
                                if(err) console.log(err);
                                my.vm.alerts.utils.create({mode:'success',message:'New Theme Selected'});
                            })
                        }
                    },
                    homepage: {
                        set: function(page){
                            var pageUrl = page.settings().data.url();
                            my.vm.settings.utils.site.homepage.save(pageUrl);
                        },
                        save: function(pageUrl){
                            my.vm.utils.loader.start();
                            my.vm.socket().post('/settings/set', {_csrf:  my.vm._csrf, homepage: pageUrl } , function(res){
                                my.vm.utils.loader.done();
                                $('.modal').modal('hide');
                                if(res.err) my.vm.settings.utils.site.homepage.fail(res.err);
                                my.vm.sites.data.current().data.homepage(pageUrl);
                                my.vm.settings.utils.site.homepage.success();
                            });
                        },
                        success: function(){
                            my.vm.alerts.utils.create({mode:'success',message:'Home Page Selected'});
                        },
                        fail: function(err){
                            my.vm.settings.utils.site.homepage.fail()
                            console.log('homepagesetfail');
                        }
                    },
                    logo: {
                        remove: function(data){
                            my.vm.sites.data.current().data.logo(null);
                            $('#logo-remove-modal').modal('hide');
                            my.vm.settings.utils.site.set(function(){
                                my.vm.alerts.utils.create({mode:'success',message:'Website Logo Deleted'});
                            });
                        },
                        success: function(data){
                            my.vm.settings.utils.site.set(function(){
                                my.vm.alerts.utils.create({mode:'success',message:'Website Logo Saved'});
                            });
                        },
                        fail: function(data){
                            my.vm.alerts.utils.create({mode:'danger',message:'Website Logo Not Saved'});
                        }
                    }
                },
                profile: {
                    save: function(){
                        $('#profile-settings').submit();
                    },
                    load: function(callback){
                        my.vm.utils.loader.start();
                        my.vm.socket().post('/profile/get', {_csrf:  my.vm._csrf } , function(res){
                            console.log(res);
                            my.vm.settings.data.profile = new my.vm.users.utils.make(res.user);
                            my.vm.utils.loader.done();
                            if(callback) callback();
                        });
                    },
                    success: function(data){
                        my.vm.settings.data.profile.dirtyFlag.reset();
                    },
                    fail: function(data){
                        console.log('fail',data);
                    },
                    image: {
                        remove: function(data){
                            my.vm.settings.data.profile.data.image(null);
                            $('.image-upload').remove();
                            $('#profile-settings').submit();
                            $('#image-remove-modal').modal('hide');
                            my.vm.settings.data.profile.dirtyFlag.reset();
                        },
                        success: function(){
                            $('#profile-settings').submit();
                            my.vm.settings.data.profile.dirtyFlag.reset();
                        },
                        fail: function(data){
                            console.log('fail',data);
                        }
                    }
                }
            };

        return {
            data: data,
            utils: utils
        }

    })(my.vm.settings);

    my.vm.layouts = (function(){
        var
            self = this,
            data = {
                types: ko.observableArray([
                    {id:'basic',name:'Simple Site',description:'Simple site layout with a Header, Footer and a full width middle are for page content. This template is suitable for most simple websites that need a single, full width central area for content.'},
                    {id:'business-profile',name:'Business Profile',description:'This Layout has a Header and Footer section along with a main area. This area is composed of three columns. Two small columns on the sides that are global and a main center section for page content.'},
                    {id:'right-column',name:'Basic Right Column',description:'This Layout has a Header and Footer section along with a main area. This area is composed of two columns. One small column on the left which is global and a main section for page content on the right.'},
                    {id:'left-column',name:'Basic Left Column',description:'This Layout has a Header and Footer section along with a main area. This area is composed of two columns. One small column on the right which is global and a main section for page content on the left.'},
                ]),
                templatesLoaded: ko.observable(false),
                templates: []
            },
            utils = {
                loadTemplates: function(callback){
                    if(my.vm.layouts.data.templatesLoaded()){
                        return callback();
                    }
                    async.each(my.vm.layouts.data.types(), function(item,callback) {

                        $.get('/template/mustache/layouts/' + item.id, function(template){

                            // Lets render the template
                            var rendered = Mustache.render(template);

                            item.template = rendered;

                            callback();

                        });

                    }, function(err){

                        if(err) console.log(err);

                        my.vm.layouts.data.templatesLoaded(true);

                        if(callback) callback();

                    });
                },
                getTemplate: function(id){
                    var layout = _.find(my.vm.layouts.data.types(),function(item){
                        return id===item.id;
                    });
                    return layout.template;
                },
                select: function(data){
                    my.vm.settings.utils.site.layout.select(data.id);
                }
            };

        return {
            data: data,
            utils: utils
        }
    })(my.vm.layouts);

    my.vm.themes = (function(){
        var
            self = this,
            data = {
                collection: ko.observableArray([])
            },
            utils = {
                make: function(options){

                    var self = this;
                    var defaultOptions = {
                        name: null,
                        description: null,
                        preview: null,
                        thumbnail: null,
                        css: null,
                        cssMin: null,
                        cssCdn: null,
                        less: null,
                        lessVariables: null
                    }

                    var data = $.extend(true, {}, defaultOptions, options);

                    self.data = {
                        name: ko.observable(),
                        description: ko.observable(),
                        preview: ko.observable(),
                        thumbnail: ko.observable(),
                        css: ko.observable(),
                        cssMin: ko.observable(),
                        cssCdn: ko.observable(),
                        less: ko.observable(),
                        lessVariables: ko.observable()
                    };

                    self.init = function(data){
                        self.data.name(data.name);
                        self.data.description(data.name);
                        self.data.preview(data.preview);
                        self.data.thumbnail(data.thumbnail);
                        self.data.css(data.css);
                        self.data.cssMin(data.cssMin);
                        self.data.cssCdn(data.cssCdn);
                        self.data.less(data.less);
                        self.data.lessVariables(data.lessVariables);
                    };

                    self.utils = {}

                    self.init(data);
                },
                load: function(callback){
                    my.vm.themes.data.collection([]);
                    my.vm.utils.loader.start();
                    $.ajax({
                        url: 'http://api.bootswatch.com/3/',
                        type: 'GET',
                        success: function(data) {
                            _.each(data.themes,function(theme){
                                my.vm.themes.data.collection.push(new my.vm.themes.utils.make(theme))
                            });
                            my.vm.utils.loader.done();
                            if(callback) callback();
                        }
                    });

                },
                render: function(theme,callback){

                    my.vm.utils.loader.start();
                    $('head').append('<link id="bootstrap" class="bootstrap" rel="stylesheet" href="' + theme.data.cssCdn() + '" type="text/css" />');
                    setTimeout(function(){
                        $("link").each(function() {
                            var isLayout = ($(this).attr("href").match(/\/layout/)) ? true : false;
                            if (isLayout){
                                $('head').append($(this));
                            }
                        });
                        $('.bootstrap')[0].remove();
                        my.vm.utils.loader.done();
                        if (callback) callback();
                        $('body').css('margin-top', $('#main-bar').height() + 'px');
                    }, 250);

                },
                preview: function(theme){
                    my.vm.themes.utils.render(theme);
                },
                select: function(theme){
                    my.vm.themes.utils.render(theme,function(){
                        my.vm.settings.utils.site.theme.select(theme.data.cssCdn());
                        $('body').css('margin-top', $('#main-bar').height() + 'px');
                    });
                }
            };

        return {
            data: data,
            utils: utils
        }

    })(my.vm.themes);


});