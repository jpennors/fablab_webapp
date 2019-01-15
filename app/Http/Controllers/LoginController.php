<?php

namespace App\Http\Controllers;

use App\Exceptions\PayutcException;
use Payutc;
use App\Role;
use Auth;
use Gate;
use Illuminate\Auth\AuthenticationException;
use Request;
use App\Http\Requests;
use App\User;
use App\Member;
use App\Log;

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
        
        \Log::info($payutc->sessionid);
        
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
     *  Retourne le Log associé à un token
     *
     *  @param  $token  string
     */
    private function getLog($token) {
        return Log::where('token', $token)->get()->first();
    }

    /**
     *  Retourne un token
     *
     */
    private function getToken() {
      return bin2hex(random_bytes(78));
    }



    /**
     *  Processus de login: connexion par CAS et génération de token
     *
     */
    public function login() {

        // Adresse vers laquelle on redirige
        $webapp = Request::input('webapp');

        // Ticket CAS
        $ticket = Request::input('ticket');

        // URL transmise au CAS pour la connexion et pour la vérification du ticket
        $service = route('login', ['webapp' => $webapp]);

        // Si l'URL de la webapp n'est pas donnée, on abandonne
        if(!$webapp) {
            return response()->json(array("error" => "400, bad request, webapp URL required"), 400);
        }

        // Si on a pas besoin de se connecter au CAS, on génère un token et un utilisateur provisoire
        if(!env('APP_AUTH', 'true')) {

            // Génération d'un token
            $token = $this->getToken();

            // Fake utilisateur
            $member = new Member(['login' => 'test_'.$token ]);
            $member->role()->associate(Role::where('name', '=', 'Super admin')->firstOrFail());
            $member->save();

            // Log associé
            $log = new Log(['token' => $token, 'CAS' => '']);
            $log->member()->associate($member);
            $log->save();

            $data = array('url' => $webapp.'?token='.$token);
            return response()->json($data);
        
        }

        if(!$ticket) {
            // Si le ticket n'est pas transmis, on donne l'URL vers le CAS
            $url = 'https://cas.utc.fr/cas/login?service='.urlencode($service);
            $data = array('url' => $url);
            return response()->json($data);
        }
        else {
            try {

                $payutc = $this->fetchPayutcSessionId($service, $ticket);
                // On vérifie que le ticket est valide
                #$data = $this->serviceValidate($service, $ticket);


                // Succès de la récupération d'informations du CAS, on récupère les infos qui nous intéressent (=login)
                $login = $payutc['username'];



                $member = $this->getMember($login);

                if(!$member || !$member->hasAccess(['login'])) {

                  /******* A DECOMMENTER POUR EMPECHER LES MEMBRES DU CAS SE CONNECTER *******/
                  $error = array("error" => "401, unauthorized, the CAS user is not an authorized member");
                  return redirect($webapp.'?error=401');

              
                /******* A DECOMMENTER POUR LAISSER LES MEMBRES DU CAS SE CONNECTER *******/

                // On vérifie que l'User n'existe pas déjà
                /*if(User::where('login', $login)->get()->first()) {
                return response()->error("The User already exists, conflict", 409);
                }

                $user = new User();
                $user->login = $login;
                $user->terms     = 0;
                $user->role_id   = 8;

                try {
                $user->save();
                } catch(\Exception $e) {
                return response()->inputError("Can't save the resource", 500);
                }
                $member = $this->getMember($login);*/
            } 

            // L'utilisateur est autorisé. On lui génère un token dans la table Logs
            $token = $this->getToken();
            
            \log::info("sess : ".$payutc['sessionid']);
            
            $log = new Log([
                'token'            =>   $token,
                'CAS'              =>   Request::input('ticket'),
                'payutc_sessionid' =>   $payutc['sessionid'],
            ]);
            $log->member()->associate($member);
            $log->save();

            // Puis on le redirige vers sa webapp, avec le token
            return redirect('/#/login?token='.$token);
            //suite aux nouvelles mesures de Google (CORS)
            //return redirect($webapp.'?token='.$token);

        } catch (AuthenticationException $e) {
           
            return response()->json(array("error" => "401, ".$e->getMessage()), 401);
        
        } catch (PayutcException $e) {
            
            return response()->json(array(
                "error" => "Impossible de s'authentifier avec Payutc. (".$e->getMessage().")",
            ), 400);
        
        }
      }
    }

    /**
     *  Un logout a pour effet de désactiver tous les tokens encore actifs du Member
     *
     */
    public function logout() {

        $member = Auth::user();

        // Désactive tous les token liés à cet user
        $logs = Log::where('user_id', $member->id);
        $logs->update(['disabled' => true]);

        // On donne l'URL du logout CAS
        return response()->json(array("url" => "https://cas.utc.fr/cas/logout"));
   
    }



    /**
     *  Retourne des informations sur l'état de la connexion avec l'API.
     *  Permet de vérifier que le token est toujours valide.
     *
     */
    public function client() {

        // Puisque que cette méthode est sous le couvert du middleware UTCAuth,
        // si on l'atteint c'est que le token est encore valide. On se contente
        // de renvoyer un status 200.

        return response()->success(Auth::user());
    }



    public function clientPermissions()
    {
        $user = Auth::user();
        $role = Role::where('id', $user['role_id'])->with('permissions')->firstOrfail();

        return response()->success($role->permissions()->getResults());
    }
}
