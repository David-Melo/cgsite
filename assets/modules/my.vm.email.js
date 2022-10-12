head.ready(function(){

    my.vm.email = (function(){
        var
            share = {
                data: {
                    id: ko.observable(null),
                    sysid: ko.observable(null),
                    address: ko.observable(null),
                    link: ko.observable(null),
                    sender: ko.observable(null),
                    recipients: ko.observable(null),
                    message: ko.observable(null),
                    image: ko.observable(null)
                },
                open: function(data){
                    console.log('clicked');
                    my.vm.email.share.data.id(data.id);
                    my.vm.email.share.data.sysid(data.sysid);
                    my.vm.email.share.data.link('http://www.canerogroup.com/listings/'+data.mls);
                    my.vm.email.share.data.image(data.images[0]);
                    my.vm.email.share.data.address(data.full_address);
                    $('#email-share-modal').modal('show');
                },
                send: function(){

                    NProgress.start();

                    var data ={
                        _csrf:  my.vm._csrf,
                        subject: 'Someone has shared a listing.',
                        email: my.vm.email.share.data.sender(),
                        contact: my.vm.email.share.data.recipients(),
                        id: my.vm.email.share.data.id(),
                        link: my.vm.email.share.data.link(),
                        address: my.vm.email.share.data.address(),
                        message: my.vm.email.share.data.message(),
                        maps: maps = [
                            'http://maps.google.com/maps/api/staticmap?zoom=11&markers=' + encodeURIComponent(my.vm.email.share.data.address())+ '&size=650x300&maptype=hybrid&sensor=false&key=AIzaSyAEOatx92PSJvWcpzPOrTG6NblOhzJKVxU',
                            'http://maps.google.com/maps/api/staticmap?zoom=14&markers=' + encodeURIComponent(my.vm.email.share.data.address())+ '&size=650x300&maptype=hybrid&sensor=false&key=AIzaSyAEOatx92PSJvWcpzPOrTG6NblOhzJKVxU',
                            'http://maps.google.com/maps/api/staticmap?zoom=17&markers=' + encodeURIComponent(my.vm.email.share.data.address())+ '&size=650x300&maptype=hybrid&sensor=false&key=AIzaSyAEOatx92PSJvWcpzPOrTG6NblOhzJKVxU'
                        ],
                        image: my.vm.email.share.data.image()
                    };

                    var template = $("#share-listing-form-tpl").html();
                    var output = Mustache.render(template, data);

                    //data.body = output.replace(/\s{2,}/g,' ');
                    //data.body = data.body.replace(/'/g,'\u2018');
                    data.body = output;

                    my.vm.socket().post('/mail/send', data, function(res){
                        if(res===200){
                            $('.email-listing')[0].reset();
                            $('#email-share-modal').modal('hide');
                            //ga('send', 'event', 'Shared', 'Email')
                            NProgress.done();
                        }else{
                            $('.email-listing')[0].reset();
                            $('#email-share-modal').modal('hide');
                            NProgress.done();
                        }
                    });

                }
            };

        return {
            share: share
        }

    })(my.vm.email);

    my.vm.appointments = (function(){
        var
            utils = {
                makeDates: function(){

                    var d1 = moment();
                    var d2 = moment().add(9,'days');
                    var itr = moment(d1).twix(d2).iterateInner("days");

                    var range=[];
                    while(itr.hasNext()){
                        range.push(itr.next().format());
                    }

                    var days = [];
                    ko.utils.arrayForEach(range, function(item) {
                        var shortDay = moment(item).format('ddd');
                        if(shortDay !== 'Sat' && shortDay !== 'Sun'){
                            days.push({label:moment(item).format('dddd, MM/D/YY'),value:moment(item).format()});
                        }
                    });
                    return days;

                }
            };

        return {
            utils: utils
        }

    })(my.vm.appointments);

    my.vm.mailer = (function(){
        var
            utils = {
                makeMail:function(data){

                    var self = this;

                    self.subject = ko.observable(data.subject);
                    self.contact = ko.observable(data.contact);

                    self.email = ko.observable(data.email);
                    self.name = ko.observable(data.name);
                    self.phone = ko.observable(data.phone);
                    self.message = ko.observable(data.message);

                    self.data = data;

                    return self;

                },
                send: function(message,tpl,callback){

                    NProgress.start();

                    var data = ko.toJS(message);
                    var template = $("#"+tpl).html();
                    var output = Mustache.render(template, data.data);

                    data.body = output.replace(/\s{2,}/g,' ');
                    data.body = data.body.replace(/'/g,'\u2018');
                    data._csrf =  my.vm._csrf;

                    console.log(data,output)

                   my.vm.socket().post('/mail/send', data, function(res){
                        if(res===200){
                            callback(null);
                        }else{
                            callback('There Was An Error');
                        }
                        NProgress.done();
                    });

                }
            };

        return {
            utils: utils
        }

    })(my.vm.mailer);

    ko.bindingHandlers.inlineForm = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            var options = valueAccessor();
            var defaultOptions = {

            };

            options = $.extend(true, {}, defaultOptions, options);

            $(element).on('submit', function(e,d){

                // Hold Of Normal Form Behavior
                e.preventDefault();
                e.stopPropagation();

                var settings = {
                    contact: options.contact,
                    subject: options.subject
                };
                var formData = $(element).serializeArray();

                ko.utils.arrayForEach(formData, function(item) {
                    switch (item.name) {
                        case 'name':
                            settings.name = item.value;
                            break;
                        case 'email':
                            settings.email = item.value;
                            break;
                        case 'phone':
                            settings.phone = item.value;
                            break;
                        case 'message':
                            settings.message = item.value;
                            break;
                        default:
                            settings[item.name] = item.value;
                            break;
                    }
                });

                var message = new my.vm.mailer.utils.makeMail(settings);

                //ga('send', 'event', 'Contact Form', options.template);

                my.vm.mailer.utils.send(message,options.template,function(err){
                    if(err) console.log(err);
                    $("body").animate({ scrollTop: 0 }, "fast");
                    $('#thanks').modal('show');
                });

            });

        }
    };

});