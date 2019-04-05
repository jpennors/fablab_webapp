<?php

use Illuminate\Database\Seeder;
use App\Engine;

class EnginesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
      public function run()
      {
            if (env('APP_ENV') != 'production') {
                  
                  $e = new Engine();
                  $e->name = "Imprimante XcFV4000";
                  $e->description = "Constituendi autem sunt qui sint in amicitia fines et quasi termini diligendi. De quibus tres video sententias ferri, quarum nullam probo, unam, ut eodem modo erga amicum adfecti simus, quo erga nosmet ipsos, alteram, ut nostra in amicos benevolentia illorum erga nos benevolentiae pariter aequaliterque respondeat, tertiam, ut, quanti quisque se ipse facit, tanti fiat ab amicis.";
                  $e->picture = NULL;
                  $e->room_id = 1;
                  $e->status = "En utilisation";
                  $e->documentation ="www.engines.documentation.fr";
                  $e->dataSheet = NULL;
                  $e->save();

                  $e = new Engine();
                  $e->name = "Decoupeuse Laser";
                  $e->description = "Constituendi autem sunt qui sint in amicitia fines et quasi termini diligendi. De quibus tres video sententias ferri, quarum nullam probo, unam, ut eodem modo erga amicum adfecti simus, quo erga nosmet ipsos, alteram, ut nostra in amicos benevolentia illorum erga nos benevolentiae pariter aequaliterque respondeat, tertiam, ut, quanti quisque se ipse facit, tanti fiat ab amicis.";
                  $e->picture = NULL;
                  $e->room_id = 2;
                  $e->status = "Disponible";
                  $e->documentation = "www.engines.documentation.fr";
                  $e->dataSheet = NULL;
                  $e->save();

                  $e = new Engine();
                  $e->name = "Ponceuse XT3000";
                  $e->description = "Constituendi autem sunt qui sint in amicitia fines et quasi termini diligendi. De quibus tres video sententias ferri, quarum nullam probo, unam, ut eodem modo erga amicum adfecti simus, quo erga nosmet ipsos, alteram, ut nostra in amicos benevolentia illorum erga nos benevolentiae pariter aequaliterque respondeat, tertiam, ut, quanti quisque se ipse facit, tanti fiat ab amicis.";
                  $e->picture = NULL;
                  $e->room_id = 3;
                  $e->status = "En reparation";
                  $e->documentation = "www.engines.documentation.fr";
                  $e->dataSheet = NULL;
                  $e->save();

                  $e = new Engine();
                  $e->name = "Imprimante XcFV4000";
                  $e->description = "Constituendi autem sunt qui sint in amicitia fines et quasi termini diligendi. De quibus tres video sententias ferri, quarum nullam probo, unam, ut eodem modo erga amicum adfecti simus, quo erga nosmet ipsos, alteram, ut nostra in amicos benevolentia illorum erga nos benevolentiae pariter aequaliterque respondeat, tertiam, ut, quanti quisque se ipse facit, tanti fiat ab amicis.";
                  $e->picture = NULL;
                  $e->room_id = 1;
                  $e->status = "En utilisation";
                  $e->documentation = "www.engines.documentation.fr";
                  $e->dataSheet = NULL;
                  $e->save();

                  $e = new Engine();
                  $e->name = "Decoupeuse Laser";
                  $e->description = "Constituendi autem sunt qui sint in amicitia fines et quasi termini diligendi. De quibus tres video sententias ferri, quarum nullam probo, unam, ut eodem modo erga amicum adfecti simus, quo erga nosmet ipsos, alteram, ut nostra in amicos benevolentia illorum erga nos benevolentiae pariter aequaliterque respondeat, tertiam, ut, quanti quisque se ipse facit, tanti fiat ab amicis.";
                  $e->picture = NULL;
                  $e->room_id = 2;
                  $e->status = "Disponible";
                  $e->documentation = "www.engines.documentation.fr";
                  $e->dataSheet = NULL;
                  $e->save();

                  $e = new Engine();
                  $e->name = "Ponceuse XT3000";
                  $e->description = "Constituendi autem sunt qui sint in amicitia fines et quasi termini diligendi. De quibus tres video sententias ferri, quarum nullam probo, unam, ut eodem modo erga amicum adfecti simus, quo erga nosmet ipsos, alteram, ut nostra in amicos benevolentia illorum erga nos benevolentiae pariter aequaliterque respondeat, tertiam, ut, quanti quisque se ipse facit, tanti fiat ab amicis.";
                  $e->picture = NULL;
                  $e->room_id = 3;
                  $e->status = "En reparation";
                  $e->documentation = "www.engines.documentation.fr";
                  $e->dataSheet = "Constituendi autem sunt qui sint in amicitia fines et quasi termini diligendi. De quibus tres video sententias ferri, quarum nullam probo, unam, ut eodem modo erga amicum adfecti simus, quo erga nosmet ipsos, alteram, ut nostra in amicos benevolentia illorum erga nos benevolentiae pariter aequaliterque respondeat, tertiam, ut, quanti quisque se ipse facit, tanti fiat ab amicis.";
                  $e->save();

                  $e = new Engine();
                  $e->name = "Imprimante XcFV4000";
                  $e->description = "Constituendi autem sunt qui sint in amicitia fines et quasi termini diligendi. De quibus tres video sententias ferri, quarum nullam probo, unam, ut eodem modo erga amicum adfecti simus, quo erga nosmet ipsos, alteram, ut nostra in amicos benevolentia illorum erga nos benevolentiae pariter aequaliterque respondeat, tertiam, ut, quanti quisque se ipse facit, tanti fiat ab amicis.";
                  $e->picture = NULL;
                  $e->room_id = 1;
                  $e->status = "En utilisation";
                  $e->documentation = "www.engines.documentation.fr";
                  $e->dataSheet = "Constituendi autem sunt qui sint in amicitia fines et quasi termini diligendi. De quibus tres video sententias ferri, quarum nullam probo, unam, ut eodem modo erga amicum adfecti simus, quo erga nosmet ipsos, alteram, ut nostra in amicos benevolentia illorum erga nos benevolentiae pariter aequaliterque respondeat, tertiam, ut, quanti quisque se ipse facit, tanti fiat ab amicis.";
                  $e->save();

                  $e = new Engine();
                  $e->name = "Decoupeuse Laser";
                  $e->description = "Constituendi autem sunt qui sint in amicitia fines et quasi termini diligendi. De quibus tres video sententias ferri, quarum nullam probo, unam, ut eodem modo erga amicum adfecti simus, quo erga nosmet ipsos, alteram, ut nostra in amicos benevolentia illorum erga nos benevolentiae pariter aequaliterque respondeat, tertiam, ut, quanti quisque se ipse facit, tanti fiat ab amicis.";
                  $e->picture = NULL;
                  $e->room_id = 2;
                  $e->status = "Disponible";
                  $e->documentation = "www.engines.documentation.fr";
                  $e->dataSheet = "Constituendi autem sunt qui sint in amicitia fines et quasi termini diligendi. De quibus tres video sententias ferri, quarum nullam probo, unam, ut eodem modo erga amicum adfecti simus, quo erga nosmet ipsos, alteram, ut nostra in amicos benevolentia illorum erga nos benevolentiae pariter aequaliterque respondeat, tertiam, ut, quanti quisque se ipse facit, tanti fiat ab amicis.";
                  $e->save();

                  $e = new Engine();
                  $e->name = "Ponceuse XT3000";
                  $e->description = "Constituendi autem sunt qui sint in amicitia fines et quasi termini diligendi. De quibus tres video sententias ferri, quarum nullam probo, unam, ut eodem modo erga amicum adfecti simus, quo erga nosmet ipsos, alteram, ut nostra in amicos benevolentia illorum erga nos benevolentiae pariter aequaliterque respondeat, tertiam, ut, quanti quisque se ipse facit, tanti fiat ab amicis.";
                  $e->picture = NULL;
                  $e->room_id = 3;
                  $e->status = "En reparation";
                  $e->documentation = "www.engines.documentation.fr";
                  $e->dataSheet = "Constituendi autem sunt qui sint in amicitia fines et quasi termini diligendi. De quibus tres video sententias ferri, quarum nullam probo, unam, ut eodem modo erga amicum adfecti simus, quo erga nosmet ipsos, alteram, ut nostra in amicos benevolentia illorum erga nos benevolentiae pariter aequaliterque respondeat, tertiam, ut, quanti quisque se ipse facit, tanti fiat ab amicis.";
                  $e->save();

            }

    }
}
