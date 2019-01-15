/**
*  Factory liée aux commandes: permet de construire facilement la commande et la POST sur l'API
*/
app.factory('PurchaseCreator', function($resource, $q, Purchases, PurchasedElements){
    return factory = {

        /**
        *  Le client
        */
        user : {},

        /**
        *  Contient les elements de la commande (le panier de la commande)
        */
        basket : {
            products : [],
            services : []
        },

        /**
        *  Reset total de l'objet
        */
        reset : function() {
            this.user = null;
            this.entity = null;
            this.basket.products = [];
            this.basket.services = [];
        },

        /**
        *  Génère un id unique pour chaque élément du panier
        */
        uniqueid : function() {
            return "id-" + Math.random().toString(36).substr(2, 16);
        },

        /**
        *  Ajoute un Product au panier
        */
        addProduct : function(product) {

            var index = this.getProductBasketByProduct(product);
            if(index != -1) {

                // Product déjà dans le panier, on incrémente la quantité
                this.more(this.basket.products[index], 1);

            } else {

                // Le Product n'était pas déjà dans le panier, on l'ajoute
                var id = this.uniqueid();

                // Création du pelement
                var pelement = {

                    // Identitifiant unique du pelement dans le basket
                    "id_basket" : id,

                    // Détails pour le prix
                    "comment" : "",
                    "suggestedPrice" : 0,
                    "finalPrice" : 0,

                    // Détails sur le service
                    "purchasedQuantity" : 0,
                    "purchasable_type" : "product",
                    "purchasable_id" : product.id,
                    "purchasable" : product,
                }

                // On l'insère
                this.basket.products.push(pelement);

                // Et on met à 1 la quantité
                this.more(pelement, 1);
            }
        },

        /**
        *  Ajoute un Service (Cutting/Printing) au panier
        * type : si "membre fablab" alors on a un prix, sinon "externe" pas de prix
        */
        addService : function(service) {

            var id = this.uniqueid();

            // Création du pelement
            var pelement = {

                // Identitifiant unique du pelement dans le basket
                "id_basket" : id,

                // Détails pour le prix
                "args" : {},
                "comment" : service.comment,
                "suggestedPrice" : 0,
                "finalPrice" : 0,

                // Détails sur le service
                "purchasedQuantity" : service.quantity,
                "purchasable_type" : "service",
                "purchasable_id" : service.element.id,
                "purchasable" : service.element,
            }

            this.basket.services.push(pelement);
        },

        /**
        *  Edite un Service (Cutting/Printing) du panier
        */
        editService : function(modal) {

            var index = this.getService(modal.id_basket);
            if(index == -1) return false;

            // Création du nouveau pelement
            var pelement = {

                // Récupération de l'id_basket
                "id_basket" : modal.id_basket,

                // Détails pour le prix
                "args" : modal.args,
                "comment" : modal.comment,
                "suggestedPrice" : modal.pricer.compute(modal.args),
                "finalPrice" : modal.finalPrice,

                // Détails sur le service
                "purchasedQuantity" : 1,
                "purchasable_type" : "service",
                "purchasable_id" : modal.element.id,
                "purchasable" : modal.element,
            }

            // On remplace
            this.basket.services[index] = pelement;
        },

        /**
        *  Suppression d'un pelement du panier
        */
        delProduct : function(id_basket) {
            var index = this.getProduct(id_basket);

            if(index != -1) {
                this.basket.products.splice(index, 1);
            }

        },

        /**
        *  Suppression d'un pelement du panier
        */
        delService : function(id_basket) {
            var index = this.getService(id_basket);

            if(index != -1) {
                this.basket.services.splice(index, 1);
            }

        },

        /**
        *  Construit la Resource Purchase pour soumettre
        */
        buildPurchase : function() {
            var purchase = new Purchases();
            purchase.user = this.user.id;
            purchase.association = this.association;
            purchase.login = this.login;
            if(this.entity) purchase.entity = this.entity.id;
            //console.log(this);
            return purchase;
        },

        /**
        *  Construit la Resource PurchasedElements pour soumettre
        */
        buildElements : function() {

            var elements = new PurchasedElements();
            elements.elements = [];

            // Enregistrement des pelements
            for(i=0; i<this.basket.products.length; i++) {
                elements.elements.push(this.basket.products[i]);
            }
            for(i=0; i<this.basket.services.length; i++) {
                elements.elements.push(this.basket.services[i]);
            }

            return elements;
        },

        /**
        *  Enregistrement de la commande: Purchase + PurchasedElements
        */
        save : function() {
            console.log(this);
            var deferred = $q.defer();
            var that = this;

            //console.log(that);
            //console.log(deferred);
            // La Purchase
            that.buildPurchase().$save(function(resP){

                // Les PurchasedElements
                that.buildElements().$save({idP : resP.data.id}, function(resE){
                    if(resE.meta.status == 202) {
                        // pas de synchro avec payutc
                        deferred.resolve({
                            payutc: {
                                synch: false,
                                error: resE.data
                            },
                            dataPurchase: resP
                        });
                    } else {
                        deferred.resolve({
                            payutc: {
                                synch: true
                            },
                            dataPurchase: resP
                        });
                    }

                }, function(errE){
                    deferred.reject(errE);
                });

            }, function(errP){
                deferred.reject(errP);
            });

            return deferred.promise;
        },

        /**
        *  Génération d'un devis
        */
        devis : function() {
            var deferred = $q.defer();
            var that = this;

            // Les PurchasedElements
            that.buildElements().$quote({}, function(data){
                saveAs(data.pdf, 'Devis_Fablab_' + new Date().getTime() + '.pdf');
                deferred.resolve(true);
            }, function(error){
                deferred.reject(error);
            });

            return deferred.promise;
        },

        /**
        *  Calcul le total du prix de la commande
        */
        total : function() {
            var s = 0;
            for(var i = 0; i<this.basket.products.length; i++)
            s += this.basket.products[i].finalPrice;
            // for(var i = 0; i<this.basket.services.length; i++)
            // s += this.basket.services[i].finalPrice;
            return s;
        },

        /**
        *  Calcul le nombre total d'éléments dans la commande
        */
        quantity : function() {
            return this.basket.products.length + this.basket.services.length;
        },

        /**
        *  Recherche le Product dans le basket à partir de son id de Product.
        *  Retourne l'index du Product dans basket.
        *  Retourne -1 si non trouvé.
        */
        getProductBasketByProduct : function(product) {
            var index = this.basket.products.indexOf(this.basket.products.find(function(pelement){
                return pelement.purchasable_id == product.id;
            }));
            return index;
        },

        /**
        *  Recherche le pelement dans le basket à partir de son id_basket.
        *  Retourne son index dans basket.products.
        *  Retourne -1 si non trouvé.
        */
        getProduct: function(id_basket) {
            var index = this.basket.products.indexOf(this.basket.products.find(function(pelement){
                return pelement.id_basket == id_basket;
            }));
            return index;
        },

        /**
        *  Recherche le pelement dans le basket à partir de son id_basket.
        *  Retourne son index dans basket.products.
        *  Retourne -1 si non trouvé.
        */
        getService: function(id_basket) {
            var index = this.basket.services.indexOf(this.basket.services.find(function(pelement){
                return pelement.id_basket == id_basket;
            }));
            return index;
        },

        /**
        *  Ajouter ou diminuer la quantité
        */
        more : function(pelement, n) {

            var index = this.getProduct(pelement.id_basket);
            pelement.purchasable.remainingQuantity += -n;

            if(this.basket.products[index].purchasedQuantity+n <= 0) {
                // Remove du Product dans le basket
                this.basket.products.splice(index, 1);
            }
            else {
                this.basket.products[index].purchasedQuantity += n;
                this.basket.products[index].suggestedPrice = this.basket.products[index].purchasedQuantity * this.basket.products[index].purchasable.price;
                this.basket.products[index].finalPrice = this.basket.products[index].suggestedPrice;
            }

        }

    };
});
