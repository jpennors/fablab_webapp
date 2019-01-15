//Controller de la fenêtre. Il doit prend en paramètre tous les élèments du "resolve".
app.controller("syncUserCtrl", function($scope, $uibModalInstance, scopeParent, Users){
    
    $scope.users = [];
    $scope.removedUsers = [];
    $scope.waiting = true;
    $scope.roles = scopeParent.roles;

    $scope.getRoleFromId = function(id) {
        var r = null;
        $scope.roles.forEach(function (role) {
            if (role.id == id) {
                r = role;
            }
        });
        return r;
    };

    $scope.roleChanged = function (user) {
        if (user.role_id == null) {
            user.action = 'delete';
        } else if(user.action != 'add') {
            user.action = 'edit';
        }
    };

    Users.getSync({}, function (data) {
        $scope.users = data.data.users;
        $scope.waiting = false;
    }, function(error) {
       ErrorHandler.alert(error);
    });

    /**
     *  Ferme la vue modal
     */
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.remove = function (user) {
        var index = $scope.users.indexOf(user);
        $scope.users.splice(index, 1);
        $scope.removedUsers.push(user);
    }

    $scope.unremove = function (user) {
        var index = $scope.removedUsers.indexOf(user);
        $scope.removedUsers.splice(index, 1);
        $scope.users.push(user);
    }

    /**
     *  Enregistre les modifications
     */
    $scope.save = function () {
        $scope.errors = false;
        $scope.saving = true;

        Users.saveSync({}, $scope.users, function (data) {
            $scope.saving = false;
            scopeParent.refreshUsers();
            $uibModalInstance.dismiss('cancel');
        }, function (error) {
            $scope.errors = ErrorHandler.parse(error);
            $scope.saving = false;
        });
    };
})