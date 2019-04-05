app.controller('enginePartsEditCtrl', function($scope, $window, object, type, $uibModalInstance, $http, Engines, ErrorHandler, Rooms, EngineParts) {
    $scope.enginepart = object;
    $scope.type = type;
    $scope.previewSrc = null;
    $scope.errors = null;
    // Pas de photo pour les pièces de machines pour le moment
    // if($scope.engineparts.picture) {
    //     $scope.previewSrc = __ENV.apiUrl + "/engines/image/" + $scope.enginepart.picture;
    // }


    Engines.get({}, function(res){
        $scope.engines = res.data;
        $scope.enginepart.engine = res.data.filter((e)=>e.id == $scope.enginepart.engine_id)[0];

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

    $scope.delete = function() {
        $uibModalInstance.close({id:$scope.enginepart.id, type:"delete"});
    }

    // $scope.$watch("enginepart.pic", function(newV, oldV) {
    //     if(newV !== oldV && newV instanceof File) {
    //         $scope.previewSrc = $window.URL.createObjectURL(newV);
    //     }
    // });

    // function updatePreview() {
    //     // Si on a pas de chemin vers l'image, et si on a une image dans l'input
    //     if($scope.enginepart.pic instanceof File && !$scope.enginepart.picture) {
    //         $scope.previewSrc = $window.URL.createObjectURL($scope.enginepart.pic);
    //     }
    // }


    // $scope.iconColor = function() {
    //     var color;
    //     switch ($scope.enginepart.status) {
    //         case "Disponible":
    //             color = '#c2db9b';
    //             break;
    //         case "En reparation":
    //             color = '#f3997b';
    //             break;
    //         case "En utilisation":
    //             color = '#ffdb93';
    //             break;
    //         case "En maintenance":
    //             color = '#f3997b';
    //             break;
    //         default:
    //             color = '#c2db9b';
    //     }
    //     return {'background-color':color};
    // }

    $scope.save = function() {
        $scope.messageError = null;
        $scope.inputErrors = null;
        $scope.enginepart.engine_id = $scope.enginepart.engine.id;
        // $scope.enginepart.roomName = $scope.enginepart.room.name;
        // $scope.enginepart.roomDescription = $scope.enginepart.room.description;
        if ($scope.type=='edit') {
            EngineParts.update({id:$scope.enginepart.id}, $scope.enginepart, envoyerImage, gererErreur);
        }else if($scope.type=='create') {
            EngineParts.save({}, $scope.enginepart, envoyerImage, gererErreur);
        }
    }

    var envoyerImage = function(res) {
        // Si on viens de créer une machine, on récupère l'id de l'objet créé
        if(res.meta.status == 201) {
            $scope.enginepart.id = res.data.newId;
        }

        if($scope.enginepart.pic && $scope.enginepart.pic instanceof File){

            var url = __ENV.apiUrl + "/engines/"+$scope.enginepart.id+"/image";
            var fd = new FormData();
            fd.append('updatePic', $scope.enginepart.pic);
            $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(r){
                $scope.enginepart.picture = r.data
                $uibModalInstance.close({changedEnginePart:$scope.enginepart, type:$scope.type});
            })
            .error(function(r){
                ErrorHandler.alert("Erreur lors de la sauvegarde de l'image");
            });
        }else {
            $uibModalInstance.close({changedEnginePart:$scope.enginepart, type:$scope.type});
        }

    }

    var gererErreur = function(error) {
        if(error.status == 422) {
            $scope.inputErrors = error.data.data;
        }
        else if(error.status == 409) {
            $scope.messageError = "Une machine avec le même nom existe déjà";
        }

    }
});
