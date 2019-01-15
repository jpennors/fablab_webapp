/**
*  Factory liée aux éléments: Products et Services (Printings, Cuttings, ...)
*/
app.factory('Elements', function($resource, $q){

    return factory = {

        productsResource : $resource(__ENV.apiUrl + "/products/:id", {}, {
            'update': { method:'PUT' },
            'save' : { method: 'POST' }
        }),

        printingsResource : $resource(__ENV.apiUrl + "/printings/:id", {}, {
            'update': { method:'PUT' }
        }),

        cuttingsResource : $resource(__ENV.apiUrl + "/cuttings/:id", {}, {
            'update': { method:'PUT' }
        }),

        elements : {

            products : [],
            cuttings : [],
            printings : [],

        },

        load : function() {

            var deferred = $q.defer();
            var that = this;

            that.productsResource.get({}).$promise
            .then(function(res) {

                that.elements.products = res.data;
                return that.cuttingsResource.get({}).$promise;

            }, function(res){
                res.message = "Impossible de charger les produits";
                deferred.reject(res);
            })
            .then(function(res) {

                that.elements.cuttings = res.data;
                return that.printingsResource.get({}).$promise;

            }, function(res){
                res.message = "Impossible de charger les services de découpe";
                deferred.reject(res);
            })
            .then(function(res) {

                that.elements.printings = res.data;
                deferred.resolve(that.elements)

            }, function(res){
                res.message = "Impossible de charger les services d'impression";
                deferred.reject(res);
            });

            return deferred.promise;
        }

    }

});
