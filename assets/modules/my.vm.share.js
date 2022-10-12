head.ready(function(){

    ko.bindingHandlers.facebookShare = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            var options = valueAccessor();
            var unwrapped = ko.utils.unwrapObservable(options);
            var defaultOptions = {
            };
            options = $.extend(true, {}, defaultOptions, options);

            $(element).sharrre({
                share: {
                    facebook: true
                },
                template: '<a href="#"><i class="icon-facebook-rect"></i> Like on Facebook</a>',
                enableHover: false,
                enableTracking: false,
                click: function(api, options){
                    api.simulateClick();
                    api.openPopup('facebook');
                    //ga('send', 'event', 'Shared', 'Facebook');
                },
                title: options.title,
                text: 'I\'m looking at ' + options.title + ' on The Canero Group, Real Estate Investment Services',
                url: options.url
            });

        }
    };

    ko.bindingHandlers.twitterShare = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            var options = valueAccessor();
            var unwrapped = ko.utils.unwrapObservable(options);
            var defaultOptions = {
            };
            options = $.extend(true, {}, defaultOptions, options);

            $(element).sharrre({
                share: {
                    twitter: true
                },
                template: '<a href="#"><i class="icon-twitter-squared"></i> Share on Twitter</a>',
                enableHover: false,
                enableTracking: false,
                click: function(api, options){
                    api.simulateClick();
                    api.openPopup('twitter');
                    //ga('send', 'event', 'Shared', 'Twitter');
                },
                title: options.title,
                text: 'I\'m looking at ' + options.title + ' on The Canero Group, Real Estate Investment Services',
                url: options.url
            });

        }
    };

    ko.bindingHandlers.gplusShare = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            var options = valueAccessor();
            var unwrapped = ko.utils.unwrapObservable(options);
            var defaultOptions = {
            };
            options = $.extend(true, {}, defaultOptions, options);

            $(element).sharrre({
                share: {
                    facebook : true
                },
                template: '<a href="#"><i class="icon-googleplus-rect"></i> Share on Google+</a>',
                enableHover: false,
                enableTracking: false,
                click: function(api, options){
                    api.simulateClick();
                    api.openPopup('googlePlus');
                    //ga('send', 'event', 'Shared', 'Google+');
                },
                title: options.title,
                text: 'I\'m looking at ' + options.title + ' on The Canero Group, Real Estate Investment Services',
                url: options.url
            });

        }
    };

    ko.bindingHandlers.linkedInShare = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            var options = valueAccessor();
            var unwrapped = ko.utils.unwrapObservable(options);
            var defaultOptions = {
            };
            options = $.extend(true, {}, defaultOptions, options);

            $(element).sharrre({
                share: {
                    linkedin: true
                },
                template: '<a href="#"><i class="icon-linkedin-rect"></i> Post on LinkedIn</a>',
                enableHover: false,
                enableTracking: false,
                click: function(api, options){
                    api.simulateClick();
                    api.openPopup('linkedin');
                    //ga('send', 'event', 'Shared', 'LinkedIn');
                },
                title: options.title,
                text: 'I\'m looking at ' + options.title + ' on The Canero Group, Real Estate Investment Services',
                url: options.url
            });

        }
    };

});/**
 * Created by dmelo on 3/15/2015.
 */
