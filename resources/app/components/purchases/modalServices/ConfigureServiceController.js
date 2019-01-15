app.controller('configureServiceCtrl', function($window, $scope, $http, $q, object, type, $uibModalInstance, $filter, ScriptFactory, $rootScope, PurchasedElements, Mail) {

    /**
    *   Initialisation
    *
    */

    // Utilisateur
    $scope.user = $rootScope.auth.member
    $scope.membreCAS = $rootScope.isExtern()

    // Fonction de prix 
    $scope.fonctionPrix = {}
    
    // Différent comportement en fonction du type d'ouverte de la modale, création ou édition
    $scope.type = type
    if ($scope.type == 'create') {

        // Création d'un nouvel élément pour la commande
        $scope.element = {}
        $scope.element.args = {}
        $scope.element.comment = ""
        $scope.element.finalPrice = null
        $scope.element.files = []
        $scope.element.newFiles = []

        // Récupération du service
        $scope.service = object;

        // On parse le JSON des args
        $scope.service.script.args = JSON.parse($scope.service.script.args);

        // Ajout du service et du script dans la fonction de prix
        $scope.fonctionPrix.element = $scope.service
        $scope.fonctionPrix.pricer = ScriptFactory($scope.service.script)
        
    } else if ($scope.type == 'view') {

        // Récupération de toutes les versions du service
        $scope.versions = object

        // Format de la date
        for (var i = $scope.versions.length - 1; i >= 0; i--) {
            var deadline = $scope.versions[i].deadline
            $scope.versions[i].deadlineInput = new Date(moment(deadline).get('year'), moment(deadline).get('month'), moment(deadline).get('date'))
        }

        // Récupération de la dernière version
        $scope.element = $scope.versions[object.length-1];

        // Récupération des fichiers 
        if($scope.element.status < 3){
            $scope.element.files = []
            $scope.element.addedFiles = []
            $scope.element.deletedFiles = []
            PurchasedElements.getFileList({id: $scope.element.id}, function(data){
                var fileNames = data.data
                for (var i = fileNames.length - 1; i >= 0; i--) {
                    var fileName = fileNames[i]
                    getFile($scope.element.id, fileNames[i])
                }
            })
        }

        // Récupération du service lié
        $scope.service = $scope.element.purchasable
        // On parse le JSON des args
        $scope.service.script.args = JSON.parse($scope.service.script.args);

        // On crée l'object args s'il est vide
        if($scope.element.args.length == 0){
            $scope.element.args = {}
        }
        
        // Ajout du service et du script dans la fonction de prix
        $scope.fonctionPrix.element = $scope.element.purchasable
        $scope.fonctionPrix.pricer = ScriptFactory($scope.element.purchasable.script)
    }
    
    // Ajout des arguments à la fonction
    $scope.fonctionPrix.args = $scope.element.args;

    // Détermine s'il existe un argument publique pour l'affichage de la section "Champ à remplir"
    $scope.hasPublicPermission = false
    if ($scope.service.script.args){
        for (var i = $scope.service.script.args.length - 1; i >= 0; i--) {
            if ($scope.service.script.args[i].permission) {
                $scope.hasPublicPermission = true
                break;
            }
        }
    }


    /**
    * Observers
    */
    $scope.$watch("element.newFiles", function(newV, oldV){
        if(newV instanceof FileList) {
            

            for (var i = newV.length - 1; i >= 0; i--) {
                if(newV[i].size < 20971520){ 
                    if ($scope.element.files.length >= 9) {
                        $scope.element.fileError = "Le nombre de fichiers est limité à 9."
                    } else {
                        $scope.element.fileError = ""
                        $scope.element.files.push(newV[i])
                        if($scope.type != "create"){
                            $scope.element.addedFiles.push(newV[i])
                        }
                    }
                } else {
                    $scope.element.fileError = "Fichier trop volumineux (20 Mo maximum). Vous pouvez le réduire ou mettre un lien Filex dans le commentaire."
                } 
            }
        }   
    });

    $scope.$watch("element.args",() => {
        $scope.fonctionPrix.args = $scope.element.args;
    });

    /**
    *   Editer le type (view, create, history, edit)
    */
    $scope.editType = function(type){
        $scope.type = type
    }


    /**
    *   Fonctions de gestion des fichiers
    */

    // Suppression d'un fichier
    $scope.deleteFile = function($index, name){
        $scope.element.files.splice($index, 1)
        $scope.element.fileError = "" 
        if ($scope.element.files != "create") {
            if (!fileIsInAddedFile(name)) {
                $scope.element.deletedFiles.push(name)
            } else {
                removeFromAddedFiles(name)
            }
            
        }
    }

    // Présence dun fichier dans l'Array AddedFiles contenant les fichiers ajoutés lors d'une update
    var fileIsInAddedFile = function(name){
        for (var i = $scope.element.addedFiles.length - 1; i >= 0; i--) {
            if($scope.element.addedFiles[i].name == name){
                return true;
                break;
            }
        }
        return false
    }

    // Suppression d'un fichier de l'Array AddedFiles
    var removeFromAddedFiles = function(name){
        for (var i = $scope.element.addedFiles.length - 1; i >= 0; i--) {
            if($scope.element.addedFiles[i].name == name) {
                $scope.element.addedFiles.splice(i, 1)
            }
        }
    }

    // Téléchargement d'un fichier
    $scope.downloadFile = function(file){
        if ($scope.type == "create") {
            saveAs(file, file.name)
        } else {
            saveAs(file.file, file.name);
        }
    }

    // Appel API pour un fichier
    var getFile = function(id, fileName){
        PurchasedElements.getFile({id, fileName: fileName}, function(data){
            // Création du fichier
            var file = new Blob([data])
            // Création objet fichier ( Nom + Fichier )
            var fileObject = {
                name: fileName,
                file: file
            }
            $scope.element.files.push(fileObject)
        })
    }


    /**
    *  Calcul du prix suggeré
    */
    $scope.showPriceModal = function(){
        if($scope.fonctionPrix.args) {
            var price = $scope.fonctionPrix.pricer.compute($scope.fonctionPrix.args);
            if(price != null) return price;
            else return null;
        }
    };


    /**
    *   Historique : changement de version
    */
    $scope.changeVersion = function(version){
        $scope.element = $scope.versions[version-1];
    }
    

    /**
    *   Ajout du service à la commande
    */
    $scope.add = function() {
        if($scope.service.time == undefined || $scope.service.time < 2) {
            $scope.error = "Le champ intervalle de temps est obligatoire et doit être supérieur à 2";
        }else {
            $scope.error = "";            
            var deadline = new Date();
            deadline.setDate(deadline.getDate()+$scope.service.time);
            var status = 0
            if( !$scope.membreCAS && $scope.element.finalPrice) {
                status = 2
            } 

            $uibModalInstance.close({service:{
                purchasable : $scope.service,
                comment : $scope.element.comment,
                deadline : deadline,
                purchasedQuantity : 1,
                files : $scope.element.files,
                args : $scope.element.args,
                suggestedPrice : $scope.showPriceModal(),
                finalPrice : $scope.element.finalPrice,
                purchasable_type : 'service',
                status : status
            }});
        }
    }


    /**
    * Annulation de l'action
    */
    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    }


    /**
    *   Mode édition : Suppression de la commande (annulation)
    */
    $scope.delete = function(){
        // On supprime en mettant a jour avec le statut 
        if ($scope.membreCAS)
            $scope.update(5)
        else 
            $scope.update(4)
    }


    /**
    *   Mode édition : Mise à jour du status de la commande, confirmation (Valider/Réaliser)
    */
    $scope.confirm = function(status){
        $scope.update(status)
    }


    /**
    *   Sauvegarde de l'édition de la commande
    */
    $scope.edit = function(element){
        if ($scope.membreCAS){
            $scope.update(0)
        }
        else {
            if (!$scope.element.finalPrice) {
                $scope.update(0)
            } else if ($scope.versions[0].login_edit == $rootScope.auth.member.login) {
                $scope.update(2)
            } else {
                $scope.update(1)
            }
        }
    }


    /**
    *   Mise à jour de la commande, status et attributs
    */
    $scope.update = function(status) {

        // Formater la deadline
        $scope.element.deadline = $filter('date')($scope.element.deadlineInput, "yyyy-MM-dd");

        $scope.messageError = null;
        $scope.inputErrors = null;

        /* On récupère les données liées au service*/
        //Calcule le prix suggéré
        $scope.element.args = $scope.fonctionPrix.args;

        var pe = {}
        // pe = new PurchasedElements();
        pe.id=$scope.element.id;
        pe.purchase_id = $scope.element.purchase_id;
        pe.purchasedQuantity = $scope.element.purchasedQuantity;
        pe.finalPrice = $scope.element.finalPrice;
        pe.suggestedPrice =  $scope.showPriceModal();
        pe.version = $scope.element.version+1;
        pe.comment = $scope.element.comment;
        pe.args = $scope.element.args;
        pe.deadline = $scope.element.deadline;
        pe.login_edit = $scope.user.login
        pe.purchasable_id = $scope.element.purchasable.id;
        pe.deleted_files = $scope.element.deletedFiles;

        //On restranscrit le statut à sauvegarder
        pe.status = status;

        if($scope.element.PurchasedName=="Produit") {
            pe.purchasable_type = "product";
        }
        else {
            pe.purchasable_type="service";
        }

        PurchasedElements.updateElement(pe, function(res){
            console.log("cc")
            $scope.saveFiles().then(function(res){

                //Envoie d'email
                var dataMail = {}

                switch(status){
                    case 0 :
                    dataMail = {
                        "subject" : "Fablab : Confirmation modification service",
                        "content" : "Votre demande de service \"" + $scope.service.name + "\" a bien été modifiée.",
                        "receiver" : "fablab@assos.utc.fr",
                    }

                    // Plus envoie d'un email au Fablab
                    dataMailFablab = {
                        "subject" : "Modification d'un service",
                        "content" : "Une demande de service \"" + $scope.service.name + "\" a été modifiée par le client et demande une nouvelle validation.",
                        "receiver" : "fablab@assos.utc.fr",
                    }
                    Mail.send(dataMailFablab)
                    break;
                    case 1 :
                    dataMail = {
                        "subject" : "Fablab : Validation de votre commande",
                        "content" : "Le service \"" +  $scope.service.name +"\" a été complété et validé par le Fablab. Vous pouvez aller dès à présent le confirmer pour qu'il soit mis en production. Pour le confirmer, vous devez tout d'abord vous rendre sur le site de gestion: gestion.fablabutc.fr. Dans la rubrique, \"Commandes\" / \"Mes commandes\", vous trouverez votre commande. Il vous faudra vous rendre dans la commande et cliquer sur le service correspondant. Une modale s'ouvrira alors et vous pourrez indiquer \"Valider\" si cela vous convient. Vous avez également la possibilité d'éditer le service. Toute modification entraînera une nouvelle validation du Fablab.",
                        "receiver" : $scope.versions[0].login_edit,
                    }
                    break;
                    case 2 :
                    dataMail = {
                        "subject" : "Fablab : Validation d'un service",
                        "content" : "Une demande de service \"" + $scope.service.name + "\" a été validée par un client et peut être mise en production.",
                        "receiver" : "fablab@assos.utc.fr",
                    }
                    break;
                    case 3 :
                    dataMail = {
                        "subject" : "Fablab : Service réalisé",
                        "content" : "Votre service \"" + $scope.service.name + "\" est prêt. Vous pouvez dès à présent venir le récupérer au Fablab.",
                        "receiver" : $scope.versions[0].login_edit,
                    }
                    break;
                    case 4 :
                    dataMail = {
                        "subject" : "Fablab : Annulation de votre service",
                        "content" : "Le service \"" + $scope.service.name + "\" que vous avez demandé a été annulé par le Fablab.",
                        "receiver" : $scope.versions[0].login_edit,
                    }
                    break;
                    case 5 :
                    dataMail = {
                        "subject" : "Fablab : Annulation d'un service",
                        "content" : "Une demande de service \"" + $scope.service.name + "\" a été annulée.",
                        "receiver" : "fablab@assos.utc.fr",
                    }
                    break;
                }
                Mail.send(dataMail);
                $scope.element.status = status;
                $uibModalInstance.close({changedElement : $scope.element});

            })

            
        });

        /**
        *   Sauvegarde des servicdes (avec les fichiers)
        */
        $scope.saveFiles = function(){


            var promises = $scope.element.addedFiles.map(function(file){
                if(file instanceof File){
                    var idPE = $scope.element.id;
                    var url = __ENV.apiUrl + "/purchased/"+idPE+"/file";
                    var fd = new FormData();
                    fd.append('file', file);
                    $http.post(url, fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    });
                }
            })

            return $q.all(promises); 
        }

        
    };

});
