/**
 *  Factory pour les Payments
 */
app.factory('Payments', function($http, $q){
  return {

    payBadge : function(token, badge_id, purchaseid) {

      var deferred = $q.defer();

      $http({
        method : 'POST',
        url : __ENV.apiUrl + "/payutc/badge/" + purchaseid,
        headers : {
          'Content-Type': 'application/json'
        },
        data : {
          token : token,
          badge_id : badge_id,
        }
      }).then(function(data){
        deferred.resolve(data);
      }, function(error){
        deferred.reject(error);
      });

      return deferred.promise;
    },
  }
});
