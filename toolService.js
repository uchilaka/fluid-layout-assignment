angular.module('tools', [])
.factory('toolService', [ function() {
    if (typeof(console) == "undefined") { console = {}; } 
    if (typeof(console.log) == "undefined") { console.log = function() { return 0; }; };
    var verbose=true;
    return {
        getDOMId: function(prefix) {
            var id, numid;
            do {
                if(prefix) {
                    numid = Math.floor(Math.random()*100000);
                    id = prefix+numid;
                }
                else {
                    numid= Math.floor(Math.random()*1000000);
                    id = numid;
                }
            } while($('#'+id).length>0);
            return id;
        },
        log: function(obj, text) {
            if(verbose) {
                if(text) {
                    console.log(text + ' >> ');
                }
                if(obj) {
                    console.log(obj);
                }
            }
        },
    };
}]);