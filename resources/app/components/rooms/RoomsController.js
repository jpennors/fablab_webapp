app.controller('roomsCtrl', function($scope, $http, Rooms, $uibModal, ErrorHandler, $location, $rootScope) {
    
    //On vérifie que l'utilisateur a l'autorisation d'accéder à la page
    if(!$rootScope.can('list-room'))
      $location.path("/error/404");

    else{
        function init() {
            $scope.alertFilterOn = false;
            Rooms.get({}, function(res){
                $scope.rooms = res.data;
                console.log(res.data);
            }, function(error){
                ErrorHandler.alert(error);
            });
        }

        $scope.alertFilter = function(e) {
            return e.remainingQuantity <= e.minQuantity;
        }

        $scope.delete = function(id) {
            var aSupprimer = $scope.rooms.filter((e)=>e.id==id)[0];
            var index = $scope.rooms.indexOf(aSupprimer);

            Rooms.remove({id:id}, function() {
                $scope.rooms.splice(index, 1);
            })
        }

        //Ouvre la modale avec les détails d'un objet
        $scope.open = function(id, type) {
            var selected = $scope.rooms.filter((e)=>e.id==id)[0];
            // if(selected === undefined) selected = {
            //     minQuantity: 0,
            //     remainingQuantity: 0
            // };

            var modalInstance = $uibModal.open({
                backdrop: true,
                keyboard: true,
                size:'lg',
                templateUrl: 'app/components/rooms/modal/rooms_edit.html',

                resolve:{
                    object: function() {
                        return angular.copy(selected);
                    },
                    type: function() {
                        return type;
                    }
                },
                controller: 'roomsEditCtrl'
            });

            // On modifie dans la liste de consommables l'objet qui vient d'être édité
            modalInstance.result.then(function(res) {
                console.log(res.changedRoom);
                if(res.type == "delete"){
                    $scope.delete(res.id);
                }
                if(res.type == "create") {
                    $scope.rooms.push(angular.copy(res.changedRoom));
                }else if(res.type=="edit") {
                    $scope.rooms[$scope.rooms.indexOf(selected)] = angular.copy(res.changedRoom);
                }
            })
        }
        init();
    }
});
