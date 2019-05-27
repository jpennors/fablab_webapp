app.controller('purchasesCreateCtrl', function($scope, $q, $location, $http, $rootScope, ErrorHandler, Mail, Users, Services, Products, Purchases, PurchasedElements, Entities, $uibModal) {

    if(!$rootScope.can('order-CAS-member')){
        $location.path("/error/404")
    } else {

        // INITIALISATION

        /**
        *  Initialisation de la purchase
        */
        $scope.purchase = {
            login : $rootScope.auth.user,
            products : [],
            services : [],
            association : ""
        };
        $scope.entities = [];
        $scope.purchase.price = "0.00 €"
        
        /**
        * Authentification
        */
        $scope.membreCAS = $rootScope.isExtern();
        // Si l'utilisateur est un membreCAS la commande est forcément à son nom 
        if($scope.membreCAS) {
            $scope.purchase.user = $rootScope.auth.member;
        }


        /**
        *  Chargements des produits
        */
        if(!$scope.membreCAS) {
            Products.get({},function(res){
                $scope.products = res.data;
            }, function(error) {
                ErrorHandler.alert(error);
                $scope.error = ErrorHandler.parse(error);
            }); 
        }


        /**
        *  Chargements des services
        */
        Services.get({},function(res){
            $scope.services = res.data;
        }, function(error) {
            ErrorHandler.alert(error);
            $scope.error = ErrorHandler.parse(error);
        });

        
        /**
        *  Chargements des entités
        */
        Entities.get({}, function(res) {
            $scope.entities = res.data;
            if ($scope.membreCAS){
                $scope.purchase.entity = res.data.filter((r)=>r.name == "Fablab UTC")[0];
            }
        }, function (error) {
            ErrorHandler.alert(error);
        });


        // ETAPE 1 : LOGIN

        /**
        *   Validation du login entré
        */
        $scope.setUserFromLogin = function() {
            $http({
                method : 'GET',
                url : __ENV.apiUrl + '/users/ginger/' + $scope.purchase.login
            }).then(function(res){
                if(res.data != null) {
                    $scope.error = null;
                    var data = {
                        "login" : res.data.login,
                        "firstName" : res.data.prenom,
                        "lastName" : res.data.nom,
                        "email" : res.data.mail,
                        "status" : res.data.type,
                        "isCotisant" : res.data.is_cotisant
                    };
                    $scope.purchase.user = data;
                }else {
                    $scope.error = "Login invalide";
                }
            }, function(error){
                $scope.error = "Login invalide ou expiré";
            });
        }


        /**
        * Suggestion login
        */
        $scope.autocomplete = function () {
            if ($scope.purchase.login.length >= 3) {
                Users.gingerSearch({'query': $scope.purchase.login}, function (data) {
                    $scope.suggestedUsers = data.data;
                });
            } else {
                $scope.suggestedUsers = [];
            }
        }

        $scope.selectUser = function(login){
            $scope.purchase.login = login;
            this.setUserFromLogin();
        }


        // ETAPE 2 : ENTITE

        /**
        *   Management des entités
        */
        $scope.selectEntity = function(entity){
            $scope.purchase.entity = entity;
        };


        // ETAPE 3 : SELECTION ITEMS

        /**
        *   Ajout d'un produit à la commande
        */
        $scope.addProduct = function(product) {
            product.remainingQuantity -= 1;
            var index = $scope.purchase.products.map((p) => { return p.id; }).indexOf(product.id);
            if(index == -1) {
                $scope.purchase.products.push({
                    id: product.id,
                    purchasable: product,
                    finalPrice: product.price,
                    suggestedPrice: product.price,
                    purchasable_type : "product",
                    purchasedQuantity: 1
                })
            }else {
                var a = $scope.purchase.products[index]
                a.purchasedQuantity += 1;
                a.finalPrice += a.purchasable.price;
            }
            $scope.priceCalculation()
        }

        /**
        *   Ajout d'un service, ouverture de la modale correspondante
        */
        $scope.openModalServices = function(service, type) {
            var modalInstance = $uibModal.open({
                backdrop: true,
                keyboard: true,
                size:'lg',
                templateUrl: 'app/components/purchases/modalServices/configure_service.html',

                resolve:{
                    object: function() {
                        return angular.copy(service);
                    },
                    type: function() {
                        return type
                    },
                    email: function(){
                        return $scope.purchase.user.email
                    },
                    num_commande: function(){
                        return null
                    }
                },
                controller: 'configureServiceCtrl'
            });

            modalInstance.result.then(function(res) {
                $scope.purchase.services.push(res.service);
                $scope.priceCalculation()
            })
        }


        // RESUME COMMANDE

        /**
        *   Management des ajouts et suppressions de produits dans le récapitulatif de la commande
        */
        $scope.addProductByIndex = function(index) {
            var aAugmenter = $scope.purchase.products[index];
            if(aAugmenter.purchasable.remainingQuantity > 0){
                aAugmenter.purchasedQuantity += 1;
                aAugmenter.finalPrice += aAugmenter.purchasable.price;
                aAugmenter.purchasable.remainingQuantity -= 1;
            }
            $scope.priceCalculation()
        }

        $scope.removeProductByIndex = function(index) {
            var aReduire = $scope.purchase.products[index];
            aReduire.purchasedQuantity -= 1;
            aReduire.finalPrice -= aReduire.purchasable.price;
            aReduire.purchasable.remainingQuantity += 1;
            if(aReduire.purchasedQuantity == 0){
                $scope.purchase.products.splice(index, 1);
            }
            $scope.priceCalculation()
        } 

        /**
        *   Calcul du prix
        */
        $scope.priceCalculation = function(){
            var price = 0
            for (var i = $scope.purchase.services.length - 1; i >= 0; i--) {
                if (!$scope.purchase.services[i].finalPrice){
                    price = "A déterminer"
                    break;
                } else {
                    price += $scope.purchase.services[i].finalPrice
                }
            }
            if (price != "A déterminer") {
                for (var i = $scope.purchase.products.length - 1; i >= 0; i--) {
                    price += $scope.purchase.products[i].finalPrice
                }
                $scope.purchase.price = price.toFixed(2) + " €"
            } else {
                $scope.purchase.price = price
            }
        }


        /**
        *  Enregistrement de la commande
        */
        $scope.save = function() {
            $scope.saving = true;

            var purchaseToSave = new Purchases();

            purchaseToSave.association = $scope.purchase.association;
            purchaseToSave.login = $scope.purchase.user.login;
            if($scope.purchase.entity) 
                purchaseToSave.entity_id = $scope.purchase.entity.id;

            // On sauvegarde la commande
            purchaseToSave.$save(function(resP){
                var idPurchase = resP.data.id;
                var num_commande = resP.data.number
                var pe;

                // Enregistrement des produits
                $scope.saveProductsElements(idPurchase).then(function(res){

                    // Enregistrement des services
                    $scope.saveServicesElements(idPurchase).then(function(res){
                        
                        Mail.demande_envoyée($scope.purchase.user.email, num_commande)

                        // Redirection
                        if($scope.membreCAS){
                            // Redirection vers la page de succes
                            $location.path('/purchases/success');
                        } else {
                            // Redirection vers la facture
                            $location.path('/purchases/' + idPurchase + '/edit');
                        }
                    }, function(error){
                        $scope.saving = false
                    })

                })
            });
        }

        /**
        *  Génération du devis associé au panier
        */
        $scope.devis = function() {
            $scope.loadingQuote = true;

            $scope.purchase.devis().then(function(res){
                $scope.loadingQuote = false;
            }, function(error){
                $scope.loadingQuote = false;
                $scope.error = ErrorHandler.parse(error);
            });

        }

        /**
        *   Sauvegarde des produits
        */
        $scope.saveProductsElements = function(idPurchase){

            var promises = $scope.purchase.products.map(function(product) {
                product.purchase_id = idPurchase
                return PurchasedElements.storeElement(product)
            });

            return $q.all(promises); 
        }


        /**
        *   Sauvegarde des servicdes (avec les fichiers)
        */
        $scope.saveServicesElements = function(idPurchase){

            var promises = $scope.purchase.services.map(function(service) {
                service.purchase_id = idPurchase
                return PurchasedElements.storeElement(service, function(res){
                    var idPE = res.data.newId;

                    // Sauvegarde des fichiers
                    if(service.files != undefined) {
                        Array.prototype.forEach.call(service.files, function(file) {
                            if(file instanceof File){
                                var url = __ENV.apiUrl + "/purchased/"+idPE+"/file";
                                var fd = new FormData();
                                fd.append('file', file);
                                $http.post(url, fd, {
                                    transformRequest: angular.identity,
                                    headers: {'Content-Type': undefined}
                                });
                            }
                        });
                    }
                })
            });

            return $q.all(promises); 
        }
    }

});
