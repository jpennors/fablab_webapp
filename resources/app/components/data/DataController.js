/*
*  Gestion des Exports et Imports
*/
app.controller('dataCtrl', function($scope, $http, ErrorHandler, $uibModal, Csv, CsvVerification, $q, $timeout, $rootScope, $location, Categories, Rooms, Wardrobes){

    //On vérifie que l'utilisateur a l'autorisation d'accéder à la page
    if(!$rootScope.can('list-data')) {
        $location.path("/error/404");
    } else {
    
        //Valeur par défaut du type
        $scope.data = {}
        $scope.data.type = "products";


        /* EXPORT */

        //Fonction pour exporter les produits + téléchargement
        $scope.export = function(){
            $scope.import= false;
            var type = $scope.data.type;
            $http.get(__ENV.apiUrl + '/export/'+type, {responseType : "blob"}).then(
            function(data){
                console.log(data);
                saveAs(data.data, 'inventaire_'+type+'.xlsx');
            });
        }

        /* IMPORT */

        $scope.data.file=null;
        $scope.import=false;
        $scope.parsing=false;
        $scope.imported = false;


        // Si on appuie sur Importer 
        $scope.inputFile = function(){
            $scope.import = true;
        }

        /* Fonctoin faisant appel a la bibliothèque Papaparse, appel asynchrone => utilisation de Promise */
        function parse(file) {
            var deferred = $q.defer();
            config = {
                header: false,
                dynamicTyping: true,
                encoding: "ISO-8859-1"
            }
            config.complete = function onComplete(result) {
                if (config.rejectOnError && result.errors.length) {
                    deferred.reject(result);
                    return;
                }
                deferred.resolve(result);
            };
            config.error = function onError(error) {
                deferred.reject(error);
            };
            Papa.parse(file, config);
            return deferred.promise;
        }


        $scope.csvParse = function(){
            var type = $scope.data.type;
            var file = $scope.data.file;

            if(file instanceof File){
                parse(file).then(function(data){
                    $scope.csvLines = data.data;
                    $scope.items = {};
                    $scope.items.data = [];
                    $scope.headers = {};
                    $scope.headers.data = [];
                    switch(type){
                        case 'products' :
                            $scope.items.data = Csv.products($scope.csvLines)
                            $scope.headers.data = Csv.productsHeader();
                            break;
                        case 'engines' :
                            $scope.items.data = Csv.engines($scope.csvLines)
                            $scope.headers.data = Csv.enginesHeader();
                            break;
                        case 'tools' :
                            $scope.items.data = Csv.tools($scope.csvLines)
                            $scope.headers.data = Csv.toolsHeader();
                            break;
                        case 'expendables' :
                            $scope.items.data = Csv.expendables($scope.csvLines)
                            $scope.headers.data = Csv.expendablesHeader();
                            break;
                    }
                    $scope.parsing = true
                });
            }
        }


        $scope.saveCsv=function(){
            var validity = checkCsvContent($scope.items.data)
            if (validity == true) {
                console.log("la")
                $http.post(__ENV.apiUrl + '/import/'+ $scope.data.type, $scope.items, gererErreur).then(function(){
                    $scope.parsing = false;
                    $scope.import = false;
                    //Pour signaler à l'utilisateur que l'import a bien eu lieu
                    $scope.imported = true;
                    $timeout(function() {
                       $scope.imported = false;
                    }, 5000)
                }, gererErreur)
            } 
        }

        var gererErreur = function(error) {
            if(error.status == 422) {
                $scope.inputErrors = error.data.data;
            }
            else if(error.status == 409) {
                $scope.messageError = "Un produit avec le même nom existe déjà.";
            }
            else if (error.status == 500) {
                $scope.messageError = "Problème avec le serveur."
            }

        }

        // Vérifier que le contenu du fichier CSV est conforme 
        $scope.errorsFromFront = []
        var checkCsvContent = function (elements) {
            validity = true
            response = []
            $scope.errorsFromFront = []
            switch($scope.data.type){
                case "products":
                    response = CsvVerification.checkProducts($scope.categories, $scope.rooms, $scope.wardrobes, elements)
                    break;
                case "tools":
                    response = CsvVerification.checkTools($scope.rooms, $scope.wardrobes, elements)
                    break;
                case "expendables":
                    response = CsvVerification.checkExpendables($scope.rooms, $scope.wardrobes, elements)
                    break;
                case "engines":
                    response = CsvVerification.checkEngines($scope.rooms, elements)
                    break;
            }
            if (response.length>0) {
                $scope.errorsFromFront = response
                validity = false
            }
            return validity
        }

        $scope.clearImport = function(){
            $scope.import = false
            $scope.parsing = false
            $scope.errorsFromFront = []
        }


        Categories.get({}, function(res){
            $scope.categories = res.data;
        }, function(error){
            ErrorHandler.alert(error);
        });

        Rooms.get({}, function(res){
            $scope.rooms = res.data;
        }, function(error){
            ErrorHandler.alert(error);
        });

        Wardrobes.get({}, function(res){
            $scope.wardrobes = res.data;
        }, function(error){
            ErrorHandler.alert(error);
        });
    }
});
