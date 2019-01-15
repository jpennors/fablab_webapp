/**
 *  Factory liée à la ressource Adresses
 */
app.factory('Addresses', function($resource){
    return $resource(__ENV.apiUrl + "/addresses/:id", {}, {
        'update': { method:'PUT' }
    });
});
