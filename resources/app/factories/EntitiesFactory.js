/**
 *  Factory liée à la ressource Adresses
 */
var transform = function(data) {
    if (data === undefined)
        return data;

    var fd = new FormData();
    angular.forEach(data, function(value, key) {
        if (value != null) { // @see : https://github.com/laravel/framework/issues/13457#issuecomment-340156084
            fd.append(key, value);
        }
    });

    return fd;
};
app.factory('Entities', function($resource){
    return $resource(__ENV.apiUrl + "/entities/:id", {}, {
        'save': {
            method:'POST',
            transformRequest: transform,
            headers: {
                'Content-Type': undefined
            }
        },
        'update': {
            method:'POST',
            transformRequest: function (data) {
                var fd = transform(data);
                // @see https://github.com/laravel/framework/issues/13457
                fd.append('_method', 'PUT');
                return fd;
            },
            headers: {
                'Content-Type': undefined
            }
        }
    });
});
