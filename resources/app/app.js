/**
 *  Configuration de l'environnement
 */
var __ENV = window.__env;

/**
 * Enable console log when debug is true only




/**
 *  Déclaration de l'application Angular
 */
var app = angular.module("fablabApp", ["ngRoute", "ngResource", "ngCookies", "ngAnimate", "ngTouch", "ngSanitize", "ui.bootstrap", "ui.codemirror", "angularMoment"])
                  .constant('__ENV', __ENV);


/**
 *  Initialisation de variables au niveau du $rootScope
 */
app.run(function($rootScope, UTCAuth) {

    // On stocke la factory d'authentification dans cette variable de $rootScope
    // De cette façon, la factory peut être accessible n'importe où (services, controllers, ...)
    // à la condition d'injecter $rootScope
    $rootScope.auth = UTCAuth;

});

/**
 *  Configuration des routes
 */
 app.config(function($routeProvider) {
     $routeProvider
     // Home
     .when("/", {
         templateUrl : "app/components/dashboard/main.html"
     })
     // Page de login
     .when("/login", {
         templateUrl : "app/components/login/login.html"
     })
     // Page de logout
     .when("/logout", {
         templateUrl : "app/components/logout/logout.html"
     })
     // Page de gestion des erreurs
     .when("/error/:code", {
         templateUrl : "app/components/errors/error.html"
     })

     // Mon compte
     .when("/account", {
         templateUrl : "app/components/account/account_index.html"
     })

     // Users général
     .when("/users", {
         templateUrl : "app/components/users/users_index.html"
     })
     .when("/users/create", {
         templateUrl : "app/components/users/users_create.html"
     })
     // Users particulier
     .when("/users/:id", {
         templateUrl : "app/components/users/users_show.html"
     })
     .when("/users/:id/edit", {
         templateUrl : "app/components/users/users_edit.html"
     })

     // Purchases
     .when("/purchases", {
         templateUrl : "app/components/purchases/indexes/purchases_index.html"
     })
     .when("/mypurchases", {
         templateUrl : "app/components/purchases/indexes/purchase_myaccount.html"
     })
     .when("/purchases/success", {
         templateUrl : "app/components/purchases/creation/purchases_success.html"
     })
     .when("/purchases/create", {
         templateUrl : "app/components/purchases/creation/purchases_create.html"
     })
     .when("/purchases/:id/edit", {
         templateUrl : "app/components/purchases/edition/purchases_edit.html"
     })
     .when("/purchases/history", {
         templateUrl : "app/components/purchases/indexes/purchases_history.html"
     })


     // Paiements
     .when("/payments/:purchaseid", {
         templateUrl : "app/components/payments/payment_index.html"
     })

     // Recherche
     .when("/search", {
       templateUrl : "app/components/search/search_index.html"
     })

     // Machines
     .when("/engines", {
       templateUrl : "app/components/engines/engines_index.html"
     })
     .when("/engines/create", {
       templateUrl : "app/components/engines/engines_create.html"
     })
     .when("/engines/:id/edit", {
         templateUrl : "app/components/engines/engines_edit.html"
     })

     // Consommables
     .when("/expendables", {
       templateUrl : "app/components/expendables/expendables_index.html"
     })
     // .when("/expendables/create", {
     //   templateUrl : "app/components/expendables/expendables_create.html"
     // })
     .when("/expendables/:id/edit", {
       templateUrl : "app/components/expendables/expendables_edit.html"
     })

     // Outils
     .when("/tools", {
       templateUrl : "app/components/tools/tools_index.html"
     })
     .when("/tools/create", {
       templateUrl : "app/components/tools/tools_create.html"
     })
     .when("/tools/:id/edit", {
         templateUrl : "app/components/tools/tools_edit.html"
     })

     // Salles
     // .when("/rooms", {
     //     templateUrl : "app/components/rooms/rooms_index.html"
     // })

     // Admin
     .when("/admin/settings", {
         templateUrl : "app/components/admin_settings/settings_index.html"
     })
     .when("/admin/users", {
         templateUrl : "app/components/admin_users/users_index.html"
     })
     .when("/admin/roles", {
         templateUrl : "app/components/admin_roles/roles_index.html"
     })
     .when("/admin/scripts", {
         templateUrl : "app/components/admin_scripts/scripts_index.html"
     })
     .when("/admin/scripts/create", {
         templateUrl : "app/components/admin_scripts/scripts_create.html"
     })
     .when("/admin/scripts/:id/edit", {
         templateUrl : "app/components/admin_scripts/scripts_create.html"
     })
     .when("/admin/services", {
         templateUrl : "app/components/admin_services/services_index.html"
     })
     .when("/admin/services/create", {
         templateUrl : "app/components/admin_services/services_create.html"
     })
     .when("/products", {
         templateUrl : "app/components/products/products_index.html"
     })
     .when("/admin/addresses", {
         templateUrl : "app/components/admin_addresses/addresses_index.html"
     })
     .when("/admin/entities", {
         templateUrl : "app/components/admin_entities/entities_index.html"
     })
     .when("/admin/semesters", {
        templateUrl : "app/components/admin_semesters/semesters_index.html"
    })
     .when("/help", {
         templateUrl : "app/components/help_page/help_index.html"
     })
     .when("/data", {
        templateUrl : "app/components/data/data.html"
     })
     .when("/payment/confirmation/:id", {
        templateUrl : "app/components/payments/confirmation/payment_confirmation.html"
     })
     // Pièces de machine
    // .when("/engineparts", {
    //     templateUrl : "app/components/engine_parts/engine_parts_index.html"
    // })

     // Vers la page 404 dans les autres cas
     .otherwise({redirectTo : "/error/404"});
 });

 /**
  *  Logique lors des changements de route
  */
