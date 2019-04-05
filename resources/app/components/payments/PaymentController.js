app.controller('paymentCtrl', function($scope, $timeout, $routeParams, $location, JCappuccinoFactory, ErrorHandler, Purchases, Payments, Alert, UTCAuth, $rootScope) {

    // Vérification de l'autorisation
    if (!$rootScope.can('pay-someone-payutc')) {
        $location.path('/error/404')
    } else {


      /**
       *  Informations sur la facture à payer
       */
        Purchases.get({ id : $routeParams.purchaseid }, function(res) {
            $scope.purchase = res.data;

            // Si la Purchase est déjà payée
            if($scope.purchase.paid) {
              $location.path("/purchases/" + $scope.purchase.id + "/edit")
            }

            // Récupération du ticket CAS pour le log auprès de Nemopay
            var ticketRegexp = /\?ticket=(.+)#/g;
            var match = ticketRegexp.exec($location.absUrl());
            $scope.ticket = match[1];
            $scope.service = __ENV.webappUrl + '/#/payments/' + $scope.purchase.id;

        }, function(error) {
            ErrorHandler.alert(error);
        });

      /**
       *  Initialisation de la page
       */

      // Badgeuse
      if(!$scope.badgeuse) $scope.badgeuse = {};
      
      JCappuccinoFactory.init();
      $scope.badgeuse.status = "Connexion à la badgeuse...";

      // Payutc
      $scope.payutc = {};
      $scope.payutc.status = "En attente du badge client";

      /*
       *  évènement: carte insérée, récupération de l'id du badge
       */
      JCappuccinoFactory.subscribe("cardInserted", function(badge_id) {

        // Si le paiement est déjà fait, on ne fait plus rien
        if($scope.payutc.ok) {
          Alert.open('Tentative de paiement', 'Le paiement a déjà été effectué.');
          return;
        }

        // L'id du badge envoyé par le WS
        $scope.$apply(function(){
          $scope.badge_id = badge_id;
          $scope.badgeuse.ok = true;
          $scope.badgeuse.status = "Carte lue";
          $scope.payutc.status = "Communication avec Payutc...";
        });

        // Initialisation du paiement
        Payments.payBadge(UTCAuth.token, badge_id, $scope.purchase.id)
        .then(function(data){

          // Succès
          $scope.purchase.paid = true;
          $scope.badgeuse.status = "Carte lue";
          $scope.payutc.status = "Paiement correctement effectué !";
          $scope.payutc.ok = true;

        }, function(error){


          if (error.data.meta.status == 498) {
            ErrorHandler.alert(error.data.meta)
            UTCAuth.clear()
            $location.path('/login')
          }

          // Échec
          $scope.purchase.paid = false;
          $scope.badgeuse.status = "Carte lue";
          $scope.payutc.status = "Échec lors du paiement. ";
          $scope.payutc.status += ErrorHandler.parse(error).message;
          $scope.payutc.ok = false;

        });

      });

      /*
       *  évènement: échec pour trouver la badgeuse
       */
      JCappuccinoFactory.subscribe("badgeuseNotFound", function(message) {

        $scope.$apply(function(){
          $scope.badgeuse.ok = false;
          $scope.badgeuse.status = "Impossible de trouver la badgeuse.";
        });
        // Tentative de reconnexion au bout de 2sec

        $timeout(JCappuccinoFactory.connect, 2000);
      });

      /*
       *  évènement: ouverture du ws avec JCappuccino
       */
      JCappuccinoFactory.subscribe("onopen", function(message) {
        $scope.$apply(function(){
          $scope.badgeuse.ok = true;
          $scope.badgeuse.status = "Connecté à la badgeuse. En attente.";
        });
      });

      /*
       *  évènement: perte du ws avec JCappuccino
       */
      JCappuccinoFactory.subscribe("onerror", function(message) {
        $scope.$apply(function(){
          $scope.badgeuse.ok = false;
          $scope.badgeuse.status = "Erreur de la badgeuse... En attente.";
        });
      });

      /*
       *  évènement: fermeture du ws avec JCappuccino
       */
      JCappuccinoFactory.subscribe("onclose", function(message) {
        $scope.$apply(function(){
          $scope.badgeuse.ok = false;
          $scope.badgeuse.status = "Perte de la badgeuse... En attente.";
        });
        // Tentative de reconnexion au bout de 2sec
        $timeout(JCappuccinoFactory.connect, 2000);
      });
    }

});
