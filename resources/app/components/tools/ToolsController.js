app.controller('toolsCtrl', function($scope, $http, Tools, $uibModal, ErrorHandler) {

    init = function(){
        Tools.get({}, function(res){
            $scope.tools = res.data;
        }, function(error){
            ErrorHandler.alert(error);
        });
    }
    init()

    $scope.delete = function(id) {
        var aSupprimer = $scope.tools.filter((e)=>e.id==id)[0];
        var index = $scope.tools.indexOf(aSupprimer);

        Tools.remove({id:id}, function() {
            $scope.tools.splice(index, 1);
        })
    }

    $scope.alertFilter = function(e) {
        return e.remainingQuantity <= e.minQuantity;
    }

    //Ouvre la modale avec les détails d'un objet
    $scope.open = function(id, type) {
        var selected;
        // Si c'est une création
        if(id == null){
            selected = {
                minQuantity: 0,
                remainingQuantity: 0
            };
        }else {
            selected = $scope.tools.filter((e)=>e.id==id)[0];
        }
        var modalInstance = $uibModal.open({
            backdrop: true,
            keyboard: true,
            size:'lg',
            templateUrl: 'app/components/tools/modal/tools_edit.html',

            resolve:{
                object: function() {
                    return angular.copy(selected);
                },
                type: function() {
                    return type;
                }
            },
            controller: 'toolsEditCtrl'
        });

        // On modifie dans la liste de consommables l'objet qui vient d'être édité
        modalInstance.result.then(function(res) {
            // hack pour supprimer un outil depuis la modale
            if(res.type == "delete"){
                $scope.delete(res.id);
            }
            init()
        })
    }
});
