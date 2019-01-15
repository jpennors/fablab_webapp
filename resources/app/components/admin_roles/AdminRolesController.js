/*
 *  Gestion des utilisateurs: clients, permanenciers, admins
 */

app.controller('adminRolesCtrl', function($scope, $http, $log, $uibModal, ErrorHandler, Roles, Permissions, $rootScope, $location){
    
    //On vérifie que l'utilisateur a l'autorisation d'accéder à la page
    if(!$rootScope.can('list-role'))
      $location.path("/error/404");

    else{

        $scope.roles = [];
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

        /*
         *  Mise à jour des Roles
         */
        $scope.update = function() {
            // Chargement des Roles
            Roles.get({}, function(data){
                $scope.roles = data.data;
            }, function(error){
                ErrorHandler.alert(error);
            });
        };
        $scope.update();

        /*
         *  Ouverture de la vue modale pour l'édition
         */
        $scope.open = function(role, type) {
            //Préparation des paramètres de la fenêtre
            var modalInstance = $uibModal.open({
                backdrop: true,
                keyboard: true,
                // Url du template HTML
                templateUrl: 'app/components/admin_roles/modal/edit_role.html',
                resolve: {
                    //On passe à la fenêtre modal une référence vers le scope parent.
                    role: function() {
                        return role;
                    },
                    type: function(){
                        return type;
                    }
                },
                //Controller de la fenêtre. Il doit prend en paramètre tous les élèments du "resolve".
                controller: 'editRoleCtrl'
            });

            modalInstance.result.then(function() {
                $scope.update();
            })
        };
    }
});