/**
 *  Factory liée à la ressource Products
 */
app.factory('Products', function($resource){
  return $resource(__ENV.apiUrl + "/products/:id", {}, {
        'update': { method:'PUT' }
    });
});
