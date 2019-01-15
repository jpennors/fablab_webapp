app.controller('enginesEditCtrl', function($scope, $window, object, type, $uibModalInstance, $http, Engines, ErrorHandler, Rooms) {
    $scope.engine = object;
    $scope.type = type;
    $scope.previewSrc = null;
    $scope.errors = null;
    if($scope.engine.picture) {
        $scope.previewSrc = __ENV.apiUrl + "/engines/image/" + $scope.engine.id;
    }
    Rooms.get({}, function(res){
        $scope.rooms = res.data;
        $scope.engine.room = res.data.filter((r)=>r.id == $scope.engine.room_id)[0];
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
        $uibModalInstance.close({id:$scope.engine.id, type:"delete"});
    }

    $scope.$watch("engine.pic", function(newV, oldV) {
        if(newV !== oldV && newV instanceof File) {
            $scope.previewSrc = $window.URL.createObjectURL(newV);
        }
    });

    function updatePreview() {
        // Si on a pas de chemin vers l'image, et si on a une image dans l'input
        if($scope.engine.pic instanceof File && !$scope.engine.picture) {
            $scope.previewSrc = $window.URL.createObjectURL($scope.engine.pic);
        }
    }

    $scope.iconColor = function() {
        var color;
        switch ($scope.engine.status) {
            case "Disponible":
                color = '#c2db9b';
                break;
            case "En utilisation":
                color = '#ffdb93';
                break;
            case "En maintenance":
                color = '#f3997b';
                break;
            default:
                color = '#c2db9b';
        }
        return {'background-color':color};
    }

    $scope.save = function() {
        $scope.messageError = null;
        $scope.inputErrors = null;
        if ($scope.engine.room) {
            $scope.engine.room_id = $scope.engine.room.id;
        }
        
        // $scope.engine.roomName = $scope.engine.room.name;
        // $scope.engine.roomDescription = $scope.engine.room.description;
        if ($scope.type=='edit') {
            Engines.update({id:$scope.engine.id}, $scope.engine, envoyerImage, gererErreur);
        }else if($scope.type=='create') {
            Engines.save({}, $scope.engine, envoyerImage, gererErreur);
        }
    }

    var envoyerImage = function(res) {
        // Si on viens de créer une machine, on récupère l'id de l'objet créé
        if(res.meta.status == 201) {
            $scope.engine.id = res.data.newId;
        }

        if($scope.engine.pic && $scope.engine.pic instanceof File){

            var url = __ENV.apiUrl + "/engines/"+$scope.engine.id+"/image";
            var fd = new FormData();
            fd.append('updatePic', $scope.engine.pic);
            $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(r){
                $scope.engine.picture = r.data
                $uibModalInstance.close({changedEngine:$scope.engine, type:$scope.type});
            })
            .error(function(r){
                ErrorHandler.alert("Erreur lors de la sauvegarde de l'image");
            });
        }else {
            $uibModalInstance.close({changedEngine:$scope.engine, type:$scope.type});
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
