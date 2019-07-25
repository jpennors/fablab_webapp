<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use File;
use Storage;
use Response;

/**
 * @property \Carbon\Carbon $deleted_at
 */
class Expendable extends Model
{

    use SoftDeletes;


    /**
    * The table associated with the model.
    *
    * @var string
    */
    protected $table = 'Expendables';


    protected $dates = ['deleted_at'];


    /**
    * The attributes that are mass assignable.
    *
    * @var array
    */
    protected $fillable = ['name', 'brand', 'supplier', 'supplierLink', 'quantityUnit', 'remainingQuantity', 'minQuantity'                   , 'description', 'picture', 'wardrobe_id', 'room_id',];


    /**
    * Rules pour Validator
    *
    * @var array
    */
    public static $rules = [
        'name'              =>    'required',
        'remainingQuantity' =>    'required|numeric|min:0',
        'minQuantity'       =>    'numeric|min:0',
        'room_id'           =>    'nullable|exists:Rooms,id|integer',
        'wardrobe_id'       =>    'nullable|integer|exists:Wardrobes,id',
    ];


    /**
    * The attributes that should be casted to native types.
    *
    * @var array
    */
    protected $casts = [
        'remainingQuantity' =>  'float',
        'minQuantity'       =>  'float',
    ];


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
    * Retourne la Room du Expendable actuel
    *
    */
    public function room()
    {
        return $this->belongsTo('App\Room');
    }


    /**
    * Retourne la Wardrobe du Expendable actuel
    *
    */
    public function wardrobe()
    {
        return $this->belongsTo('App\Wardrobe');
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
                Storage::putFileAs('public/expendables/'.$this->id.'/', $file, $fileName);

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

        $path = 'public/expendables/'.$this->id.'/'.$this->picture;

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
            
            $path = 'public/expendables/'.$this->id.'/'.$this->picture;
        
            Storage::delete($path);
        
            $this->setPictureNull();

        }
    }


}
