app.controller('roomsEditCtrl', function($scope, object, type, $uibModalInstance, $http, Rooms, $window, ErrorHandler, Helpers, Wardrobes) {
    $scope.room = object;
    $scope.type = type;
    $scope.errors = null;

    // Wardrobes.get({}, function(res){
    //     $scope.wardrobes = res.data;
    //     $scope.selectedWardrobe = res.data.filter((r)=>r.id == $scope.expendable.room_id)[0];
    // }, function(error){
    //     ErrorHandler.alert(error);
    // });



    $scope.$watch("type", () => {
        $scope.show = $scope.type == 'show' || $scope.type == 'view';
        $scope.edit = $scope.type == 'edit' || $scope.type == 'create';
        $scope.canChange = $scope.type == 'view';
        $scope.canDelete = $scope.type == 'edit' || $scope.type == 'view';
    })

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    }


console.log("DEBUT MODALE");




function init_test(room_id) {     // affiche toutes les wardrobes liées à la salle cliquée 
            Wardrobes.get({}, function(res){
                $scope.wardrobes_associate_to_room = res.data.filter((e)=>e.room_id==room_id);  
                console.log(res.data);
            }, function(error){
                ErrorHandler.alert(error);
            });
        }

if($scope.type=='view' || $scope.type=='edit')  
    {
        $scope.room_id=$scope.room.id;  // ID DE LA SALLE  en question
        init_test($scope.room_id);  //affiche les wardrobes liés à la salle
    }

    $scope.delete = function() {
        $uibModalInstance.close({id:$scope.room.id, type:"delete"});
    }

    $scope.save = function() {
        console.log("save");
        $scope.messageError = null;
        $scope.inputErrors = null;
        if($scope.selectedRoom) {
            $scope.room.room_id = $scope.selectedRoom.id;
            $scope.room.roomName = $scope.selectedRoom.name;
        }
        

        if ($scope.type=='edit') 
        {

             // Delete wardrobes selected
            for (id in $scope.wardrobe_id_to_delete)
            {
                Wardrobes.delete({id: $scope.wardrobe_id_to_delete[id]});
                console.log("deleting wardrobe id :"+$scope.wardrobe_id_to_delete[id]);
            }
            
            Rooms.update({id:$scope.room.id}, $scope.room, envoyerImage, gererErreur);
            var Wardrobes_not_updated=[]                
            var Wardrobes_not_created=[]

            for(x in $scope.wardrobes_associate_to_room)                            // update all wardrobes names
            { 
                var name_wardrobe_temp=$scope.wardrobes_associate_to_room[x].name // temp name of the wardrobe
                if(name_wardrobe_temp)                                             
                {
                    var regex_wardrobes =name_wardrobe_temp.match(/[a,c][0-9]n[0-9]+/)   // regex expression for wardrobes if null there is an error
                }
                if(regex_wardrobes)
                {
                Wardrobes.update({id:$scope.wardrobes_associate_to_room[x].id},$scope.wardrobes_associate_to_room[x]); 
                //console.log("update",name_wardrobe_temp, "réussie");
                }
                else
                {
                    Wardrobes_not_updated.push(name_wardrobe_temp)
                    console.log("update",name_wardrobe_temp, "échouée");
                }
            }

            
            console.log("Création et ajout de wardrobes");
            var wardrobe_new = document.getElementsByName("new_wardrobes_to_create");  // liste of inputs that contains new wardrobes
            for (i in wardrobe_new)  
            {   
                if(wardrobe_new[i].value)
                {
                    var regex_wardrobes =wardrobe_new[i].value.match(/[a,c][0-9]n[0-9]+/)   // regex expression for wardrobes 
                    console.log( regex_wardrobes)
                    if(regex_wardrobes)  //not null meaning regex is correct
                    {
                        Wardrobes.save({name:wardrobe_new[i].value,room_id:$scope.room.id},gererErreur);
                        console.log("Wardrobe "+wardrobe_new[i].value+" ajoutée");
                    }
                    else
                        { 
                            Wardrobes_not_created.push(wardrobe_new[i].name)
                            console.log("Echec de l'ajout "+wardrobe_new[i].value);
                        }
                }
            }

           
        }
        // create a new room
        else if($scope.type=='create') {
            Rooms.save({}, $scope.room, envoyerImage, gererErreur);

        }
    } 

// Ajouter une nouvelle armoire
$scope.inputs = [];
$scope.moreInputs = function()
    {
    console.log('added an input');
    $scope.inputs.push(0);
}


// Saving wardrobes to delete
$scope.text_button=[] // Text to print for the user so he knows if it will be deleted
$scope.wardrobe_id_to_delete=[]; // list of wardrobes id to delete 
$scope.Delete_button = function(id_wardrobe){

    var id_of_tab=$scope.wardrobe_id_to_delete.indexOf(id_wardrobe);

    if($scope.wardrobe_id_to_delete.indexOf(id_wardrobe) == -1)
    {
        $scope.wardrobe_id_to_delete.push(id_wardrobe); //add item to the delete list
        $scope.text_button[id_wardrobe]="Oui";
    }
    else
    {
        $scope.wardrobe_id_to_delete.splice($scope.wardrobe_id_to_delete.indexOf(id_of_tab),1);  //remove item if you want to cancel the delete
        $scope.text_button[id_wardrobe]="Non";
    }
}

$scope.text_button_2=[] // Text to print for the user so he knows if it will be modified
$scope.wardrobe_id_to_modify=[]; // list of wardrobes id to modify 
$scope.Modify_button = function(id_wardrobe){

    var id_of_tab=$scope.wardrobe_id_to_modify.indexOf(id_wardrobe);

    if($scope.wardrobe_id_to_modify.indexOf(id_wardrobe) == -1)
    {
        $scope.wardrobe_id_to_modify.push(id_wardrobe); //add item to the delete list
        $scope.text_button_2[id_wardrobe]="Oui";
    }
    else
    {
        $scope.wardrobe_id_to_modify.splice($scope.wardrobe_id_to_modify.indexOf(id_of_tab),1);  //remove item if you want to cancel the delete
        $scope.text_button_2[id_wardrobe]="Non";
    }
}

    var envoyerImage = function(res) {
        // Si on viens de créer un consommable, on récupère l'id de l'objet créé
        if(res.meta.status == 201) {
            $scope.room.id = res.data.newId;
        }
            $uibModalInstance.close({changedRoom:$scope.room, type:$scope.type});
    }

    var gererErreur = function(error) {
        if(error.status == 422) {
            $scope.inputErrors = error.data.data;
        }
        else if(error.status == 409) {
            $scope.messageError = "Une salle avec le même nom existe déjà";
        }

    }
});
