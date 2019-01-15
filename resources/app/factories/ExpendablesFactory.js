/**
*  Factory liée à la ressource Products
*/
app.factory('Expendables', function($resource){
    return $resource(__ENV.apiUrl + "/expendables/:id", null, {
        'save' : { method: 'POST' },
        'update': { method:'PUT' }
    });
});
