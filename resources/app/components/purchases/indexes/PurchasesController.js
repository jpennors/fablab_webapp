app.controller('purchasesCtrl', function($scope, $http, $filter, ErrorHandler, $rootScope, $location, Purchases, PurchasedElements, $uibModal, $window) {

    if(!$rootScope.can('order-CAS-member')){
        $location.path('error/404')
    } else {
        /**
        *  Initialisation de la page
        */
        $scope.user = $rootScope.auth.member;
        $scope.membreCAS = $rootScope.isExtern();

        $scope.selectedTab = 'commandes';

        $scope.filter = {}
        $scope.filter.type = "3"

        $scope.filter.statusFilter = function(){
            return function(purchase){
                switch ($scope.filter.type){
                    case "0":
                        return purchase.status == 0
                    case "1":
                        return purchase.status == 1
                    case "2":
                        return purchase.status == 2
                    case "3":
                        return purchase.status < 3
                }
            }
            
        }
        $scope.triStatus = 3;


        /**
        *  Chargement des Purchases
        */
        Purchases.get({}, function(res){
            $scope.purchases = res.data;
            $scope.apiUrl = __ENV.apiUrl;
            console.log($scope.purchases)
        }, function(error){
            ErrorHandler.alert(error);
        });


        /**
        *   Chargement des Purchased Elements
        */
        if (!$scope.membreCAS) {
            PurchasedElements.get({}, function(res){
                $scope.elements = res.data;
            }, function(error){
                ErrorHandler.alert(error);
            });
        }
            



        /**
        *   Redirection vers le détail de la commande
        */
        $scope.open = function(id) {
            $window.location.href = "#/purchases/" + id + "/edit"
        }
    }

});
