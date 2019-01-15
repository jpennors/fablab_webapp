app.factory('CsvVerification', function(){

// Cette factorie a pour but d'effectuer les vérifications après le parsage des fichiers CSV
// Fichier DataController.js

    return factory = {

        /*  VERIFICATION D'OBJETS  */

        checkProducts : function(categories, rooms, wardrobes, elements){
            // Initialisation de la variable d'erreurs
            var errors = []

            // Itération pour tous les éléments
            for (var i = 0; i < elements.length; i++) {

                // Vérification des propriétés "Required"
                if (response = this.checkRequirement("Nom", elements[i].name, i, elements[i].name)) {
                    errors.push(response)
                }
                if (response = this.checkRequirement("Quantité", elements[i].remainingQuantity, i, elements[i].name)) {
                    errors.push(response)
                }
                if (response = this.checkRequirement("Prix", elements[i].price, i, elements[i].name)) {
                    errors.push(response)
                }
                if (response = this.checkRequirement("Categorie", elements[i].categorie, i, elements[i].name)) {
                    errors.push(response)
                }
                // Vérification de l'existence de la salle
                if (elements[i].room) {
                    if (response = this.checkRoom(rooms, elements[i], i)) {
                        errors.push(response)
                    }
                }
                // Vérification de l'existence de l'étagère
                if (elements[i].wardrobe) {
                    if (response = this.checkWardrobe(wardrobes, elements[i], i)) {
                        errors.push(response)
                    }
                }
                // Vérification de l'existence de la catégorie
                if (elements[i].categorie) {
                    if (response = this.checkCategorie(categories, elements[i], i)) {
                        errors.push(response)
                    }
                }
                // Vérification de l'existence d'un lien entre la salle et l'étagère
                if (response = this.checkAssociationRoomWardrobe(wardrobes, rooms, elements[i], i)) {
                    errors.push(response)
                }

                // Vérification des valeurs minimales
                if(elements[i].price){
                    if (response = this.checkMinValue("Prix", elements[i].price, i, elements[i].name, 0)) {
                        errors.push(response)
                    }
                }
                if(elements[i].remainingQuantity){
                    if (response = this.checkMinValue("Quantité", elements[i].remainingQuantity, i, elements[i].name, 0)) {
                        errors.push(response)
                    }
                }
                if(elements[i].minQuantity){
                    if (response = this.checkMinValue("Quantité minimale", elements[i].minQuantity, i, elements[i].name, 0)) {
                        errors.push(response)
                    }
                }

                //Vérification des valeurs numériques
                if(elements[i].minQuantity){
                    if (response = this.checkNumberValue("Quantité minimale", elements[i].minQuantity, i, elements[i].name)) {
                        errors.push(response)
                    }
                }
                if(elements[i].remainingQuantity){
                    if (response = this.checkNumberValue("Quantité", elements[i].remainingQuantity, i, elements[i].name)) {
                        errors.push(response)
                    }
                }
                if(elements[i].price){
                    if (response = this.checkNumberValue("Prix", elements[i].price, i, elements[i].name)) {
                        errors.push(response)
                    }
                }

                // Vérification de l'unicité de chaque nom de produits
                for (var j = i+1; j < elements.length; j++) {
                    if (i!=j && elements[i].name == elements[j].name){
                        errors.push("Noms similaires : Les items numero" + (i+1) + " et " + (j+1) + " ont le même nom " + elements[i].name )
                    }
                }
            }
            return errors
        },

        checkEngines : function(rooms, elements){
            // Initialisation de la variable d'erreurs
            var errors = []

            // Itération pour tous les éléments
            for (var i = 0; i < elements.length; i++) {

                // Vérification des propriétés "Required"
                if (response = this.checkRequirement("Nom", elements[i].name, i, elements[i].name)) {
                    errors.push(response)
                }
                if (response = this.checkRequirement("Salle", elements[i].room, i, elements[i].name)) {
                    errors.push(response)
                }
                if (response = this.checkRequirement("Statut", elements[i].status, i, elements[i].name)) {
                    errors.push(response)
                }

                // Vérification de l'existence de la salle
                if (elements[i].room) {
                    if (response = this.checkRoom(rooms, elements[i], i)) {
                        errors.push(response)
                    }
                }

                // Vérification de l'unicité de chaque nom de produits
                for (var j = i+1; j < elements.length; j++) {
                    if (i!=j && elements[i].name == elements[j].name){
                        errors.push("Noms similaires : Les items numero" + (i+1) + " et " + (j+1) + " ont le même nom " + elements[i].name )
                    }
                }
            }
            return errors
        },

        checkExpendables : function(rooms, wardrobes, elements){
            // Initialisation de la variable d'erreurs
            var errors = []

            // Itération pour tous les éléments
            for (var i = 0; i < elements.length; i++) {

                // Vérification des propriétés "Required"
                if (response = this.checkRequirement("Nom", elements[i].name, i, elements[i].name)) {
                    errors.push(response)
                }
                if (response = this.checkRequirement("Quantité", elements[i].remainingQuantity, i, elements[i].name)) {
                    errors.push(response)
                }

                // Vérification de l'existence de la salle
                if (elements[i].room) {
                    if (response = this.checkRoom(rooms, elements[i], i)) {
                        errors.push(response)
                    }
                }
                // Vérification de l'existence de l'étagère
                if (elements[i].wardrobe) {
                    if (response = this.checkWardrobe(wardrobes, elements[i], i)) {
                        errors.push(response)
                    }
                }
                // Vérification de l'existence d'un lien entre la salle et l'étagère
                if (response = this.checkAssociationRoomWardrobe(wardrobes, rooms, elements[i], i)) {
                    errors.push(response)
                }

                // Vérification des valeurs minimales
                if(elements[i].remainingQuantity){
                    if (response = this.checkMinValue("Quantité", elements[i].remainingQuantity, i, elements[i].name, 0)) {
                        errors.push(response)
                    }
                }
                if(elements[i].minQuantity){
                    if (response = this.checkMinValue("Quantité minimale", elements[i].minQuantity, i, elements[i].name, 0)) {
                        errors.push(response)
                    }
                }

                //Vérification des valeurs numériques
                if(elements[i].minQuantity){
                    if (response = this.checkNumberValue("Quantité minimale", elements[i].minQuantity, i, elements[i].name)) {
                        errors.push(response)
                    }
                }
                if(elements[i].remainingQuantity){
                    if (response = this.checkNumberValue("Quantité", elements[i].remainingQuantity, i, elements[i].name)) {
                        errors.push(response)
                    }
                }

                // Vérification de l'unicité de chaque nom de produits
                for (var j = i+1; j < elements.length; j++) {
                    if (i!=j && elements[i].name == elements[j].name){
                        errors.push("Noms similaires : Les items numero" + (i+1) + " et " + (j+1) + " ont le même nom " + elements[i].name )
                    }
                }
            }
            return errors
        },

        checkTools : function(rooms, wardrobes, elements){
            // Initialisation de la variable d'erreurs
            var errors = []

            // Itération pour tous les éléments
            for (var i = 0; i < elements.length; i++) {

                // Vérification des propriétés "Required"
                if (response = this.checkRequirement("Nom", elements[i].name, i, elements[i].name)) {
                    errors.push(response)
                }
                if (response = this.checkRequirement("Type", elements[i].type, i, elements[i].name)) {
                    errors.push(response)
                }
                if (response = this.checkRequirement("Quantité", elements[i].remainingQuantity, i, elements[i].name)) {
                    errors.push(response)
                }
                // Vérification de l'existence de la salle
                if (elements[i].room) {
                    if (response = this.checkRoom(rooms, elements[i], i)) {
                        errors.push(response)
                    }
                }
                // Vérification de l'existence de l'étagère
                if (elements[i].wardrobe) {
                    if (response = this.checkWardrobe(wardrobes, elements[i], i)) {
                        errors.push(response)
                    }
                }
                // Vérification de l'existence d'un lien entre la salle et l'étagère
                if (response = this.checkAssociationRoomWardrobe(wardrobes, rooms, elements[i], i)) {
                    errors.push(response)
                }

                // Vérification des valeurs minimales
                if(elements[i].remainingQuantity){
                    if (response = this.checkMinValue("Quantité", elements[i].remainingQuantity, i, elements[i].name, 0)) {
                        errors.push(response)
                    }
                }
                if(elements[i].minQuantity){
                    if (response = this.checkMinValue("Quantité minimale", elements[i].minQuantity, i, elements[i].name, 0)) {
                        errors.push(response)
                    }
                }

                //Vérification des valeurs numériques
                if(elements[i].minQuantity){
                    if (response = this.checkNumberValue("Quantité minimale", elements[i].minQuantity, i, elements[i].name)) {
                        errors.push(response)
                    }
                }
                if(elements[i].remainingQuantity){
                    if (response = this.checkNumberValue("Quantité", elements[i].remainingQuantity, i, elements[i].name)) {
                        errors.push(response)
                    }
                }

                // Vérification de la valeur dans type (chemical ou tool)
                if(elements[i].type){
                    if (elements[i].type != "chemical" && elements[i].type != "tool"){
                        errors.push("Type erroné: Le type de l'élément " + elements[i].name + " numéro " + (i+1) + " doit être chemical ou tool.")
                    }
                }

                // Vérification des dates
                if(elements[i].expiryDate){
                    if (response = this.checkDate("Date d'expiration", elements[i].expiryDate, i, elements[i].name)) {
                        errors.push(response)
                    }
                }
                if(elements[i].dateOfPurchase){
                    if (response = this.checkDate("Date d'achat", elements[i].dateOfPurchase, i, elements[i].name)) {
                        errors.push(response)
                    }
                }

                // Vérification de l'unicité de chaque nom de produits
                for (var j = i+1; j < elements.length; j++) {
                    if (i!=j && elements[i].name == elements[j].name){
                        errors.push("Noms similaires : Les items numero" + (i+1) + " et " + (j+1) + " ont le même nom " + elements[i].name )
                    }
                }
            }
            return errors
        },


        /*  VERIFICATION DE PROPRIETES  */

        // Vérifier l'existence d'une catégorie
        checkCategorie : function(categories, element, index){
            if (!categories.find(categorie => categorie.name == element.categorie)) {
                return "Catégorie introuvable: La catégorie " + element.categorie + " entrée pour l'élément " + element.name + " numéro " + (index+1) + " est intouvable."
            }
            return null
        },

        // Vérifier l'existence d'une salle
        checkRoom : function(rooms, element, index){
            if (!rooms.find(room => room.name == element.room)) {
                return "Salle introuvable : La salle " + element.room + " entrée pour l'élément " + element.name + " numéro " + (index+1) + " est intouvable."
            }
            return null
        },

        // Vérifier l'existence d'une étagère
        checkWardrobe : function(wardrobes, element, index){
            if (!wardrobes.find(wardrobe => wardrobe.name == element.wardrobe)) {
                return "Etagère introuvable : La salle " + element.wardrobe + " entrée pour l'élément " + element.name + " numéro " + (index+1) + " est intouvable."
            }
            return null
        },

        // Vérifier l'existence d'un lien entre la salle et l'étagère
        checkAssociationRoomWardrobe : function(wardrobes, rooms, element, index){
            var room = rooms.find(room => room.name == element.room)
            if (room && element.wardrobe) {
                wardrobe = wardrobes.find(wardrobe => wardrobe.name == element.wardrobe && wardrobe.room_id == room.id)
                if(!wardrobe) {
                    return "Couple étagère/salle erroné : La salle " + element.room + " entrée pour l'élément " + element.name + " numéro " + (index+1) + " ne comporte pas d'étagère " + element.wardrobe + "."
                }
            }
            return null
        },

        //Vérifier qu'une propriété n'est pas nulle
        checkRequirement: function(propertieName, propertieContent, index, elementName){
            if(propertieContent == null) {
                return propertieName + " manquant(e) : La propriété " + propertieName + " de l'élément " + elementName + " numero " + (index+1) + " est requise."
            }
            return null
        }, 

        // Vérifier qu'une propriété respecte la valeur minimale fixée
        checkMinValue: function(propertieName, propertieContent, index, elementName, minValue){
            if (propertieContent < minValue) {
                return "Propriété " + propertieName + " non respectée : La propriété " + propertieName + " de l'élément " + elementName + " numero " + (index+1) + " ne peut être inférieure à " + minValue + "."
            }
            return null
        },

        // Vérifier que la valeur est bien un nombre
        checkNumberValue: function(propertieName, propertieContent, index, elementName){
            if (!angular.isNumber(propertieContent)) {
                return "Propriété " + propertieName + " non respectée : La propriété " + propertieName + " de l'élément " + elementName + " numero " + (index+1) + " doit être un nombre."
            }
            return null
        },

        checkDate: function(propertieName, propertieContent, index, elementName){
            var regex = /^\d{4}-(((0)[0-9])|((1)[0-2]))-([0-2][0-9]|(3)[0-1])/
            var validDate = regex.test(propertieContent)
            if(!validDate){
                return "Date erronée : La propriété " + propertieName + " de l'élément " + elementName + " numéro " + (index+1) + " n'est pas valide et/ou au format AAAA-MM-JJ."
            }
            return null
        }
    }
});
