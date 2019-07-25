<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Auth;

class MailController extends Controller
{
 
    public function send(Request $request)
    {
        
        //On récupère le contenu du mail, le sujet et le destinataire
        $content = $request->content;
        $subject = $request->subject;
        $receiver = $request->receiver;

        // En développement, on s'envoie le mail directement

        if (config('app.mail_dev') == 'true'){
            $receiver = Auth::user()['email'];
        }

        //On envoie l'email depuis la boîte mail de gestion du Fablab
        Mail::send('mail',['content' => $content], function($message) use ($subject, $receiver) {
            $message->to($receiver);
            $message->from('gestionfablab@gmail.com');
            $message->subject($subject);
        });

    }
}
