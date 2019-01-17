app.factory('Csv', function(){

//Cette factorie a pour but de réduire le code dans DataController.js
//Voir exemple pour products et productsheader. 
//toutes les focntions qui suivent sont identiques, seul la structure de la DB est différente

    return factory = {

        //Constitue un tableau de produits après le parsage CSV. A pour but d'être affiché puis enregistré en DB
        products : function(csvLines){

            var products = [];
            for (var i = 1; i < csvLines.length - 1 ; i++) {
                products[i-1]={}
                products[i-1].name = csvLines[i][0]
                products[i-1].description = csvLines[i][1]
                products[i-1].picture = csvLines[i][2]
                products[i-1].price = parseFloat(csvLines[i][3]);
                products[i-1].quantityUnit = csvLines[i][4]
                products[i-1].remainingQuantity = csvLines[i][5]
                products[i-1].minQuantity = csvLines[i][6]
                products[i-1].brand = csvLines[i][7]
                products[i-1].supplier = csvLines[i][8]
                products[i-1].supplierLink = csvLines[i][9]
                products[i-1].documentation = csvLines[i][10]
                products[i-1].dataSheet = csvLines[i][11]
                products[i-1].room = csvLines[i][12]
                products[i-1].wardrobe = csvLines[i][13]
                products[i-1].categorie = csvLines[i][14]
            }
            return products;
        },

        //Retourne les colonnes de produits correspondantes
        productsHeader : function(){
            var headers = [
                'Nom', 
                'Description',
                'Image', 
                'Prix', 
                'Unité', 
                'Quantité', 
                'Quantité minimale', 
                'Marque', 
                'Fournisseur', 
                'Lien fournisseur', 
                'Documentation', 
                'Fiche technique', 
                'Salle',
                'Etagère',
                'Catégorie'
            ];
            return headers;
        },

        engines : function(csvLines){

            var engines = [];
            for (var i = 1; i < csvLines.length - 1 ; i++) {
                engines[i-1]={}
                engines[i-1].name = csvLines[i][0]
                engines[i-1].description = csvLines[i][1]
                engines[i-1].picture = csvLines[i][2]
                engines[i-1].status = csvLines[i][3];
                engines[i-1].documentation = csvLines[i][4]
                engines[i-1].dataSheet = csvLines[i][5]
                engines[i-1].room = csvLines[i][6]
            }
            return engines;
        },

        enginesHeader : function(){
            var headers = [
                'Nom', 
                'Description', 
                'Image', 
                'Statut', 
                'Documentation', 
                'Fiche technique', 
                'Salle'
            ];
            return headers;
        },


        tools : function(csvLines){

            var tools = [];
            for (var i = 1; i < csvLines.length - 1 ; i++) {
                tools[i-1]={}
                tools[i-1].type = csvLines[i][0]
                tools[i-1].name = csvLines[i][1]
                tools[i-1].description = csvLines[i][2];
                tools[i-1].picture = csvLines[i][3];
                tools[i-1].supplier = csvLines[i][4];
                tools[i-1].quantityUnit = csvLines[i][5]
                tools[i-1].remainingQuantity = csvLines[i][6]
                tools[i-1].minQuantity = csvLines[i][7]
                tools[i-1].toxicity = csvLines[i][8]
                tools[i-1].expiryDate = csvLines[i][9]
                tools[i-1].dateOfPurchase = csvLines[i][10]
                tools[i-1].room = csvLines[i][11]
                tools[i-1].wardrobe = csvLines[i][12]
            }   
            return tools;
        },

        toolsHeader : function(){
            var headers = [
                "Type", 
                "Nom",
                "Description", 
                "Image",
                "Fournisseur",
                "Unité",
                "Quantité",
                "Quantité minimale",
                "Toxicité",
                "Date d'expiration",
                "Date d'achat",
                "Salle",
                "Etagère"            
            ];
            return headers;
        },


        expendables : function(csvLines){

            var expendables = [];
            for (var i = 1; i < csvLines.length - 1 ; i++) {
                expendables[i-1]={}
                expendables[i-1].name = csvLines[i][0]
                expendables[i-1].brand = csvLines[i][1]
                expendables[i-1].supplier = csvLines[i][2]
                expendables[i-1].supplierLink = csvLines[i][3]
                expendables[i-1].quantityUnit = csvLines[i][4];
                expendables[i-1].remainingQuantity = csvLines[i][5]
                expendables[i-1].minQuantity = csvLines[i][6]
                expendables[i-1].description = csvLines[i][7]
                expendables[i-1].picture = csvLines[i][8]
                expendables[i-1].room = csvLines[i][9]
                expendables[i-1].wardrobe = csvLines[i][10]
            }
            return expendables;
        },

        expendablesHeader : function(){
            var headers = [
                'Nom', 
                'Marque',
                'Fournisseur',
                'Lien Fournisseur',
                'Unité',
                'Quantité',
                'Quantité minimale',
                'Description', 
                'Image',
                'Salle',
                'Etagère'
            ];
            return headers;
        },

        scripts : function(csvLines){

            var scripts = [];
            for (var i = 1; i < csvLines.length - 1 ; i++) {
                scripts[i-1]={}
                scripts[i-1].name = csvLines[i][0]
                scripts[i-1].description = csvLines[i][1]
                scripts[i-1].script = csvLines[i][2]
                scripts[i-1].args = csvLines[i][3];
            }
            return scripts;
        },

        scriptsHeader : function(){
            var headers = [
                'Nom', 
                'Description', 
                'Script',
                'Args'
            ];
            return headers;
        },
    }
});
