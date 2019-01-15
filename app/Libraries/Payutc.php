<?php
namespace App\Libraries;
use App\Product;
use Curl;
use Exception;
use App\Exceptions\PayutcException;
use App\Transaction;
use Log;
use Illuminate\Support\Facades\Mail;
use Auth;

class Payutc
{
    protected $api_url;
    protected $app_key;
    protected $fun_id;
    protected $proxy;
    protected $sessionId;
    protected $systemId;
    private $activate;
    private $categObjId;
    private $categServiceId;

    public function __construct($apiUrl, $appKey, $funId, $categObjId, $categServiceId, $activate, $proxy = null, $systemId = 'payutc') {
        $this->api_url    = $apiUrl;
        $this->app_key    = $appKey;
        $this->fun_id     = $funId;
        $this->proxy      = $proxy;
        $this->systemId   = $systemId;
        $this->activate   = $activate;
        $this->categObjId = $categObjId;
        $this->categServiceId=$categServiceId;
    }

    public function payBadgeuse($badge_id, $objects)
    {
        
        $this->checkSessionId();

        $name = 'Commande Fablab #' . time();

        // Activate correspond à la variable d'env NEOMPAY_ACTIVATE
        // On ne fait pas de paiement si elle est désactivée
        if(!$this->activate) {
            return new Transaction([
                'name' => "Fake $name",
            ]);
        }

        // On vérifie qu'il existe bien un sessionId lié à l'utilisateur
        $this->checkSessionId();

        // Paiement via Nemopay
        $res = $this->request('POSS3', 'transaction', [
            'fun_id' => $this->fun_id,
            'obj_ids' => json_encode($objects),
            'badge_id' => $badge_id,
        ]);

        // On créé une nouvelle transaction en bdd qu'on renvoie
        return new Transaction([
            'name' => $name,
            'payutc_id' => $res->transaction_id,
            'session_id' => $this->sessionId,
            'paid'  => true,
        ]);


    }

    public function payCard($objects, $return_url)
    {
        
        
        $name = 'Commande Fablab #' . time();

        // On vérifie qu'il existe bien un sessionId lié à l'utilisateur
        $this->checkSessionId();

        $res = $this->request('WEBSALE', 'createTransaction', [
            'fun_id'    => $this->fun_id,
            'items'     => json_encode($objects),
            'mail'      => Auth::user()['email'],
            'return_url'    =>  $return_url
        ]);

        // On créé un objet transaction qu'on renvoie
        return [
            'name' => $name,
            'payutc_id' => $res->tra_id,
            'session_id' => $this->sessionId,
            'url'   =>  $res->url
        ];

    }


    // Obtenir un tableau des ids des services (0.01€, 0.10€, 1.00€ et 10.00€) avec les quantités en fonction du prix
    public function getServicesElement($purchase)
    {
        // Récupération des différents ids des prix des services
        // 10€
        $service_1000_id = env('NEMOPAY_SERVICE_PRICE_1000_ID');
        // 1€
        $service_0100_id = env('NEMOPAY_SERVICE_PRICE_0100_ID');
        // 0.10€
        $service_0010_id = env('NEMOPAY_SERVICE_PRICE_0010_ID');
        // 0.01€
        $service_0001_id = env('NEMOPAY_SERVICE_PRICE_0001_ID');

        // On récupère le prix en centimes
        $price = $purchase->totalPriceInt * 100;

        // Division par 1000 ppur obtenir le nombre de fois 10€
        $service_1000_qt = floor($price/1000);
        // Division par 100 après avoir retiré $service_1000_qt * 10€ pour obtenir le nombre de fois 1€
        $service_0100_qt = floor(($price-$service_1000_qt*1000)/100);
        // Division par 100 après avoir retiré $service_1000_qt * 10€ + $service_0100_qt * 1€
        // pour obtenir le nombre de fois 0.1€
        $service_0010_qt = floor(($price-($service_1000_qt*1000+$service_0100_qt*100))/100);
        // Division par 100 après avoir retiré $service_1000_qt * 10€ + $service_0100_qt * 1€ + $service_0010_qt * 0.1€
        //pour obtenir le nombre de fois 0.01€
        $service_0001_qt = floor(($price-($service_1000_qt*1000+$service_0100_qt*100+$service_0010_qt*10))/100);

        //Création à envoyer pour la création de la transaction
        $items = "[[".$service_1000_id.",".$service_1000_qt."],[".$service_0100_id.",".$service_0100_qt."],[".$service_0010_id.",".$service_0010_qt."],[".$service_0001_id.",".$service_0001_qt."]]";

        return $items;

    }

