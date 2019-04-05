app.controller('purchasesEditCtrl', function($rootScope, $location, $window, $scope, $http, $routeParams, $location, $uibModal, ErrorHandler, PurchasedElements, Purchases, Entities, UTCAuth, Mail) {

    if (!$rootScope.can('order-CAS-member')) {
        $location.path('/error/404')
    } else {

        $scope.loading = true;

        // INITIALISATION

        /**
        *  Initialisation de la page
        */
        $scope.purchase       = {};
        $scope.loadingPDF     = false;
        $scope.saving         = false;
        $scope.errors         = false;
        $scope.entities       = [];


        /**
        *  Récupération de la commande
        */
        Purchases.get({ id : $routeParams.id }, function(res) {
            $scope.purchase = res.data;

            // Récupération des infos du l'uilisateur lié à la commande
            $http({
                method : 'GET',
                url : __ENV.apiUrl + '/users/ginger/' + res.data.login
            }).then(function(res){
                var data = {
                    "login" : res.data.data.login,
                    "firstName" : res.data.data.prenom,
                    "lastName" : res.data.data.nom,
                    "email" : res.data.data.mail,
                    "status" : res.data.data.type,
                    "isCotisant" : res.data.data.is_cotisant
                };
                $scope.purchase.user = data;

                $scope.loading = false;

            });
            $scope.membreCAS = $rootScope.isExtern()

            // Url de paiement
            $scope.payurl = "https://cas.utc.fr/cas/login?service=" + encodeURIComponent(__ENV.webappUrl + '/#/payments/' + $scope.purchase.id);

            /**
            * Load entities data
            */
            Entities.get({}, function (res) {
                $scope.entities = res.data;
                $scope.entities.forEach(function (entity) {
                    if($scope.purchase.entity) {
                        if (entity.id === $scope.purchase.entity.id) {
                            entity.selected = true;
                        }
                    }
                })
            });
            updateElements();
        }, function(error) {
            ErrorHandler.alert(error);
        });


        /**
        *  Mise en forme des éléments par version
        */
        function updateElements(){

            /* Mise en forme des éléments selon les id*/
            var res = [];
            $scope.purchase.elements.forEach(function(elem){
                var trouve = false;
                res.forEach(function(existant) {
                    if(existant.id == elem.id){
                        existant.elements.push(elem);
                        trouve = true;
                    }
                })
                if(!trouve){
                    res.push({
                        id:elem.id,
                        elements:[elem]
                    })
                }
            })
        }


        // Partie : CLIENT


        /**
        *  Télécharge la facture PDF d'une Purchase
        */
        $scope.getInvoicePDF = function(purchase) {
            $scope.loadingPDF = true;

            Purchases.pdf({'id' : purchase.id}, function(data){
                saveAs(data.pdf, 'Facture_Fablab_' + purchase.number + '.pdf');
                $scope.loadingPDF = false;
            }, function(error){
                ErrorHandler.alert(error);
                $scope.loadingPDF = false;
            });

        };

        /**
        *  Télécharge le devis PDF d'une Purchase
        */
        $scope.getQuotePDF = function(purchase) {
            $scope.loadingQuote = true;

            Purchases.quote({'id' : purchase.id}, function(data){
                saveAs(data.pdf, 'Devis_Fablab_' + purchase.number + '.pdf');
                $scope.loadingQuote = false;
            }, function(error){
                ErrorHandler.alert(error);
                $scope.loadingQuote = false;
            });

        };

        /**
        * Disociate address and purshase
        */
        $scope.removeAddress = function () {
            Purchases.removeAddress({'id' : $scope.purchase.id}, null, function(res){
                $scope.purchase.address = null;
            }, function(error){
                $scope.errors = ErrorHandler.parse(error);
            });
        };

        /**
        *  Charge les données d'adresse dans modal
        */
        $scope.loadModalAddress = function() {

            //Préparation des paramètres de la fenêtre
            var dialogOpts = {
                backdrop: true,
                keyboard: true,

                // Url du template HTML
                templateUrl: 'app/components/purchases/edition/modal_address.html',

                //Controller de la fenêtre. Il doit prend en paramètre tous les élèments du "resolve".
                controller: function($scope, $uibModalInstance, scopeParent, Purchases) {
                    /**
                    *  Initialisation de la vue
                    */
                    $scope.errors  = false;
                    $scope.saving  = false;

                    if(scopeParent.purchase.address)
                    $scope.address = scopeParent.purchase.address;
                    else
                    $scope.address = {};

                    $scope.selectedAddress = function (address) {
                        $scope.address = address;
                    }
                    /**
                    *  Enregistre les modifications
                    */
                    $scope.save = function() {
                        $scope.errors  = false;
                        $scope.saving = true;

                        Purchases.address({'id' : scopeParent.purchase.id}, $scope.address, function(res){
                            scopeParent.purchase.address = $scope.address;
                            $uibModalInstance.close();
                        }, function(error){
                            $scope.errors = ErrorHandler.parse(error);
                        });

                        $scope.saving = false;

                    };

                    /**
                    *  Ferme la vue modal
                    */
                    $scope.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                    };

                },
                resolve: {
                    //On passe à la fenêtre modal une référence vers le scope parent.
                    scopeParent: function() {
                        return $scope;
                    }
                }
            };

            //Ouverture de la fenêtre
            $uibModal.open(dialogOpts);
        };


        // Partie : ENTITES

        /**
        *  Charge les données d'adresse dans modal
        */
        $scope.loadModalEntity = function() {

            //Préparation des paramètres de la fenêtre
            var dialogOpts = {
                backdrop: true,
                keyboard: true,

                // Url du template HTML
                templateUrl: 'app/components/purchases/edition/modal_entity.html',

                //Controller de la fenêtre. Il doit prend en paramètre tous les élèments du "resolve".
                controller: function($scope, $uibModalInstance, scopeParent, Purchases) {
                    /**
                    *  Initialisation de la vue
                    */
                    $scope.errors  = false;
                    $scope.saving  = false;
                    $scope.entities = scopeParent.entities;


                    $scope.selectedEntity = function (entity) {
                        scopeParent.purchase.entity = entity;
                        $scope.entities.forEach(function (entity) {
                            entity.selected = false;
                        });
                        entity.selected = true;
                    }
                    /**
                    *  Enregistre les modifications
                    */
                    $scope.save = function() {
                        $scope.errors  = false;
                        $scope.saving = true;

                        Purchases.entity({'id' : scopeParent.purchase.id}, { 'entity_id' : scopeParent.purchase.entity.id }, function(res){
                            $uibModalInstance.close();
                        }, function(error){
                            $scope.errors = ErrorHandler.parse(error);
                        });

                        $scope.saving = false;

                    };

                    /**
                    *  Ferme la vue modal
                    */
                    $scope.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                    };

                },
                resolve: {
                    //On passe à la fenêtre modal une référence vers le scope parent.
                    scopeParent: function() {
                        return $scope;
                    }
                }
            };

            //Ouverture de la fenêtre
            $uibModal.open(dialogOpts);
        };


        // Partie : PAIEMENT

        /**
        *  Met le paiement externalPaid à true
        */
        $scope.externalPaid = function() {

            var newPurchase = angular.copy($scope.purchase);
            newPurchase.paid = true;
            newPurchase.externalPaid = true;

            Purchases.externalPaid({ id : $scope.purchase.id }, newPurchase, function(data){
                // Rechargement des données
                Purchases.get({ id : $scope.purchase.id }, function(data){
                    $scope.purchase = data.data;
                    $scope.externalPaidSaving = true;
                }, function(error){
                    $scope.externalPaidSaving = false;
                    ErrorHandler.alert(error);
                });

            }, function(error){
                $scope.externalPaidSaving = false;
                ErrorHandler.alert(error);
            });

        };

        $scope.payCard = function(){

            $scope.loading = true;

            $http({
                method : 'POST', 
                url : __ENV.apiUrl + "/payutc/card/" + $scope.purchase.id,
                data : { return_url : __ENV.webappUrl + "/#/payment/confirmation/" + $scope.purchase.id}
            }).then(function(data){

                $window.location.href = data.data.data
            }, function(error){
                ErrorHandler.alert(error.data.meta)
                
                if (error.data.meta.status == 498) {
                    UTCAuth.clear()
                    $location.path('/login')
                }

                $scope.loading = false;
            });

        }

        
        // Partie : SERVICES ET PRODUITS

        /**
        *   Fonction pour annuler une commande
        *
        */
        $scope.cancelPurchase = function(){
            for (var i = $scope.purchase.lastVersionElements.length - 1; i >= 0; i--) {
                if ($scope.purchase.lastVersionElements[0].login_edit == $rootScope.auth.member.login){
                    $scope.purchase.lastVersionElements[i].status = 4
                } else {
                    $scope.purchase.lastVersionElements[i].status = 5
                }
                $scope.purchase.lastVersionElements[i].purchasable_id = $scope.purchase.lastVersionElements[i].purchasable.id
                $scope.purchase.lastVersionElements[i].version = $scope.purchase.lastVersionElements[i].version+1

                PurchasedElements.updateElement($scope.purchase.lastVersionElements[i], function(res){
                    var pe = res.data
                    if ($scope.membreCAS)
                        Mail.annulation_client($scope.purchase.user.email, pe.purchasable, $scope.purchase.number)
                    else 
                        Mail.annulation_fablab($scope.purchase.user.email, pe.purchasable, $scope.purchase.number)
                   
                    Purchases.get({ id : $routeParams.id }, function(res) {
                        $scope.purchase = res.data;
                        updateElements()
                    })
                }) 
            }
        }

        /**
        *   Ouverture de la modale d'un service
        *
        */
        $scope.open = function(element, type) {
            if (element.purchasable_type == "App\\Service")
            {
                var i = 0;
                    if($scope.purchase.lastVersionElements.length>0)
                    while(i < $scope.purchase.lastVersionElements.length){
                        if($scope.purchase.lastVersionElements[i].id==element.id){
                            selected = $scope.purchase.lastVersionElements[i];
                            break;
                        }
                        i++;
                    }
        
                    //On constuit un objet avec l'id qui aura toutes les versions
                    var tabElements = $scope.purchase.elements.filter((e)=>e.id==selected.id)
                    var modalInstance = $uibModal.open({
                        backdrop: true,
                        keyboard: true,
                        size:'lg',
                        templateUrl: 'app/components/purchases/modalServices/configure_service.html',
        
                        resolve:{
                            object: function() {
                                return angular.copy(tabElements);
                            },
                            type: function() {
                                return type;
                            },
                            email: function(){
                                return $scope.purchase.user.email
                            },
                            num_commande: function(){
                                return $scope.purchase.number
                            }
                        },
                        controller: 'configureServiceCtrl'
                    });
        
                    // On modifie dans la liste de consommables l'objet qui vient d'être édité
                    modalInstance.result.then(function(res) {

                        $scope.loading = true;
        
                        Purchases.get({ id : $routeParams.id }, function(res) {
                            $scope.purchase = res.data;
                            updateElements();
                        });

                        $scope.loading = false;
        
                    });
                }
        }


        /**
        *   Attribution des icônes de couleur en fonction du status de l'élément
        *
        */
        $scope.iconColor = function(element) {
            var color;
            switch (element.status) {
                case 4:
                color = '#f3997b'
                break
                case 3:
                color = '#c2db9b';
                break;
                case 2:
                color = '#ffdb93';
                break;
                case 1:
                color = '#ffdb93';
                break;
                case 0:
                color = '#f3997b';
                break;
                default:
                color = '#ffdb93';
            }
            return {'background-color':color};
        };

    }
});
