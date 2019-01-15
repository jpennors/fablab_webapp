app.controller('logoutCtrl', function($location, $rootScope) {

  if($rootScope.auth) { // Si l'on est bien authentifié

    // On redirige vers le processus de logout grâce à la factory
    $rootScope.auth.goLogout();

  }
  else {

    // Sinon, on redirige vers login
    $location.path("/login");

  }

});
