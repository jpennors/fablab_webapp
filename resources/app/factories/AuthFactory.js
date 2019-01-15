/**
 *  Factory pour ouvrir de simples modales
 */
app.factory('Auth', function(UTCAuth, Roles, $q){
    return {
        can: function(permission) {
            var res = false;

            angular.forEach(UTCAuth.permissions, function (perm) {
                if (perm.slug == permission) {
                    res = true;
                }
            });

            return res;
        }
    };
});
