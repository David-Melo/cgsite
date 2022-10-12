head.load(
    // /modules Loader
    { ko:         '/modules/knockout-3.2.0.js' },
    { sortable:   '/modules/knockout-sortable-0.9.3.js'},
    { plugins:    '/modules/ko.plugins.js' },
    { validate:   '/modules/knockout-validation-2.0.0.js' },
    { app:        '/modules/my.vm.js' },
    { session:    '/modules/my.vm.session.js' },
    { navigation: '/modules/my.vm.navigation.js' },
    { pagination: '/modules/my.vm.pagination.js' },
    { sites:      '/modules/my.vm.sites.js' },
    { users:      '/modules/my.vm.users.js' },
    { settings:   '/modules/my.vm.settings.js' },
    { alerts:     '/modules/my.vm.alerts.js' },
    { grids:      '/modules/my.vm.grids.js' },
    { search:     '/modules/my.vm.search.js' },
    { email:      '/modules/my.vm.email.js' },
    { print:      '/modules/my.vm.print.js' },
    { share:      '/modules/my.vm.share.js' },
    { mortgage:   '/modules/my.vm.mortgage.js' },
    // App Launch
    function(){

        head.ready(function(){

            window.setTimeout(function(){

                ko.applyBindingsWithValidation(my.vm, document.getElementById('main-body'),{
                    registerExtenders: true,
                    messagesOnModified: true,
                    insertMessages: true,
                    errorMessageClass: 'cms-message-error text-danger',
                    decorateElement: true,
                    errorElementClass: 'has-error',
                    parseInputAttributes: true,
                    messageTemplate: null
                });

                //my.vm.app.run('/#');

            }, 0);

        })

    }
);
