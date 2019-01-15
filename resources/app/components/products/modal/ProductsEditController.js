app.controller('productsEditCtrl', function($scope, object, type, $uibModalInstance, $http, Elements, $window, ErrorHandler, Rooms, Wardrobes, Categories) {
    $scope.product = object;
    $scope.type = type;
    $scope.previewSrc = null;
    $scope.errors = null;
    if($scope.product.picture) {
        $scope.previewSrc = __ENV.apiUrl + "/products/image/" + $scope.product.id;
    }
    Categories.get({}, function(res){
        $scope.categories = res.data;
    }, function(error){
        ErrorHandler.alert(error);
    });

    Rooms.get({}, function(res){
        $scope.rooms = res.data;
        $scope.selectedRoom = res.data.filter((r)=>r.id == $scope.product.room_id)[0];
    }, function(error){
        ErrorHandler.alert(error);
    });

    Wardrobes.get({}, function(res){
        $scope.wardrobes = res.data;
        $scope.selectedWardrobe = res.data.filter((r)=>r.id == $scope.product.wardrobe_id)[0];
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

    /**************************************************/

    $scope.$watch("product.pic", function(newV, oldV) {
        if(newV !== oldV && newV instanceof File) {
            $scope.previewSrc = $window.URL.createObjectURL(newV);
        }
    });

    $scope.delete = function() {
        $uibModalInstance.close({id:$scope.product.id, type:"delete"});
    }

    function updatePreview() {
        // Si on a pas de chemin vers l'image, et si on a une image dans l'input
        if($scope.product.pic instanceof File && !$scope.product.picture) {
            $scope.previewSrc = $window.URL.createObjectURL($scope.product.pic);
        }
    }

    $scope.save = function() {
        $scope.messageError = null;
        $scope.inputErrors = null;
        $scope.product.wardrobe_id = null
        $scope.product.room_id = null
        if($scope.selectedRoom) {
            $scope.product.room_id = $scope.selectedRoom.id;
            $scope.product.roomName = $scope.selectedRoom.name;
            
            if($scope.selectedWardrobe) {
                $scope.product.wardrobeName = $scope.selectedWardrobe.name;
                //Le nom a été mis à jour grâce à ng-model mais pas l'id, on va donc le rechercher dans les wardrobes
                for (var i = $scope.wardrobes.length - 1; i >= 0; i--) {
                    if ($scope.wardrobes[i].name == $scope.selectedWardrobe.name && $scope.wardrobes[i].room_id == $scope.product.room_id){
                        $scope.product.wardrobe_id = $scope.wardrobes[i].id
                        break
                    }
                }
            }
        } 

        $scope.product.categorie_id = null
        if($scope.product.categorie){
            $scope.product.categorie_id = $scope.product.categorie.id;
            $scope.product.categorieName = $scope.product.categorie.name;
        }
        if ($scope.type=='edit') {
            Elements.productsResource.update({id : $scope.product.id}, $scope.product, envoyerImage, gererErreur);
            // Products.update({id:$scope.product.id}, $scope.product, envoyerImage, gererErreur);
        }else if($scope.type=='create') {
            Elements.productsResource.save({}, $scope.product, envoyerImage, gererErreur);
            // Products.save({}, $scope.product, envoyerImage, gererErreur);
        }
    }

    var envoyerImage = function(res) {
        // Si on viens de créer un consommable, on récupère l'id de l'objet créé
        if(res.meta.status == 201) {
            $scope.product.id = res.data.newId;
        }
        if($scope.product.pic && $scope.product.pic instanceof File){
            var url = __ENV.apiUrl + "/products/"+$scope.product.id+"/image";
            var fd = new FormData();
            fd.append('updatePic', $scope.product.pic);
            $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(r){
                $scope.product.picture = r.data
                $uibModalInstance.close({changedProduct:$scope.product, type:$scope.type});
            })
            .error(function(r){
                ErrorHandler.alert("Erreur lors de la sauvegarde de l'image");
            });
        }else {
            $uibModalInstance.close({changedProduct:$scope.product, type:$scope.type});
        }

    }
    var gererErreur = function(error) {
        if(error.status == 422) {
            $scope.inputErrors = error.data.data;
        }
        else if(error.status == 409) {
            $scope.messageError = "Un produit avec le même nom existe déjà";
        }

    }
});