    public function getTransactionInfo(){

        // Récupération de la dernière transaction effectuée avec la sessionid
        $transaction = Transaction::where('session_id', $this->sessionId)->get()->last();

        if (!$transaction) {
            return null;
        }

        // Demande des informations de la transaction à Nemopay
        $info = $this->request('WEBSALE', 'getTransactionInfo', [
            'fun_id' => $this->fun_id,
            'tra_id' => $transaction->payutc_id,
        ]);

        // Si la transaction est validée et qu'elle n'est pas encore notée comme validée en bdd, on l'enregistre
        if (!$transaction->paid && $info->status == 'V') {

            // Envoie d'un mail
            $content = "Votre commande a bien été réglée.";
            $subject = "Confirmation Paiement";
            $receiver = Auth::user()['email'];

            Mail::send('mail',['content' => $content], function($message) use ($subject, $receiver) {
                $message->to($receiver);
                $message->from('gestionfablab@gmail.com');
                $message->subject($subject);
            });

            $transaction->paid = true;
            $transaction->save();
        }

        return $info;

    }


    // On vérifie qu'il existe bien un sessionId lié à l'utilisateur
    public function checkSessionId(){
        
        if (!$this->sessionId) {
            // Expiration sessionId
            throw new PayutcException("Votre session a expiré, vous allez être reconnecté.", 498);
        }
    }

    /**
     * @return string
     */
    public function getSessionid()
    {
        return $this->sessionId;
    }

    /**
     * @param mixed $sessionId
     */
    public function setSessionId($sessionId)
    {
        $this->sessionId = $sessionId;
    }

    /**
     * @return void
     * @throws PayutcException
     */
    public function loginApp() {
        $response = $this->request('ServiceBase', 'loginApp', [
            'key' => $this->app_key,
        ]);

        $this->sessionId = $response->sessionid;
    }

    /**
     * @param $ticket
     * @param $service
     * @return mixed
     * @throws PayutcException
     */
    public function loginCas2($ticket, $service) {
        $response = $this->request('TRESO', 'loginCas2', [
            'ticket' => $ticket,
            'service' => $service,
        ], false);
        return $response;
    }


