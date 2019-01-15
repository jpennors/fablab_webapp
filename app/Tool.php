<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Nanigans\SingleTableInheritance\SingleTableInheritanceTrait;
use App\Chemical;
use App\Room;
use App\Wardrobe;
use Illuminate\Database\Eloquent\SoftDeletes;
use File;
use Storage;
use Response;

class Tool extends Model
{


    use SoftDeletes;


    // Permet de construire des model en STI (Single Table Inheritance)
    use SingleTableInheritanceTrait;


    /**
    * The table associated with the model.
    *
    * @var string
    */
    protected $table = 'Tools';


    protected $dates = ['deleted_at'];



    /**
    * Nanigans: champ contenant le type de classe
    *
    * @var string
    */
    protected static $singleTableTypeField = 'type';



    /**
    * Nanigans: liste des classes représentées par cette table
    *
    * @var string
    */
    protected static $singleTableSubclasses = [Chemical::class];



    /**
    * Nanigans: type de la classe actuelle (la classe mère, ici tool)
    *
    * @var string
    */
    protected static $singleTableType = 'tool';



    /**
    * The attributes that are mass assignable.
    *
    * @var array
    */
    protected $fillable = ['type', 'name', 'description', 'picture', 'wardrobe_id', 'room_id', 'supplier', 'quantityUnit', 'remainingQuantity', 'minQuantity'];



    /**
    * Rules pour Validator
    *
    * @var array
    */
    public static $rules = [
        'name'              =>  'required|string',
        'type'              =>  'required|in:chemical,tool',
        'room_id'           =>  'nullable|exists:Rooms,id|integer',
        'wardrobe_id'       =>  'nullable|integer|exists:Wardrobes,id',
        'remainingQuantity' =>  'required|integer|min:0',
        'minQuantity'       =>  'integer|min:0',
    ];

  

    /**
    * Retourne la Room du Tool actuel
    *
    */
    public function room()
    {
        return $this->belongsTo('App\Room');
    }



    /**
    * Retourne la Wardrobe du Tool actuel
    *
    */
    public function wardrobe()
    {
        return $this->belongsTo('App\Wardrobe');
    }


    /**
    *   Attributs ajoutés
    *
    */
    protected $appends = ['room', 'wardrobe'];


    /**
    *   Retounr l'attribut rooms
    *
    */
    public function getRoomAttribute(){

        $rooms = $this->room()->get();

        if ($rooms) {
            return $rooms->first();
        }
         else {
            return null;
        }

    }


    /**
    *   Retounr l'attribut wardrobes
    *
    */
    public function getWardrobeAttribute(){

        $wardrobes = $this->wardrobe()->get();

        if ($wardrobes) {
            return $wardrobes->first();
        }
         else {
            return null;
        }
        
    }


    /**
    *       Mettre le room_id à null
    *
    */
    public function setRoomidNull(){

        $this->room_id = null;

        $this->setWardrobeidNull();
    
    }


    /**
    *       Mettre le wardrobe_id à null
    *
    */
    public function setWardrobeidNull(){

        $this->wardrobe_id = null;
        $this->save();
    
    }


    /**
    *       Mettre picture à null
    *
    */
    public function setPictureNull(){

        $this->picture = null;
        $this->save();

    }


    /**
    *       Mettre à jour picture
    *
    */
    public function setPicture($fileName){

        $this->picture = $fileName;
        $this->save();
    }


    /**
    *       Update de l'image
    *
    */
    public function uploadImage($file){

        if (isset($file)) {
      
            try {
            
                // S'il existe une ancienne image, suppresion
                $this->deleteImage();

                $fileName = $this->id.'.'.$file->guessExtension();
                Storage::putFileAs('public/tools/'.$this->id.'/', $file, $fileName);

                $this->setPicture($fileName);

            } catch(\Exception $e) {
            
            return response()->inputError("Can't delete the files", 500);

            }

            return response()->success();
            
        }
   
        return response()->json(['message' => 'Image not found.'], 404);

    }


    /**
    *       Récupération de l'image
    *
    */
    public function getImage(){

        $path = 'public/tools/'.$this->id.'/'.$this->picture;

        try {

            $file = Storage::get($path);
            $type = File::mimeType(storage_path('app/'.$path));
            $response = Response::make($file, 200);
            $response->header("Content-Type", $type);

            return $response;
       
        } catch(Exception $e){
       
            return response()->inputError("Can't find or load the image.", 500);
       
        }
    }


    /**
    *       Suppression de l'image
    *
    */
    public function deleteImage(){

        if ($this->picture) {
            
            $path = 'public/tools/'.$this->id.'/'.$this->picture;
        
            Storage::delete($path);
        
            $this->setPictureNull();

        }
    }
}


