var __ENV = window.__env;

var app = angular.module("fablabApp", ["ngRoute", "ngResource", "ngCookies", "ngAnimate", "ngTouch", "ngSanitize", "ui.bootstrap", "ui.codemirror", "angularMoment"])
                  .constant('__ENV', __ENV);


app.run(function($rootScope, UTCAuth) {

    $rootScope.auth = UTCAuth;

});

 app.config(function($routeProvider) {
     $routeProvider
     .when("/", {
         templateUrl : "app/components/dashboard/main.html"
     })
     .when("/login", {
         templateUrl : "app/components/login/login.html"
     })
     .when("/logout", {
         templateUrl : "app/components/logout/logout.html"
     })
     .when("/error/:code", {
         templateUrl : "app/components/errors/error.html"
     })

     .when("/account", {
         templateUrl : "app/components/account/account_index.html"
     })

     .when("/users", {
         templateUrl : "app/components/users/users_index.html"
     })
     .when("/users/create", {
         templateUrl : "app/components/users/users_create.html"
     })
     .when("/users/:id", {
         templateUrl : "app/components/users/users_show.html"
     })
     .when("/users/:id/edit", {
         templateUrl : "app/components/users/users_edit.html"
     })

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


     .when("/payments/:purchaseid", {
         templateUrl : "app/components/payments/payment_index.html"
     })

     .when("/search", {
       templateUrl : "app/components/search/search_index.html"
     })

     .when("/engines", {
       templateUrl : "app/components/engines/engines_index.html"
     })
     .when("/engines/create", {
       templateUrl : "app/components/engines/engines_create.html"
     })
     .when("/engines/:id/edit", {
         templateUrl : "app/components/engines/engines_edit.html"
     })

     .when("/expendables", {
       templateUrl : "app/components/expendables/expendables_index.html"
     })
     .when("/expendables/:id/edit", {
       templateUrl : "app/components/expendables/expendables_edit.html"
     })

     .when("/tools", {
       templateUrl : "app/components/tools/tools_index.html"
     })
     .when("/tools/create", {
       templateUrl : "app/components/tools/tools_create.html"
     })
     .when("/tools/:id/edit", {
         templateUrl : "app/components/tools/tools_edit.html"
     })

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
     .when("/help", {
         templateUrl : "app/components/help_page/help_index.html"
     })
     .when("/data", {
        templateUrl : "app/components/data/data.html"
     })
     .when("/payment/confirmation/:id", {
        templateUrl : "app/components/payments/confirmation/payment_confirmation.html"
     })
     .otherwise({redirectTo : "/error/404"});
 });

app.run( function($rootScope, $location) {

  $rootScope.$on("$routeChangeStart", function(event, next, current) {

    if ( !$rootScope.auth.auth ) { 

      if ( next.templateUrl != "app/components/login/login.html"       
          && next.templateUrl != "app/components/errors/error.html") {  
        $location.path("/login");
      }

    }
    else if ( next.templateUrl == "app/components/login/login.html" ) { 
      $location.path( "/" );
    }

  });

});

app.config(['$httpProvider', function($httpProvider) {

  $httpProvider.interceptors.push(function($q, $rootScope, $location) {
    return {

              'request': function(config) { 

        if ($rootScope.auth.auth) { 

          config.headers['Authorization-fablab'] = $rootScope.auth.token;

        }

        return config;
      },
      'responseError': function (response) {  

        if (response.status == 401) { 

          $rootScope.auth.clear();

          $location.path("/login");

          return true;

        }
        else if(response.status == 401 && $location.path() == "/login") { 

            $location.path("/error/401"); 

        }

        return $q.reject(response);
      }
    };
  });

}]);
