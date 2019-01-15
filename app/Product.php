<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Categorie;
use Illuminate\Database\Eloquent\SoftDeletes;
use File;
use Storage;
use Response;


class Product extends Model
{

    use SoftDeletes;

    /**
    * The table associated with the model.
    *
    * @var string
    */
    protected $table = 'Products';


    protected $dates = ['deleted_at'];


    /**
    * The attributes that are mass assignable.
    *
    * @var array
    */
    protected $fillable = ['name', 'description', 'wardrobe_id', 'room_id', 'remainingQuantity', 'minQuantity', 'quantityUnit', 'price', 'picture', 'brand', 'supplier', 'supplierLink', 'documentation', 'dataSheet', 'categorie_id'];



    /**
    * Rules pour Validator
    *
    * @var array
    */
    public static $rules = [
        'name'              =>      'required',
        'room_id'           =>      'nullable|exists:Rooms,id|integer',
        'wardrobe_id'       =>      'nullable|integer|exists:Wardrobes,id',
        'remainingQuantity' =>      'required|numeric|min:0',
        'minQuantity'       =>      'numeric|min:0',
        'price'             =>      'numeric|min:0|required',
        'categorie_id'      =>      'required|integer|exists:categories,id',
    ];

  

    /**
    * The attributes that should be casted to native types.
    *
    * @var array
    */
    protected $casts = [
        'remainingQuantity' =>  'float',
        'minQuantity'       =>  'float',
        'price'             =>  'float',
    ];




    /**
    * Retourne les purchased Elements liés au produit
    *
    */
    public function purchases()
    {
        return $this->morphMany('App\PurchasedElement', 'purchasable');
    }



    /**
    * Retourne la Catégorie du Product actuel
    *
    */
    public function categorie()
    {
        return $this->belongsTo('App\Categorie');
    }


    /**
    * Retourne la Room du Product actuel
    *
    */
    public function room()
    {
        return $this->belongsTo('App\Room');
    }


    /**
    * Retourne la Wardrobe du Product actuel
    *
    */
    public function wardrobe()
    {
        return $this->belongsTo('App\Wardrobe');
    }


    /**
    *       Attributs ajoutés
    *
    */
    protected $appends = ['room', 'wardrobe', 'categorie'];


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
    *   Attribut ajouté Wardrobe
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
    *   Attribut ajouté Categorie
    *
    */
    public function getCategorieAttribute(){

        $categories = $this->categorie()->get();

        if ($categories) {
            return $categories->first();
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
    *       Mettre le categorie_id à null
    *
    */
    public function setCategorieidNull(){

        $this->categorie_id = null;
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
                Storage::putFileAs('public/products/'.$this->id.'/', $file, $fileName);

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

        $path = 'public/products/'.$this->id.'/'.$this->picture;

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
            
            $path = 'public/products/'.$this->id.'/'.$this->picture;
        
            Storage::delete($path);
        
            $this->setPictureNull();

        }
    }

}
