<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Room;
use Illuminate\Database\Eloquent\SoftDeletes;
use File;
use Storage;
use Response;

class Engine extends Model
{

    use SoftDeletes;


    /**
    * The table associated with the model.
    *
    * @var string
    */
    protected $table = 'Engines';



    protected $dates = ['deleted_at'];


    /**
    * The attributes that are mass assignable.
    *
    * @var array
    */
    protected $fillable = ['name', 'description', 'picture', 'room_id', 'status', 'documentation', 'dataSheet'];
    

    /**
    * Rules pour Validator
    *
    * @var array
    */
    public static $rules = [
        'name'          =>      'required|string',
        'room_id'       =>      'required|integer|exists:Rooms,id',
        'status'        =>      'string|required'
    ];


    /**
    * Retourne la Room de l'Engine actuel
    *
    */
    public function room()
    {
        return $this->belongsTo('App\Room');
    }


    /**
    *       Attribut ajouté
    *
    */
    protected $appends = ['room'];


    /**
    *   Attribut ajouté Room
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
    *       Mettre le room_id à null
    *
    */
    public function setRoomidNull(){

        $this->room_id = null;
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
                Storage::putFileAs('public/engines/'.$this->id.'/', $file, $fileName);

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

        $path = 'public/engines/'.$this->id.'/'.$this->picture;

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
            
            $path = 'public/engines/'.$this->id.'/'.$this->picture;
        
            Storage::delete($path);
        
            $this->setPictureNull();

        }
    }


}
