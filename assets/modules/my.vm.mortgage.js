head.ready(function(){

    my.vm.mortgage = (function(){
        var
            data= {
                baseprice: ko.observable(0),
                downpayment: ko.observable(20),
                loanamount: ko.observable(0),
                interest: ko.observable(4.5),
                years: ko.observable(30),
                payments: ko.observable(0)
            },
            utils = {
                calculate: function(a,b){
                    my.vm.mortgage.data.baseprice($(b.target).data('price'));
                    $('#mortgage-calculator').modal('show');
                    //ga('send', 'event', 'Mortgage', 'Calculated');
                }
            };

        return {
            data: data,
            utils: utils
        }

    })(my.vm.mortgage);

    my.vm.mortgage.calculate = ko.computed(function(){
        var baseprice = parseFloat(my.vm.mortgage.data.baseprice());
        var downpayment = parseFloat(my.vm.mortgage.data.downpayment());
        var interest = parseFloat(my.vm.mortgage.data.interest())/1200;
        var term = parseFloat(my.vm.mortgage.data.years())*12;

        var loanamount = baseprice - baseprice*(downpayment*.01);
        var payments = loanamount * interest / (1 - (Math.pow(1/(1 + interest), term)));

        my.vm.mortgage.data.loanamount(loanamount);
        my.vm.mortgage.data.payments(payments);

        return parseFloat(payments);
    });

    ko.bindingHandlers.caculateMortgage = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            var options = valueAccessor();
            var unwrapped = ko.utils.unwrapObservable(options);
            var defaultOptions = {
            };
            options = $.extend(true, {}, defaultOptions, options);

            my.vm.mortgage.data.baseprice(parseInt(options.price));
            ko.applyBindingsToDescendants(my.vm,document.getElementById('mortgage-calculator'));

        },
        update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            var options = valueAccessor();
            var unwrapped = ko.utils.unwrapObservable(options);
            var defaultOptions = {
            };
            console.log('updated');

        }
    };

});