app.run( function($rootScope, $location) {

  // Listener qui surveille le moindre changement de route
  $rootScope.$on("$routeChangeStart", function(event, next, current) {

    if ( !$rootScope.auth.auth ) { // L'utilisateur n'est pas connecté, on le redirige vers /login

      if ( next.templateUrl != "app/components/login/login.html"       // S'il se dirige déjà vers login, on ne le redirige pas
          && next.templateUrl != "app/components/errors/error.html") {  // S'il se dirige vers une page d'erreur, on ne le redirige pas
        $location.path("/login");
      }

    }
    else if ( next.templateUrl == "app/components/login/login.html" ) { // S'il est déjà connecté, on l'empêche d'aller sur login, redirection vers /
      $location.path( "/" );
    }

  });

});

/**
 *  Ajout d'un interceptor (~middleware) pour gérer les requêtes/réponses vers/de l'API
 */
app.config(['$httpProvider', function($httpProvider) {

  $httpProvider.interceptors.push(function($q, $rootScope, $location) {
    return {
        
      'request': function(config) { // Pour les rêquetes

        if ($rootScope.auth.auth) { // On vérifie que l'utilisateur est authentifié grâce à la factory

          // S'il est authentifié, on ajoute le header Authorization avec son token
          config.headers['Authorization'] = 'Bearer ' + $rootScope.auth.token;

        }

        return config;
      },
      'responseError': function (response) {  // Pour les réponses, en cas d'erreur (status!=200)

        if (response.status == 401) { // On traite le cas où l'on est pas authentifié auprès de l'API

          // On reset la factory d'authentification
          $rootScope.auth.clear();

          // On redirige vers la page de login, car on a un problème d'authentification
          $location.path("/login");

          // On empêche de traiter l'erreur avec ErrorHandler
          return true;

        }
        else if(response.status == 401 && $location.path() == "/login") { // Le cas où on revient sur login après un login

            $location.path("/error/401"); // L'utilisateur s'est identifié mais n'est pas autorisé, on le met sur la page d'erreur

        }

        return $q.reject(response);
      }
    };
  });

}]);
