/**
 *  Factory liée à la ressource Mail
 */

app.factory('Mail',function($http){
	return {

		demande_envoyée : function(email, num_commande){
			dataMail = {
                "subject" : "FablabUTC n° " + num_commande + " : Confirmation commande",
                "content" :"Votre commande a bien été enregistrée. Vous recevrez très prochainement un mail pour vous indiquer les démarches à réaliser. Vous pouvez consulter votre demande sur le site de gestion : gestion.fablabutc.fr dans la rubrique \"Commandes\" / \"Mes commandes\".",
                "receiver" : email,
            }
            this.send(dataMail)

            // Plus envoie d'un email au Fablab
            dataMailFablab = {
                "subject" : "FablabUTC n° " + num_commande + " : Demande de service",
                "content" :"Une nouvelle commande a été réalisée.",
                "receiver" : "fablabutc@gmail.com",
            }
            this.send(dataMailFablab)
		},

		demande_modifiée : function(email, service, num_commande){
			dataMail = {
                "subject" : "FablabUTC n° " + num_commande + " : Confirmation modification service",
                "content" : "Votre demande de service \"" + service.name + "\" a bien été modifiée.",
                "receiver" : email,
            }
            this.send(dataMail)

            // Plus envoie d'un email au Fablab
            dataMailFablab = {
                "subject" : "FablabUTC n° " + num_commande + " : Demande de service",
                "content" : "Une demande de service \"" + service.name + "\" a été modifiée par un client et demande une nouvelle validation.",
                "receiver" : "fablabutc@gmail.com",
            }
            this.send(dataMailFablab)
		},

		validation_fablab : function(email, service, num_commande){
			 dataMail = {
                "subject" : "FablabUTC n° " + num_commande + " : Validation de votre commande",
                "content" : "Le service \"" +  service.name +"\" a été complété et validé par le Fablab. Vous pouvez aller dès à présent le confirmer pour qu'il soit mis en production. Pour le confirmer, vous devez tout d'abord vous rendre sur le site de gestion: gestion.fablabutc.fr. Dans la rubrique, \"Commandes\" / \"Mes commandes\", vous trouverez votre commande. Il vous faudra vous rendre dans la commande et cliquer sur le service correspondant. Une modale s'ouvrira alors et vous pourrez indiquer \"Valider\" si cela vous convient. Vous avez également la possibilité d'éditer le service. Toute modification entraînera une nouvelle validation du Fablab.",
                "receiver" : email,
            }
            this.send(dataMail)
		},

		validation_client : function(email, service, num_commande){
			dataMail = {
                "subject" : "FablabUTC n° " + num_commande + " : Confirmation modification service",
                "content" : "Votre demande de service \"" + service.name + "\" a bien été modifiée.",
                "receiver" : email,
            }
            this.send(dataMail)

			dataMailFablab = {
                "subject" : "FablabUTC n° " + num_commande + " : Validation d'un service",
                "content" : "Une demande de service \"" + service.name + "\" a été validée par un client et peut être mise en production.",
                "receiver" : "fablabutc@gmail.com",
            }
            this.send(dataMailFablab)
		},

		realisation : function(email, service, num_commande){
			dataMail = {
                "subject" : "FablabUTC n° " + num_commande + " : Service réalisé",
                "content" : "Votre service \"" + service.name + "\" est prêt. Vous pouvez dès à présent venir le récupérer au Fablab.",
                "receiver" : email,
            }
            this.send(dataMail)
		},

		annulation_fablab : function(email, service, num_commande){
			dataMail = {
                "subject" : "FablabUTC n° " + num_commande + " : Annulation de votre service",
                "content" : "Le service \"" + service.name + "\" que vous avez demandé a été annulé par le Fablab.",
                "receiver" : email,
            }
            this.send(dataMail)
		},

		annulation_client : function(email, service, num_commande){
			dataMail = {
                "subject" : "FablabUTC n° " + num_commande + " : Annulation d'un service",
                "content" : "Une demande de service \"" + service.name + "\" a été annulée.",
                "receiver" : "fablabutc@gmail.com",
            }
            this.send(dataMail)
		},

		send : function(dataMail){

			$http({
				method : 'POST',
				url : __ENV.apiUrl + "/send",
				headers : {
          			'Content-Type': 'application/json'
        		},
        		data : dataMail,
			});
		}
	}
});
