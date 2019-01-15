<?php

use App\Entity;
use Illuminate\Database\Seeder;

/**
 * Created by PhpStorm.
 * User: corentinhembise
 * Date: 07/12/2017
 * Time: 12:09
 */

class EntitiesTableSeeder extends Seeder
{
    public function run()
    {
        $fablab = new Entity([
            "name" => "Fablab UTC",
            "abreviation" => "FA",
            "asso_number" => "W603003228",
            "siren" => "814 497 210",
            "invoice_address" => "Maison des étudiants\nRue Roger Couttolenc\n60200 Compiègne",
            "mail" => "fablab@assos.utc.fr",
            "site" => "http://fablabutc.fr",
            "default" => true,
            "legals" => "Conditions de paiement : paiement à réception de facture, à 30 jours. Aucun escompte consenti pour règlement anticipé. Tout incident de paiement est passible d'intérêt de retard. Le montant des pénalités résulte de l'application aux sommes restant dues d'un taux d'intérêt légal en vigueur au moment de l'incident. Indemnité forfaitaire pour frais de recouvrement due au créancier en cas de retard de paiement : 40€\nAssociation Loi 1901 sous le N° W603003228 à la préfecture de Compiègne - N° Siret 814 497 210\nCatégorie juridique : 9220 Association déclarée",
        ]);
        $fablab->save();

        $uteam = new Entity([
            "name" => "UTeam",
            "abreviation" => "CI",
            "siren" => "342 300 241",
            "invoice_address" => "Centre de Transfert\n66, avenue de Landshut CS10154\n60200 Compiègne",
            "mail" => "contact@uteam.fr",
            "site" => "http://www.uteam.fr",
            "phone" => "03 44 23 45 55",
        ]);
        $uteam->save();
    }
}