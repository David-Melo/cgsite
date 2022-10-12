head.ready(function(){

    ko.dirtyFlag = function(root, initializer, isInitiallyDirty)
    {

        var getChanges = function (prev, now) {
            var changes = {};
            for (var prop in now) {
                if (!prev || prev[prop] !== now[prop]) {
                    if (typeof now[prop] == "object" && now[prop] !== null) {
                        var c = getChanges(prev[prop], now[prop]);
                        if (! _.isEmpty(c) ) // underscore
                            changes[prop] = c;
                    } else {
                        changes[prop] = now[prop];
                    }
                }
            }
            return changes;
        }

        var result = function() {},
            _initialState = ko.observable(ko.toJSON(root)),
            _isInitiallyDirty = ko.observable(isInitiallyDirty);

        result.isDirty = ko.dependentObservable(function() {
            return _isInitiallyDirty() || _initialState() !== ko.toJSON(root);
        });

        result.reset = function() {
            _initialState(ko.toJSON(root));
            _isInitiallyDirty(false);
        };

        result.revert = function() {
            if (typeof initializer === "function") {
                initializer(ko.utils.parseJson(_initialState()));
                _isInitiallyDirty(false);
            }
        };

        result.changes = function() {
            var original = ko.utils.parseJson(_initialState()),
                changed = ko.utils.parseJson(ko.toJSON(root));
            return getChanges(original,changed);
        }

        return result;
    };

    ko.bindingHandlers.enterkey = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var allBindings = allBindingsAccessor();

            $(element).on('keypress', function (e) {
                var keyCode = e.which || e.keyCode;
                if (keyCode !== 13) {
                    return true;
                }

                var target = e.target;
                target.blur();

                allBindings.enterkey.call(viewModel, viewModel, target, element);

                return false;
            });
        }
    }

	ko.bindingHandlers.tabs = {
		init: function(element, valueAccessor) {

			var options = valueAccessor();
			var context = ko.unwrap(options);

			_.each($(element).find('li'), function(item,key){
				$(item).find('a').attr('href', '#' + options + '-' + $(item).index());
			});

			_.each($(element).find('.tab-pane'), function(item,key){
			    $(item).attr('id', options + '-' + $(item).index());
			});

		}
	};

    ko.bindingHandlers.tabsLink = {
        init: function(element, valueAccessor) {

            var options = valueAccessor();
            $(element).find('a').attr('href', '#' + options.set + '-' + options.index());

        }
    };

    ko.bindingHandlers.tabsPane = {
        init: function(element, valueAccessor) {

            var options = valueAccessor();
            $(element).attr('id', options.set + '-' + options.index());

        }
    };

    ko.bindingHandlers.tooltip = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {

            var options = valueAccessor();
            var defaultOptions = {
                placement: 'bottom',
                title: 'ToolTip',
                container: 'body'
            }
            options = $.extend(true, {}, defaultOptions, options);
            $(element).data('toggle','tooltip');
            $(element).tooltip(options);

        }
    };

    ko.bindingHandlers.numericValue = {
        init : function(element, valueAccessor, allBindingsAccessor) {
            var underlyingObservable = valueAccessor();

            var interceptor = ko.dependentObservable({
                read: underlyingObservable,
                write: function(value) {
                    if (!isNaN(value)) {
                        underlyingObservable(parseFloat(value));
                    }
                }
            });
            ko.bindingHandlers.value.init(element, function() { return interceptor }, allBindingsAccessor);
        },
        update : ko.bindingHandlers.value.update
    };

    ko.bindingHandlers.stopBinding = {
        init: function() {
            return { controlsDescendantBindings: true };
        }
    };

    ko.virtualElements.allowedBindings.stopBinding = true;

    ko.bindingHandlers.formField = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            var options = valueAccessor();

            ko.renderTemplate(
                "form-group-tpl",
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

    ko.bindingHandlers.socketForm = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {

            var options = valueAccessor();

            $(element).on('submit', function(e,d){

                e.preventDefault();

                function validate(next){
                    if(options.model.utils.validation().length){
                        options.model.utils.validation.showAllMessages();
                    }else{
                        next()
                    }
                }

                function send(next){

                    var url  = $(element).attr('action');
                    var data = ko.toJS(options.model.data);
                    delete data.errors;
                    data._csrf =  my.vm._csrf;
                    my.vm.socket().post(url, data, function(res){
                        if(res && res.err){
                            next(false,res);
                        } else if (!res) {
                            next(false,{system:[{message:'There was an error with your request.',rule:'syserr'}]});
                        } else {
                            next(true,res);
                        }
                    });

                }

                function success(data){
                    if(options.reset) $(element)[0].reset();
                    options.success(data);
                }

                function failure(data){
                    var errors = $('<ul />', {
                        class: 'list-unstyled'
                    });
                    var container = $('<div />', {
                        class: 'error-container alert alert-danger'
                    });
                    for ( var val in data.err ) {
                        ko.utils.arrayForEach(data.err[val], function(item) {
                            errors.append("<li>"+item.message+"</li>");
                        });
                    }
                    $(container).append(errors);
                    $(element).prepend(container);
                    options.fail(data);
                }

                validate(function(){
                    NProgress.start();
                    send(function(status,data){
                        NProgress.done();
                        $(element).find('.error-container').remove();
                        if(status){
                            success(data);
                        } else {
                            failure(data);
                        }
                    });
                });

            });

        }
    };

    ko.bindingHandlers.affix = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            var options = valueAccessor();
            var unwrapped = ko.utils.unwrapObservable(options);

            var defaultOptions = {
                width: $(element).width(),
                min: 50,
                top: $('#main-bar').height(),
                windowH: $(window).outerHeight(),
                windowW: $(window).outerWidth()
            };
            options = $.extend(true, {}, defaultOptions, options);

            if(options.windowH>options.min&&options.windowW>974){
                $(element).affix({
                    offset: {
                        target: $('#page-content-wrapper'),
                        top: options.top
                    }
                });
            }

            $(element).on('affix.bs.affix', function (e) {
                $(element).width($(element).innerWidth());
                if(options.sibling)
                    $(options.sibling).css('padding-top',$(element).height());
            });

            $(element).on('affix-top.bs.affix', function (e) {
                window.origHeight = $(element).innerHeight();
                window.origWidth = $(element).innerWidth();
                if(options.sibling)
                    $(options.sibling).css('padding-top',0);
            });

        }
    };

    ko.bindingHandlers.sliderValue = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

            var params = valueAccessor();

            $(element).slider({
                value: params.value(),
                min: params.options.min(),
                max: params.options.max(),
                step: params.options.step(),
                ticks: params.options.ticks,
                //ticks_labels: params.options.ticks_labels,
                range: true,
                tooltip_split: true,
                tooltip: 'show',
                ticks_snap_bounds: 1,
                formatter: function(val){
                    return Globalize.format(val,params.format);
                }
            });


            // Make sure we update the observable when changing the slider value
            $(element).on('slideStop', function (ev) {
                params.value(ev.value);
            });

            $(element).on('change', function (ev) {
                console.log(ev.value.newValue,ev.value.oldValue)
                if(!_.isEqual(ev.value.newValue,ev.value.oldValue)){
                    setTimeout(function(){
                        my.vm.search.utils.go()
                    },500)
                }
            });

        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var params = valueAccessor();
            var valueObservable;

            $(element).slider('setValue', params.value());
        }
    };

    ko.bindingHandlers.gallery = {
        update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            var images = valueAccessor();
            var gallery = [];

            _.each(images,function(item){
                gallery.push({image:item})
            });

            Galleria.loadTheme('/galleria/themes/classic/galleria.classic.min.js');
            Galleria.configure({
                imageCrop: false,
                autoplay: 60000,
                responsive: true,
                lightbox: true,
                showCounter: true,
                transition: 'fade',
                dataSource: gallery
            });
            Galleria.run(element);
        }
    };

    ko.bindingHandlers.gmap = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            var options = valueAccessor();
            var unwrapped = ko.utils.unwrapObservable(options);
            var defaultOptions = {
                center: { lat:25.7511143, lng: -80.259729} ,
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scrollwheel: false
            };
            options = $.extend(true, {}, defaultOptions, options);

            var map = new google.maps.Map(element,options);

            var geocoder = new google.maps.Geocoder();
            var label = new google.maps.InfoWindow({
                content: options.address
            });

            geocoder.geocode({ 'address': options.address }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {

                    map.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });
                    label.open(map,marker);

                    google.maps.event.trigger(map,'resize')

                };
            });

        }
    };

});
