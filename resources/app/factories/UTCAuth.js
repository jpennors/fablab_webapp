/**
 *  Gère l'authentification auprès de l'API
 */
app.factory('UTCAuth', function($http, $window, $location, $cookies, $q, Users, Roles, $rootScope){

  var factory = {};
  that=factory;

  /**
   *  Authentifié ou non
   */
  factory.auth = false;

  /**
   *  Token
   */
  factory.token = null;

  /**
   *  Member
   */
  factory.member = {};

  /**
   *  Permissions
   */
  factory.permissions = null;

  /**
   *  Enregistre les variables auth et token dans un cookie
   */
  factory.saveCookie = function() {
      // Remove permissions, we don't need to save them into a cookie
      var member = that.member;
      if (member.role)
        member.role.permissions = null;
      $cookies.putObject('UTCAuth',
          {
            'auth' : that.auth,
            'token' : that.token,
            'member' : member,
          }
      );
  }

  /**
   *  Charge les variables auth et token depuis un cookie
   */
  factory.loadCookie = function() {
    if($cookies.getObject('UTCAuth')) {
      that.auth = $cookies.getObject('UTCAuth').auth;
      that.token = $cookies.getObject('UTCAuth').token;
      that.member = $cookies.getObject('UTCAuth').member;
    }
  }

  /**
  *   Remove cookies
  */
  factory.removeCookies = function(){
    $cookies.remove('UTCAuth');
  }

  /**
   *  Setter pour auth
   */
  factory.setAuth = function(auth) {
    that.auth = auth;
    that.saveCookie();
  }

  /**
   *  Setter pour token
   */
  factory.setToken = function(token){
    that.token = token;
    that.saveCookie();
  }

  /**
   *  Setter pour member
   */
  factory.setMember = function(member) {
    that.member = member;
    that.saveCookie();
  }

  /**
   *  Réinitialise auth et token
   */
  factory.clear = function() {
    that.setAuth(false);
    that.setToken('');
    that.setMember({});
    that.removeCookies();
  }

    /**
     * Setter pour permissions
     * @param permissions
     */
  factory.setPermissions = function(permissions) {
    that.permissions = permissions;
  }

    /**
     * Refresh permissions list from the server
     */
  factory.refreshPermissions = function () {

      var deferred = $q.defer();

      if (that.auth) {
          Users.selfPermissions({}).$promise
              .then(function (data) {
                  that.setPermissions(data.data);
                  deferred.resolve(data.data);
              }).catch(function (error) {
              deferred.reject(error);
          });
      } else {
          that.setPermissions([]);
          deferred.resolve([]);
      }

      return deferred.promise;
  };

  that.deferred = null;

  // TODO : avoir proprement le role de l'utilisateur
  $rootScope.isExtern = function() {
      return $rootScope.auth.member.role_id == 3;
  }

    /**
     * Détermine si l'user courant a la permission attr
     * @param attr
     */
  $rootScope.can = function(attr) {
      if (that.permissions == null) {
          if (that.deferred == null) {
              that.deferred = $q.defer();
              factory.refreshPermissions()
              .then(function () {
                  that.deferred.resolve(factory.hasPermission(attr));
              }, function (error) {
                  that.deferred.reject(error);
              });
          }

          return that.deferred.promise;
      } else {
          return factory.hasPermission(attr);
      }
  }

    /**
     * Détermine si permission est dans la liste des permission de UTCAuth
     * @param permission
     * @returns {boolean}
     */
  factory.hasPermission = function (permission) {
      // Super admin is god
      // A FAIRE : remmettre tous les droits au superadmin après dev
      // if (permission != 'super-admin' && this.hasPermission('super-admin')) {
      //     return true;
      // }

      var res = false;
      angular.forEach(that.permissions, function (perm) {
          if (perm.slug == permission) {
              res = true;
          }
      });
      return res;
  }

  /**
   *  Met à jour auth, token et member
   */
  factory.login = function(token) {
    that.setToken(token);
    that.setAuth(true);
    // Récupération des données du membre
    var deferred = $q.defer();

    Users.self({}).$promise
    .then(function(data){
        that.setMember(data.data);
        return that.refreshPermissions();
    }).then(function (data) {
        deferred.resolve(data);
    }).catch(function (error) {
        deferred.reject(error);
    });

    return deferred.promise;
  }

  /**
   *  Vide auth et token
   */
  factory.logout = function() {
    that.clear();
  }

  /**
   *  Redirige vers la page d'authentification CAS
   */
  factory.goLogin = function() {
    var webapp = encodeURIComponent(__ENV.webappUrl+'/#/login');
    /* TO DO : PROBLEM CORB !!!
    // $http.get(__ENV.apiUrl+'/login?webapp='+webapp).then(function(data){
    //   $window.location.href = data.url; // Vers le login CAS
    // })*/
    $window.location.href = "https:\/\/cas.utc.fr\/cas\/login?service="+__env.webappUrl+"%2Fapi%2Fv1%2Flogin%3Fwebapp%3D"+__env.webappUrl+"%252F%2523%252Flogin"
  }

  /**
   *  Redirige vers la page de logout CAS
   */
  factory.goLogout = function() {
    $http.get(__ENV.apiUrl+'/logout')
      .success(function(data){
        that.logout(); // On vide les infos auth et token de UTCAuth
        $window.location.href = data.url; // Vers le logout CAS
      }).error(function(error){
        // Gérer en cas d'erreur
      });
  }

  // Avant de retourner la factory, on récupère les informations dans le cookie,
  // s'il existe, sinon on le créé
  if($cookies.getObject('UTCAuth')) {
      factory.loadCookie();
      factory.refreshPermissions();
  } else {
      factory.saveCookie();
  }


  // Ajout dans la factory de la gestion du semester pouvant être utilisé pour
  // faire des requêtes sur des semestres autres que celui courant
  factory.semester_in_session = null;

  factory.setNewSemesterInSession = function(id){
    that.semester_in_session = id;
    $cookies.put('semester', id);
  }

  factory.isSemesterNull = function(){
    return that.semester_in_session === null;
  }

  factory.getSemesterInSession = function(){
    return that.semester_in_session;
  }

  factory.removeSemesterInSession = function(){
    that.semester_in_session = null;
    $cookies.remove('semester');
  }

  factory.loadSemesterInSession = function(){
    that.semester_in_session = $cookies.get('semester');
  }

  loadSemesterInSession();

  return factory;
});
