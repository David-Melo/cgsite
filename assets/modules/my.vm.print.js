head.ready(function(){

    my.vm.print = (function(){
        var
            go = function(options){

                var url = '/print/' + options.mls + '/' + options.agent + '';

                NProgress.start();

                $('<div id="print-wrapper"/>').appendTo('body');

                if($('#print-frame')){
                    $('#print-frame').remove();
                }
                // Set attributes as a second parameter
                $('<iframe />', {
                    id: 'print-frame',
                    name: 'print-frame',
                    src: url,
                    class: 'ko-hidden',
                    width: '1124',
                    height: '9000'
                }).appendTo('#print-wrapper');
                setTimeout(function(){
                    window.frames["print-frame"].focus();
                    window.frames["print-frame"].print();
                    NProgress.done();
                },4000);
            },
            utils = {

            }

        return {
            go : go,
            utils: utils
        }

    })(my.vm.print);

});