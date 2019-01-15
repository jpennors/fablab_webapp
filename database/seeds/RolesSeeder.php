<?php

use App\Permission;
use Illuminate\Database\Seeder;
use App\Role;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $role1 = new Role(['name' => 'Admin']);
        $permissionsIds = DB::table('permissions')->select('id')->pluck('id');
        $role1->save();
        $role1->permissions()->sync($permissionsIds);
        $role1->save();

        $role2 = new Role(['name' => 'Membre FabLab']);
        $permissionsIds = DB::table('permissions')
            ->where('slug', '=', 'login')
            ->orWhere('slug', '=', 'list-user')
            //Adresse
            ->orWhere('slug', '=', 'list-address')
            ->orWhere('slug', '=', 'add-address')
            ->orWhere('slug', '=', 'generate-quotation')
            //Taches
            ->orWhere('slug', '=', 'delete-task')
            ->orWhere('slug', '=', 'list-task')
            ->orWhere('slug', '=', 'add-task')
            ->orWhere('slug', '=', 'edit-task')
            //Purchase
            ->orWhere('slug', '=', 'pay-someone-payutc')
            ->orWhere('slug', '=', 'mark-as-paid')
            ->orWhere('slug', '=', 'order-for-someone')
            ->orWhere('slug', '=', 'order-CAS-member')
            ->orWhere('slug', '=', 'edit-order')
            //Facture & Devis
            ->orWhere('slug', '=', 'delete-invoice')
            ->orWhere('slug', '=', 'edit-invoice')
            ->orWhere('slug', '=', 'list-invoice')
            ->orWhere('slug', '=', 'generate-quotation')
            ->orWhere('slug', '=', 'generate-invoice')
            ->orWhere('slug', '=', 'list-role')
            //Fonction de prix
            ->orWhere('slug', '=', 'list-price')
            //Services
            ->orWhere('slug', '=', 'edit-service')
            ->orWhere('slug', '=', 'list-service')
            ->orWhere('slug', '=', 'add-service')
            ->orWhere('slug', '=', 'delete-service')
            //Products
            ->orWhere('slug', '=', 'add-product')
            ->orWhere('slug', '=', 'edit-product')
            ->orWhere('slug', '=', 'list-product')
            ->orWhere('slug', '=', 'delete-product')
            //Machines
            ->orWhere('slug', '=', 'list-engine')
            ->orWhere('slug', '=', 'add-engine')
            ->orWhere('slug', '=', 'edit-engine')
            ->orWhere('slug', '=', 'delete-engine')
            ->orWhere('slug', '=', 'edit-engine-premission')
            //Documentation
            ->orWhere('slug', '=', 'read-doc')
            //Maitenance
            ->orWhere('slug', '=', 'list-maintenance')
            //Outils
            ->orWhere('slug', '=', 'add-tool')
            ->orWhere('slug', '=', 'edit-tool')
            ->orWhere('slug', '=', 'delete-tool')
            ->orWhere('slug', '=', 'list-tool')
            //Consommables
            ->orWhere('slug', '=', 'add-expendable')
            ->orWhere('slug', '=', 'list-expendable')
            ->orWhere('slug', '=', 'edit-expendable')
            ->orWhere('slug', '=', 'delete-expendable')
            // Rooms
            ->orWhere('slug', '=', 'add-room')
            ->orWhere('slug', '=', 'edit-room')
            ->orWhere('slug', '=', 'delete-room')
            ->orWhere('slug', '=', 'list-room')
            //Wardrobe
            ->orWhere('slug', '=', 'add-wardrobe')
            ->orWhere('slug', '=', 'edit-wardrobe')
            ->orWhere('slug', '=', 'delete-wardrobe')
            ->orWhere('slug', '=', 'list-wardrobe')
            //Export
            ->orWhere('slug', '=', 'list-data')
            ->orWhere('slug', '=', 'export-data')
            //Entités
            ->orWhere('slug', '=', 'list-entity')
            ->orWhere('slug', '=', 'add-entity')
            ->orWhere('slug', '=', 'edit-entity')
            ->orWhere('slug', '=', 'delete-entity')
            ->orWhere('slug', '=', 'change-purchase-entity')
            ->orWhere('slug', '=', 'view-all-entity-purchase')
            ->pluck('id');
        $role2->save();
        $role2->permissions()->sync($permissionsIds);
        $role2->save();

        $role3 = new Role(['name' => "Membre CAS"]);
        $permissionsIds = DB::table('permissions')
            ->where('slug', '=', 'login')
            ->orWhere('slug', '=', 'order-CAS-member')
            ->orWhere('slug', '=', 'list-product')
            ->orWhere('slug', '=', 'list-engine')
            ->orWhere('slug', '=', 'list-tool')
            ->orWhere('slug', '=', 'list-room')
            ->orWhere('slug', '=', 'list-wardrobe')
            ->orWhere('slug', '=', 'list-expendable')
            ->orWhere('slug', '=', 'list-service')
            ->orWhere('slug', '=', 'list-entity')
            ->orWhere('slug', '=', 'change-purchase-entity')
            ->orWhere('slug', '=', 'generate-quotation')
            ->orWhere('slug', '=', 'generate-invoice')
            ->pluck('id');
        $role3->save();
        $role3->permissions()->sync($permissionsIds);
        $role3->save();

    }
}
