<?php

namespace App\Http\Controllers;

use App\Member;
use App\Role;
use Curl;
use DB;
use function foo\func;
use Ginger;
use Illuminate\Http\Request;
use Validator;
use App\User;
use Excel;
use App\Exports\DataExport;

class UsersController extends Controller
{
    public static $rightName = 'user';
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $key = Role::where('name', 'Membre CAS')->get()->first()->id;
      $data = User::where('role_id', '!=', $key)->get();
      
      foreach ($data as $user) {
        $user["role"] = $user->role->get();
      }
      return response()->success($data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      // Validation des inputs
      $validator = Validator::make($request->all(), User::$rules);
      // Mauvaises données, on retourne les erreurs
      if($validator->fails()) {
          return response()->inputError($validator->errors(), 422);
      }

      
      // L'utilisateur existe peut être déjà en tant que membre CAS
      $user = User::firstOrNew(['login' => $request->input('login')]);
      $user->terms     = $request->input('terms');
      $user->entity_id  = $request->input('entity_id');
      $user->role_id   = $request->input('role_id');

      // On essaye d'enregistrer
      try {
        $user->save();
      } catch(\Exception $e) {
        return response()->inputError("Can't save the resource", 500);
      }

      return response()->success();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::with('role')->findOrFail($id);
        return response()->success($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
      /** @var $user User **/
      $user = User::findOrFail($id);
      $validator = Validator::make($request->all(), User::$rules);

      // Mauvaises données, on retourne les erreurs
      if($validator->fails()) {
        return response()->inputError($validator->errors(), 422);
      }

      // Attributs partagées par User et Member
      $user->terms      = $request->input('terms');
      $user->entity_id  = $request->input('entity_id');
      $user->role_id    = $request->input('role_id');

      // On essaye d'enregistrer
      try {
        $user->save();
      } catch(\Exception $e) {
        return response()->error("Can't update the resource: " . $e, 500);
      }

      return response()->success($user);
    }


    public function gingerSearch(Request $request)
    {
        if(!$request->has('query')) {
            return response()->error("Missing query param", 400);
        }
        $query = $request->get('query');

        try {
            $user = Ginger::find($query);
            // \Cache::add('ginger_search_'.$query, $user, 30);
            return response()->success($user);
        } catch (ApiException $e) {
            return response()->error("Ginger error", $e->getCode());
        }
    }

    public function gingerLogin($login)
    {
        try {
            $response = Ginger::getUser($login);
            return response()->json($response->content, $response->status);
        } catch (ApiException $e) {
            return response()->error("Ginger error", $e->getCode());
        }
    }

    /**
     * Retourne la liste des utilisateurs à synchroniser depuis le portail des assos
     * @return mixed
     */
    public function getSync()
    {
        $portalMembers =  Curl::to("http://assos.utc.fr/asso/membres.json/fablab")
            ->asJsonResponse(true)
            ->returnResponseObject()
            ->get()
        ;
        $notMapped = 13;
        $userComparator = function($a, $b) {
            return strcmp($a['login'], $b['login']);
        };

        $portalMembers = $portalMembers->content;
        foreach ($portalMembers as $key => $portalMember) {
            $u = new User([
                'login' => $portalMember['login'],
                'role_id' => $this->mapRolestoPortal($portalMembers[$key]['role'])->id,
            ]);
            $portalMembers[$key] = $u->toArray();
        }

        $members = User::where('role_id','!=', $notMapped)->get()->toArray();

        // Recupère les users présent sur le portail, mais pas dans l'appli
        // càd : ceux à ajouter
        $add = array_udiff($portalMembers, $members, $userComparator);

        foreach ($add as $key => $member) {
            $add[$key]['action'] = 'add';
        }

        // Recupère les users présent dans l'appli, mais pas sur le portail
        // càd : ceux à supprimer
        $delete = array_udiff($members, $portalMembers, $userComparator);

        foreach ($delete as $key => $value) {
            $delete[$key]['old_role_id'] = $delete[$key]['role_id'];
            $delete[$key]['role_id'] = null;
            $delete[$key]['action'] = 'delete';
        }

        // Recupère les users présent dans l'appli et sur le portail dont le role est différent
        // càd : ceux à modifier
        $edited = [];
        foreach ($portalMembers as $portalMember) {
            foreach ($members as $member) {
                if ($portalMember['login'] == $member['login'] && $portalMember['role_id'] != $member['role_id']) {
                    $member['old_role_id'] = $member['role_id'];
                    $member['role_id']     = $portalMember['role_id'];
                    $member['action']      = 'edit';
                    $edited[] = $member;
                }
            }
        }

        return response()->success([
            'users' => array_merge(
                array_values($add),
                array_values($delete),
                array_values($edited)
            ),
        ]);
    }

    public function processSync(Request $request)
    {
        $users = $request->all();

        DB::beginTransaction();
        foreach ($users as $user) {
            try {
                if (!isset($user['action'])) {
                    return response()->error("Paramater 'action' in user is missing", 422);
                }
                switch ($user['action']) {
                    case 'add':
                        $created = new Member([
                            'login' => $user['login'],
                            'role_id' => $user['role_id'],
                            'active'  => true,
                        ]);

                        $created->save();
                        break;
                    case 'delete':
                        User::where('login', $user['login'])->delete();
                        break;
                    case 'edit':
                        User::where('login', $user['login'])->update([
                            'role_id' => $user['role_id'],
                        ]);
                        break;
                }
            } catch (\Exception $e) {
                DB::rollback();
                return response()->error("Can't save user '".$user['login']."'", 500);
            }
        }

        DB::commit();
        return response()->success();
    }

    private function mapRolestoPortal($role)
    {

       

        $map = [
            "Membre" => Role::find(env('PORTAL_MEMBRE')),
            "Resp Communication" => Role::find(env('PORTAL_RESP_COMM')),
            "Président" => Role::find(env('PORTAL_PRESIDENT')),
            "Trésorier" => Role::find(env('PORTAL_TRESORIER')),
            "Resp Info" => Role::find(env('PORTAL_RESP_INFO')),
            "Vice-président" => Role::find(env('PORTAL_VICE_PRE')),
            "Secrétaire" => Role::find(env('PORTAL_SECR')),
            "Secrétaire Général" => Role::find(env('PORTAL_SECR')),
            "Bureau"  =>  Role::find(env('PORTAL_BUREAU')),
        ];

        return $map[$role];
    }

    /* Fonction d'export */
    public function exportFile()
    {
        return Excel::download(new DataExport('App\User'), 'data.xlsx');
    }
}
