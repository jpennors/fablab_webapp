<?php

namespace App\Http\Controllers;

use App\Exceptions\PayutcException;
use Payutc;
use App\Role;
use Auth;
use Illuminate\Auth\AuthenticationException;
use Request;
use App\User;
use App\Member;
use JWTFactory;
use JWTAuth;

class LoginController extends Controller
{


    /**
     *  Interroge le CAS pour vérifier si un ticket est valide, retourne le succès ou non
     *
     *  @param  $service  string
     *  @param  $ticket  string
     *  @return \SimpleXMLElement returns the CAS response
     *  @throws AuthenticationException
     */
    private function serviceValidate($service, $ticket) {

        $url = 'https://cas.utc.fr/cas/serviceValidate?service='.urlencode($service).'&ticket='.$ticket;
        $xml = simplexml_load_file($url);
        $data = $xml->children('cas', true);

        if(isset($data->authenticationSuccess)) {
            return $data->authenticationSuccess;
        }
        else {
            throw new AuthenticationException($data->authenticationFailure);
        }

    }


    /**
     * @param $service
     * @param $ticket
     * @return array returns the sessionid fetch from payutc
     * @throws PayutcException
     */
    public function fetchPayutcSessionId($service, $ticket) {
        
        $payutc = Payutc::loginCas2($ticket, $service);
                
        return [
            'username'  => $payutc->username,
            'sessionid' => $payutc->sessionid,
        ];
    
    }



    /**
     * Retourne le Member associé à un login
     *
     * @param  $login  string
     * @return User
     */
    public function getMember($login) {
        return Member::where('login', $login)->get()->first();
    }



    /**
     *  Processus de login: connexion par CAS et génération de token
     *
     */
    public function login(Request $request) {

        // Adresse vers laquelle on redirige
        $webapp = Request::input('webapp');

        // Récupération ticket CAS
        $ticket = Request::input('ticket');

        // Récupération du service (URL de Redirection)
        $service = route('login', ['webapp' => $webapp]);

        if (!$ticket) {

            // Si le ticket n'est pas transmis, on donne l'URL vers le CAS
            $url = config('auth.services.cas.url').'login?service='.urlencode($service);
            
            $data = array('url' => $url);
            return response()->json($data);
        
        } else {
            try {

                // Récupération username + session_id
                $payutc = $this->fetchPayutcSessionId($service, $ticket);

                // Succès de la récupération d'informations du CAS, on récupère les infos qui nous intéressent (login & sessionid payutc)
                $login = $payutc['username'];
                $sessionid = $payutc['sessionid'];

                $member = $this->getMember($login);

                if(!$member || !$member->hasAccess(['login'])) {

                      /******* A DECOMMENTER POUR EMPECHER LES MEMBRES DU CAS SE CONNECTER *******/
                      // $error = array("error" => "401, unauthorized, the CAS user is not an authorized member");
                      // return redirect($webapp.'?error=401');

                  
                    /******* CONNECTION MEMBRE CAS *******/

                    if (env('APP_ENV') == 'production'){

                        // On vérifie que l'User n'existe pas déjà
                        if(User::where('login', $login)->get()->first()) {
                            return response()->error("The User already exists, conflict", 409);
                        }

                        $user = new User();
                        $user->login = $login;
                        $user->terms     = 0;
                        $user->role_id   = 3;

                        try {
                            $user->save();
                        } catch(\Exception $e) {

                            \Log::error("Connexion -> Création MembreCAS, message : ".$e->getMessage());
                            return response()->inputError("Can't save the resource", 500);
                        
                        }
                        $member = $this->getMember($login);

                        \log::info("Connexion -> Création MembreCAS : ".$member->firstName.' '.$member->lastName);
                    }
                } 
                
                \log::info("Connexion -> ".$member->firstName.' '.$member->lastName.', session_id : '.$payutc['sessionid']);

                // Create a token
                $payload = JWTFactory::user_id($member->id)->session_id($sessionid)->make();
                $token = JWTAuth::encode($payload);

                // Puis on le redirige vers sa webapp, avec le token
                return redirect('/#/login?token='.$token);
                //return redirect($webapp.'?token='.$token);

            } catch (AuthenticationException $e) {
               
                \Log::error("Connexion -> Erreur AuthenticationException, message : ".$e->getMessage());

                return response()->json(array("error" => "401, ".$e->getMessage()), 401);
            
            } catch (PayutcException $e) {

                \Log::error("Connexion -> Erreur PayutcException, message : ".$e->getMessage());
                
                return response()->json(array(
                    "error" => "Impossible de s'authentifier avec Payutc. (".$e->getMessage().")",
                ), 400);
            
            }
        }


        
    }


    // /**
    //  *  Un logout a pour effet de désactiver tous les tokens encore actifs du Member
    //  *
    //  */
    public function logout() {

        // On donne l'URL du logout CAS
        return response()->json(array("url" => config('auth.services.cas.url').'logout'));
   
    }



    // /**
    //  *  Retourne des informations sur l'état de la connexion avec l'API.
    //  *  Permet de vérifier que le token est toujours valide.
    //  *
    //  */
    public function client() {

        // Puisque que cette méthode est sous le couvert du middleware UTCAuth,
        // si on l'atteint c'est que le token est encore valide. On se contente
        // de renvoyer un status 200.
        $data = Auth::user();
        return response()->success($data);
    }



    public function clientPermissions()
    {
        $user = Auth::user();
        $role = Role::where('id', $user['role_id'])->with('permissions')->firstOrfail();

        return response()->success($role->permissions()->getResults());
    }
}
