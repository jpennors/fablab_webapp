/*
*  Gestion des Products
*/
app.controller('productsCtrl', function($scope, $http, ErrorHandler, $uibModal, Elements, $rootScope, $location){

    //On vérifie que l'utilisateur a l'autorisation d'accéder à la page
    if(!$rootScope.can('list-product'))
        $location.path("/error/404");

    $scope.products = [];

    function init() {
        $scope.alertFilterOn = false;
        Elements.productsResource.get({}, function(data){
            $scope.products = data.data;
        }, function(error){
            ErrorHandler.alert(error);
        });
    }
    init();

    $scope.alertFilter = function(e) {
        return e.remainingQuantity <= e.minQuantity;
    }

    $scope.delete = function(id) {
        var aSupprimer = $scope.products.filter((e)=>e.id==id)[0];
        var index = $scope.products.indexOf(aSupprimer);
        Elements.productsResource.delete({id:id}, function() {
            $scope.products.splice(index, 1);
        })
    }

    //Fonction pour exporter les produits + téléchargement
    $scope.export = function(){
        $http.get(__ENV.apiUrl + '/product/export', {responseType : "blob"}).then(
        function(data){
            saveAs(data.data, 'inventaire_produits.xlsx');
        });
    }

    //Ouvre la modale avec les détails d'un objet
    $scope.open = function(id, type) {
        console.log(id)
        var selected = $scope.products.filter((e)=>e.id==id)[0];
        if(selected === undefined) selected = {
            minQuantity: 0,
            remainingQuantity: 0,
            price:0
        };
        var modalInstance = $uibModal.open({
            backdrop: true,
            keyboard: true,
            size:'lg',
            templateUrl: 'app/components/products/modal/products_edit.html',
            resolve:{
                object: function() {
                    return angular.copy(selected);
                },
                type: function() {
                    return type;
                }
            },
            controller: 'productsEditCtrl'
        });

        // On modifie dans la liste de consommables l'objet qui vient d'être édité
        modalInstance.result.then(function(res) {
            init()
            if(res.type == "delete"){
                $scope.delete(res.id);
            }
        })
    }

});
