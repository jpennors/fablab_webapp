app.controller('toolsEditCtrl', function($scope, object, type, $uibModalInstance, ErrorHandler, $http, Tools, $window, Rooms, Wardrobes, $filter, moment) {
    $scope.tool = object;

    //Gestion des dates
    var expiryDate = $scope.tool.expiryDate
    var dateOfPurchase = $scope.tool.dateOfPurchase
    $scope.tool.expiryDate = new Date(moment(expiryDate).get('year'), moment(expiryDate).get('month'), moment(expiryDate).get('date'))
    $scope.tool.dateOfPurchase = new Date(moment(dateOfPurchase).get('year'), moment(dateOfPurchase).get('month'), moment(dateOfPurchase).get('date'))
    $scope.currentDate = new Date();

    $scope.type = type;
    $scope.previewSrc = null;
    $scope.errors = null;
    if($scope.tool.picture) {
        $scope.previewSrc = __ENV.apiUrl + "/tools/image/" + $scope.tool.id;
    }
    Rooms.get({}, function(res){
        $scope.rooms = res.data;
        $scope.selectedRoom = res.data.filter((r)=>r.id == $scope.tool.room_id)[0];
    }, function(error){
        ErrorHandler.alert(error);
    });

    Wardrobes.get({}, function(res){
        $scope.wardrobes = res.data;
        $scope.selectedWardrobe = res.data.filter((r)=>r.id == $scope.tool.wardrobe_id)[0];
    }, function(error){
        ErrorHandler.alert(error);
    });

    $scope.$watch("type", () => {
        $scope.show = $scope.type == 'show' || $scope.type == 'view';
        $scope.edit = $scope.type == 'edit' || $scope.type == 'create';
        $scope.canDelete = $scope.type == 'view' || $scope.type == 'edit';
        $scope.canChange = $scope.type == 'view';
    })

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    }


    $scope.delete = function() {
        $uibModalInstance.close({id:$scope.tool.id, type:"delete"});
    }

    $scope.$watch("tool.pic", function(newV, oldV) {
        if(newV !== oldV && newV instanceof File) {
            $scope.previewSrc = $window.URL.createObjectURL(newV);
        }
    });

    function updatePreview() {
        // Si on a pas de chemin vers l'image, et si on a une image dans l'input
        if($scope.tool.pic instanceof File && !$scope.tool.picture) {
            $scope.previewSrc = $window.URL.createObjectURL($scope.tool.pic);
        }
    }

    $scope.save = function() {
        $scope.messageError = null;
        $scope.inputErrors = null;
        $scope.tool.room_id = null
        $scope.tool.wardrobe_id = null
        if($scope.selectedRoom) {
            $scope.tool.room_id = $scope.selectedRoom.id;
            $scope.tool.roomName = $scope.selectedRoom.name;

            if($scope.selectedWardrobe) {
                $scope.tool.wardrobeName = $scope.selectedWardrobe.name;
                //Le nom a été mis à jour grâce à ng-model mais pas l'id, on va donc le rechercher dans les wardrobes
                for (var i = $scope.wardrobes.length - 1; i >= 0; i--) {
                    if ($scope.wardrobes[i].name == $scope.selectedWardrobe.name && $scope.wardrobes[i].room_id == $scope.tool.room_id){
                        $scope.tool.wardrobe_id = $scope.wardrobes[i].id
                        break
                    }
                }
            }
        } 

        if($scope.tool.type=='chemical'){
            $scope.tool.dateOfPurchase = $filter('date')($scope.tool.dateOfPurchase, "yyyy-MM-dd");
            $scope.tool.expiryDate = $filter('date')($scope.tool.expiryDate, "yyyy-MM-dd");
        }
        if ($scope.type=='edit') {
            Tools.update({id:$scope.tool.id}, $scope.tool, envoyerImage, gererErreur);
        }else if($scope.type=='create') {
            Tools.save({}, $scope.tool, envoyerImage, gererErreur);
        }
    }

    var envoyerImage = function(res) {
        // Si on viens de créer un consommable, on récupère l'id de l'objet créé
        if(res.meta.status == 201) {
            $scope.tool.id = res.data.newId;
        }

        if($scope.tool.pic && $scope.tool.pic instanceof File){

            var url = __ENV.apiUrl + "/tools/"+$scope.tool.id+"/image";
            var fd = new FormData();
            fd.append('updatePic', $scope.tool.pic);
            $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(r){
                $scope.tool.picture = r.data
                $uibModalInstance.close({changedTool:$scope.tool, type:$scope.type});
            })
            .error(function(r){
                ErrorHandler.alert("Erreur lors de la sauvegarde de l'image");
            });
        }else {
            $uibModalInstance.close({changedTool:$scope.tool, type:$scope.type});
        }

    }

    var gererErreur = function(error) {
        if(error.status == 422) {
            $scope.inputErrors = error.data.data;
        }
        else if(error.status == 409) {
            $scope.messageError = "Un outil avec le même nom existe déjà";
        }

    }
});
