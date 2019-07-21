app.controller('purchasesCtrl', function($scope, $http, $filter, ErrorHandler, $rootScope, $location, Purchases, PurchasedElements, $uibModal, $window) {

    if(!$rootScope.can('order-CAS-member')){
        $location.path('error/404')
    } else {
        /**
        *  Initialisation de la page
        */

        $scope.user = $rootScope.auth.member;
        $scope.membreCAS = $rootScope.isExtern();
        $scope.apiUrl = __ENV.apiUrl;

        $scope.selectedTab = 'commandes';

        $scope.filter = {}
        $scope.filter.type = "3"

        $scope.loading = true;

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

        $scope.filter.unpaidFilter = function(){
            return function(purchase){
                if (purchase.status == 3 && !purchase.paid) {
                    return true;
                } else {
                    return false
                }
            }
            
        }

        $scope.filter.enCours = function(){
            return function(purchase){
                if (purchase.status < 3) {
                    return true
                } else {
                    return false
                }
            }
        }

        $scope.triStatus = 3;


        /**
        *  Chargement des Purchases
        */
        switch ($location.path()){
            case '/mypurchases':
                Purchases.getMyPurchases({}, function(res){
                    $scope.purchases = res.data
                    $scope.loading = false;
                }, function(error){
                    ErrorHandler.alert(error);
                    $scope.loading = false;
                });
                break;
            case '/purchases':
                Purchases.get({}, function(res){
                    $scope.purchases = res.data
                    $scope.loading = false;
                }, function(error){
                    ErrorHandler.alert(error);
                    $scope.loading = false;
                });
                break;
            case '/purchases/history':
                Purchases.getHistoryPurchases({}, function(res){
                    $scope.purchases = res.data
                    $scope.loading = false;
                }, function(error){
                    ErrorHandler.alert(error);
                    $scope.loading = false;
                });
                break;
        }


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
            window.open(
                window.__env.webappUrl + "#/purchases/" + id + "/edit",
                '_blank' 
            );
        }
    }

});
