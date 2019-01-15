app.controller('expendablesEditCtrl', function($scope, object, type, $uibModalInstance, $http, Expendables, $window, ErrorHandler, Helpers, Rooms, Wardrobes) {
    $scope.expendable = object;
    $scope.type = type;
    if($scope.expendable.picture) {
        $scope.previewSrc = __ENV.apiUrl + "/expendables/image/" + $scope.expendable.id;
    }
    $scope.errors = null;
    Rooms.get({}, function(res){
        $scope.rooms = res.data;
        $scope.selectedRoom = res.data.filter((r)=>r.id == $scope.expendable.room_id)[0];
    }, function(error){
        ErrorHandler.alert(error);
    });

    Wardrobes.get({}, function(res){
        $scope.wardrobes = res.data;
        $scope.selectedWardrobe = res.data.filter((r)=>r.id == $scope.expendable.wardrobe_id)[0];
    }, function(error){
        ErrorHandler.alert(error);
    });

    $scope.$watch("type", () => {
        $scope.show = $scope.type == 'show' || $scope.type == 'view';
        $scope.edit = $scope.type == 'edit' || $scope.type == 'create';
        $scope.canChange = $scope.type == 'view';
        $scope.canDelete = $scope.type == 'edit' || $scope.type == 'view';
    })

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    }

    $scope.$watch("expendable.pic", function(newV, oldV) {
        if(newV !== oldV && newV instanceof File) {
            $scope.previewSrc = $window.URL.createObjectURL(newV);
        }
    });

    $scope.delete = function() {
        $uibModalInstance.close({id:$scope.expendable.id, type:"delete"});
    }

    function updatePreview() {
        // Si on a pas de chemin vers l'image, et si on a une image dans l'input
        if($scope.expendable.pic instanceof File && !$scope.expendable.picture) {
            $scope.previewSrc = $window.URL.createObjectURL($scope.expendable.pic);
        }
    }

    $scope.save = function() {
        $scope.messageError = null;
        $scope.inputErrors = null;
        $scope.expendable.room_id = null
        $scope.expendable.wardrobe_id = null
        if($scope.selectedRoom) {
            $scope.expendable.room_id = $scope.selectedRoom.id;
            $scope.expendable.roomName = $scope.selectedRoom.name;

            if($scope.selectedWardrobe) {
                $scope.expendable.wardrobeName = $scope.selectedWardrobe.name;
                //Le nom a été mis à jour grâce à ng-model mais pas l'id, on va donc le rechercher dans les wardrobes
                for (var i = $scope.wardrobes.length - 1; i >= 0; i--) {
                    if ($scope.wardrobes[i].name == $scope.selectedWardrobe.name && $scope.wardrobes[i].room_id == $scope.expendable.room_id){
                        $scope.expendable.wardrobe_id = $scope.wardrobes[i].id
                        break
                    }
                }
            }
        } 
        
        if ($scope.type=='edit') {
            Expendables.update({id:$scope.expendable.id}, $scope.expendable, envoyerImage, gererErreur);
        }else if($scope.type=='create') {
            Expendables.save({}, $scope.expendable, envoyerImage, gererErreur);
        }
    }

    var envoyerImage = function(res) {
        // Si on viens de créer un consommable, on récupère l'id de l'objet créé
        if(res.meta.status == 201) {
            $scope.expendable.id = res.data.newId;
        }

        if($scope.expendable.pic && $scope.expendable.pic instanceof File){

            var url = __ENV.apiUrl + "/expendables/"+$scope.expendable.id+"/image";
            var fd = new FormData();
            fd.append('updatePic', $scope.expendable.pic);
            $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(r){
                $scope.expendable.picture = r.data
                $uibModalInstance.close({changedExpendable:$scope.expendable, type:$scope.type});
            })
            .error(function(r){
                alert("Erreur lors de la sauvegarde de l'image");
            });
        }else {
            $uibModalInstance.close({changedExpendable:$scope.expendable, type:$scope.type});
        }

    }

    var gererErreur = function(error) {
        if(error.status == 422) {
            $scope.inputErrors = error.data.data;
        }
        else if(error.status == 409) {
            $scope.messageError = "Un consommable avec le même nom existe déjà";
        }

    }
});
