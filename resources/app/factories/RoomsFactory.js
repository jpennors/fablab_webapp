/**
 *  Factory liée à la ressource Rooms
 */
app.factory('Rooms', function($resource){
  return $resource(__ENV.apiUrl + "/rooms/:id", {}, {
        'update': { method:'PUT' }
    });
});
