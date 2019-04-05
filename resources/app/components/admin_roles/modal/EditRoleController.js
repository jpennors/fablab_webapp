app.controller("editRoleCtrl", function($scope, $uibModalInstance, role, type, Roles, ErrorHandler, Permissions, UTCAuth) {

    /**
     *  Initialisation de la vue
     */
    $scope.errors  = false;
    $scope.loading = true;
    $scope.saving  = false;
    $scope.type = type
    $scope.role = role;
    

    var mapPermissions = function(role) {
        var permissions = [];
        role.permissions.forEach(function (permission) {
            if (permission.selected === true) {
                permissions.push(permission.id);
            }
        });

        return permissions;
    };

    var hasPermission = function(role, permission) {
        var res = false;
        role.permissions.forEach(function (userPerm) {
            if (userPerm.slug == permission) {
                res = true
            }
        });
        return res;
    };

    // Permissions avec les affectations pour le rôle
    // En création les permission sont toutes décochées
    var getPermissions = function() {
        Permissions.get({}, function (permissions) {
            permissions.data.forEach(function (permission) {
                if ($scope.type == 'create'){
                    $scope.role = {}
                }
                permissions.data.forEach(function (permission) {
                    if ($scope.type == 'edit'){
                        permission.selected = hasPermission($scope.role, permission.slug);
                        permission.changed  = false;
                    }
                    permission.toggleSelected = function() {
                        permission.selected = !permission.selected;
                        permission.changed  = !permission.changed;
                    };
                });
                

            });
            $scope.role.permissions = permissions.data;
            $scope.loading = false
        }, function(error) {
            ErrorHandler.alert(error);
        });
    }

    //Get the role with id to get the permission attribute
    if ($scope.type == "edit"){
        Roles.get({'id' : role.id}, function(data) {
            $scope.role = data.data;
            getPermissions()
        }, function(error) {
            ErrorHandler.alert(error);
        });
    } else if ($scope.type == "create"){
        getPermissions()
    }

    /**
     *  Enregistre les modifications
     */
    $scope.save = function() {
        $scope.errors   = false;
        $scope.saving   = true;

        var role = Object.assign({}, $scope.role);
        role.permissions = mapPermissions($scope.role);

        if ($scope.type == "create"){
            Roles.save({}, role, function (data) {
                $uibModalInstance.close();
                $scope.saving = false;
            }, function (error) {
                $scope.errors = ErrorHandler.parse(error);
                $scope.saving = false;
            });
        } else if ($scope.type == "edit") {
            Roles.update({id : $scope.role.id}, role, function (data) {
                UTCAuth.refreshPermissions().then(function () {
                    $uibModalInstance.close();
                    $scope.saving = false;
                });
            }, function (error) {
                $scope.errors = ErrorHandler.parse(error);
                $scope.saving = false;
            });
        }  
    };

    /**
     *  Ferme la vue modal
     */
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    /**
     *  Supprime le rôle
     */
    $scope.deleteModal = function() {

        // On vérifie que le rôle membre CAS n'est pas en train d'être supprimé

        if ($scope.role.name == "Membre CAS") {
            var error = {}          
            error.message = "Erreur 403 : Impossible de supprimer le rôle Membre CAS"
            ErrorHandler.alert(error)

        } else {

            Roles.delete({id: $scope.role.id}, function(data) {
                $uibModalInstance.close();
            }, function (error) {
                ErrorHandler.alert(error);
            });

        }

    };

})
