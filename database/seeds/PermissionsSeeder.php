<?php

use Illuminate\Database\Seeder;
use App\Permission;

class PermissionsSeeder extends Seeder
{
    /**
    * Run the database seeds.
    *
    * @return void
    */
    public function run()
    {
        $permissions = [
            'super-admin' => 'Super permission',
            'login'       => 'Se connecter au site de gestion',

            // Users
            'edit-user'   => 'Modifier un utilisateur',
            'list-user'   => 'Lister les utilisateurs',
            'add-user'    => 'Ajouter un utilisateur',
            'delete-user' => 'Supprimer un utilisateur',

            //Tasks
            'delete-task'   =>  'Supprimer une tâche',
            'list-task'     =>  'Lister les tâches',
            'add-task'     =>  'Ajouter une tâche',
            'edit-task'     =>  'Editer une tâche',


            // Purchases
            'pay-someone-payutc' => 'Effectuer un paiement à un utilisateur avec Payutc',
            'mark-as-paid'       => 'Marquer une commande payée',
            'order-for-someone'  => 'Effectuer une commande pour un utilisateur',
            'order-CAS-member'   => 'Effectuer une commande en tant que membre CAS',
            'edit-order'         => 'Editer une commande',
            'change-purchase-entity' => "Commander depuis différentes entitées",
            'view-all-entity-purchase' => "Voir les commandes de toutes les entités",

            // Invoices
            'edit-invoice'       => 'Modifier une facture',
            'list-invoice'       => 'Lister les factures',
            'generate-quotation' => 'Génerer un devis',
            'delete-invoice' => 'Supprimer une facture',
            'generate-invoice' => "Générer des factures",

            // Admin
            'edit-administrative' => "Modifier les paramètres de l'application",
            'list-administrative' => "Lister les paramètres de l'application",
            'edit-administrative' => "Ajouter un paramètre a l'application",
            'delete-administrative' => "Supprimer les paramètres de l'application",

            // Roles
            'edit-role'   => 'Modifier un rôle',
            'list-role'   => 'Lister les rôles',
            'add-role'    => 'Ajouter un rôle',
            'delete-role' => 'Supprimer un rôle',

            // Prices
            'edit-price'   => 'Modifier une fonction de prix',
            'list-price'   => 'Lister les fonctions de prix',
            'add-price'    => 'Ajouter une fonction de prix',
            'delete-price'  =>  'Supprimer une fonction de prix',

            // Services
            'edit-service'   => 'Modifier un service',
            'list-service'   => 'Lister les services',
            'add-service'    => 'Ajouter un service',
            'delete-service' => 'Supprimer un service',

            // Products
            'edit-product'   => 'Modifier un produit',
            'list-product'   => 'Lister les produits',
            'add-product'    => 'Ajouter un produit',
            'delete-product' => 'Supprimer un produit',

            // Engine
            'edit-engine'   => 'Modifier une machine',
            'list-engine'   => 'Lister les machines',
            'add-engine'    => 'Ajouter une machine',
            'delete-engine' => 'Supprimer une machine',
            'edit-engine-permission' => "Modifier les permissions d'une machine",

            //Documentation
            'read-doc'      => 'Lire la documentation',

            //Maintenance
            'list-maintenance'  => 'Lister les mainteannces',

            // Tools
            'edit-tool'   => 'Modifier un outil',
            'list-tool'   => 'Lister les outils',
            'add-tool'    => 'Ajouter un outil',
            'delete-tool' => 'Supprimer un outil',

            // Rooms
            'edit-room'   => 'Modifier une salle',
            'list-room'   => 'Lister les salles',
            'add-room'    => 'Ajouter une salle',
            'delete-room' => 'Supprimer une salle',

            // Wardrobes
            'edit-wardrobe'   => 'Modifier une armoire',
            'list-wardrobe'   => 'Lister les armoires',
            'add-wardrobe'    => 'Ajouter une armoire',
            'delete-wardrobe' => 'Supprimer une armoire',

            // Permissions
            'edit-permission'   => 'Modifier une permission',
            'list-permission'   => 'Lister les permissions',
            'add-permission'    => 'Ajouter une permission',
            'delete-permission' => 'Supprimer une permission',

            // Consommables
            'edit-expendable'   => 'Modifier un consommable',
            'list-expendable'   => 'Lister les consommables',
            'add-expendable'    => 'Ajouter un consommable',
            'delete-expendable' => 'Supprimer un consommable',

            //Export & Import
            'list-data' =>  "Accéder a la page d'import/export",
            'export-data'   => 'Exporter les données de base',
            'export-super-data' =>  'Exporter des données sensibles',
            'import-data'   =>  'Importer des données de base',
            'import-super-data' =>  'Importer des données sensibles',

            //Adresse
            'edit-address'   => 'Modifier une adresse',
            'list-address'   => 'Lister les adresses',
            'add-address'    => 'Ajouter une adresse',
            'delete-address' => 'Supprimer une adresse',

            //Entité
            'edit-entity'   => 'Modifier une entité',
            'list-entity'   => 'Lister les entités',
            'add-entity'    => 'Ajouter une entité',
            'delete-entity' => 'Supprimer une entité',

            // Badgeage des étudiants
            'edit-student_badge'   => 'Modifier un badgeage étudiant',
            'list-student_badge'   => 'Lister les badgeages étudiants',
            'add-student_badge'    => 'Ajouter un badgeage étudiant',
            'delete-student_badge' => 'Supprimer un badgeage étudiant',

            //Engine Parts
            'edit-engine-part'   => 'Modifier une machine',
            'list-engine-part'   => 'Lister les machines',
            'add-engine-part'    => 'Ajouter une machine',
            'delete-engine-part' => 'Supprimer une machine',
            'edit-engine-part-permission' => "Modifier les permissions d'une machine",


        ];

        foreach ($permissions as $slug => $description) {
            $perm = new Permission(['slug' => $slug, 'description' => $description]);
            $perm->save();
        }
    }
}
