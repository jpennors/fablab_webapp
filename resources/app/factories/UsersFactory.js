/**
 *  Factory liée à la ressource Users
 */
app.factory('Users', function($resource){
  return $resource(__ENV.apiUrl + "/users/:id", {}, {
        'update': { method:'PUT' },
        'self': { method:'GET', url : __ENV.apiUrl + "/client"},
        'selfPermissions': { method:'GET', url : __ENV.apiUrl + "/client/permissions"},
        'gingerSearch': { method: 'GET', url: __ENV.apiUrl + "/users/ginger/search", cache: true},
        'gingerLogin': { method: 'GET', url: __ENV.apiUrl + "/users/ginger/:login"},
        'getSync': { method: 'GET', url: __ENV.apiUrl + "/users/sync"},
        'saveSync': { method: 'POST', url: __ENV.apiUrl + "/users/sync"}
    });
});