    /**
     * Create or update a product
     * @param $name
     * @param array $data
     * @return mixed
     * @throws PayutcException
     */
    public function setProduct($name, $data = [])
    {

        /**
        *       Partie 1 : Récupération de l'id de la catégorie de l'élément
        */

        //Par défaut on met l'id d'un service
        $categObjId = $this->categServiceId;

        // Si l'élement est un produit on cherche l'id de sa catégorie
        if ($data['categObj'] && $data['categObj']!="Service"){ 

                // Récupération des catégories Payutc
                $categsWeeze = $this->getCategories();

                //On parcourt toutes les categories récupérées
                foreach ($categsWeeze as $categWeeze) {

                    //Si l'une des catégories sur Weeze matche avec la catégorie de l'objet 
                    if($categWeeze->name == $data['categObj'])
                        //On affecte l'id Weeze de la catégorie
                        $categObjId=$categWeeze->id;
                }
        }

        // Ajout de l'id de la catégorie, du nom et de la fondation
        $data = array_merge([
            'name' => $name,
            'parent' => $categObjId,
            'fun_id' => $this->fun_id,
        ], $data);


        /**
        *       Partie 2 : Récupération de l'id de l'objet si déjà existant
        */        

        // Récupération des produits sur l'interface WeezeEvent

        $products = $this->request('POSS3', 'getArticles', ['fun_id' => $this->fun_id]);
        // dd($res);
        // $products = $this->request('GESSALES', 'getProducts', $data);

        // Parcourt de tous les produits
        foreach ($products as $product) {

            //Si le nom est identique, on récupère son ID que l'on place dans l'objet data
            if($product->name == $data['name'] && $product->categorie_id == $data['parent'])
            {  
                $data = array_merge([
                    'obj_id' => $product->id,
                ], $data); 
                break;          
            }
        }


        /**
        *       Partie 3 : Création ou édition de l'élément sur Weeze
        */
    
        $res=null;

        /* Requête avec 2 issues possibles :
        On a trouvé un ID correspondant, dans ce cas la requête met a jour le produit (notamment son prix si besoin)
        On a pas d'ID, dans ce cas on crée le produit sur l'interface*/    
        $res = $this->request('GESARTICLE', 'setProduct', $data);

        // L'attribut success de res contient l'id de l'élément (après création ou édition)
        return $res->success;   

    }

    /**
     * Delete a product
     * @param $id
     * @return mixed
     * @throws PayutcException
     */
    public function deleteProduct($id)
    {
        $res = $this->request('GESARTICLE', 'deleteProduct', [
            'obj_id' => $id,
            'fun_id' => $this->fun_id,
        ]);

        return $res->success;
    }

    public function getCategories()
    {
        $data = $this->request('POSS3', 'getCategories', [
            'fun_id' => $this->fun_id
        ]);

    return $data;
    }



        /**
     * @param $service Payutc service, @see https://apidoc.nemopay.net/Services_List/
     * @param $action Payutc action
     * @param array $data Data of the request
     * @param bool $includeAppKey if true, app_key is included in the request
     * @return \stdClass The content response
     * @throws PayutcException when the status is not 200
     * @internal param string $method Http method, 'POST' by default
     */
    protected function request($service, $action, $data = [], $includeAppKey = true)
    {
        $url = $this->api_url."/$service/$action?system_id=".$this->systemId;
        if ($includeAppKey) {
            $data = array_merge($data, [
                'app_key' => $this->app_key,
            ]);
        }

        if ($this->sessionId) {
            $data = array_merge($data, [
                'sessionid' => $this->sessionId,
            ]);
        }

        $request =  Curl::to($url)
            ->withData($data)
            ->asJsonResponse()
            ->returnResponseObject()
            ->enableDebug(storage_path() . '/logs/payutc.log')
        ;


        $response = $request->post();

        Log::useFiles(storage_path() . '/logs/payutc.log');
        Log::info("Requets to : ".$url." with params : ".print_r($data, true));
        
        // dd($response);
        if(!$response || $response && $response->status != 200) {

            // Erreur 403 liée à l'expiration du sessionid récupéré lors de l'authentification à la webapp
            // -> Appel de loginCas2 pendant l'authentification
            if ($response->status == 403) {
                // To Do, redirection sans tout casser
                // return redirect(env('APP_URL').'/login');
            }

            $status = isset($response->status) ? $response->status : 500;

            if(isset($response->content->error->message)) {
                $error = $response->content->error->message;
            } else {
                $error = "Erreur Payutc";
            }
            if (env('APP_DEBUG') == true) {
                $debug = "[Payutc] Action ".$service."/".$action." impossible";

                $debug .= ' : '. (isset($response->content->error->message) ? $response->content->error->message : '');
                $debug .= ' '. (isset($response->content->error->data->__all__) ? $response->content->error->data->__all__ : '');
                $debug .= "\nParams were : " . print_r($data, true);
                \Log::error($debug);

            }

            throw new PayutcException($error, $status);
        }

        return $response->content;
    }

}
