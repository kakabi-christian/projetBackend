<?php

namespace App\Mail\Transport;

use Illuminate\Mail\Transport\Transport;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Swift_Mime_SimpleMessage;

class MailjetTransport extends Transport
{
    public function send(Swift_Mime_SimpleMessage $message, &$failedRecipients = null)
    {
        Log::info("--- 🚀 [MAILJET DEBUG] VERSION COMPATIBLE & LOGS ---");

        // 1. RÉCUPÉRATION DES PARAMÈTRES
        $key = config('services.mailjet.key');
        $secret = config('services.mailjet.secret');
        $from = config('mail.from.address');
        $fromName = config('mail.from.name', 'Agora');

        Log::info("[DEBUG 1] KEY: " . ($key ? "OK (".strlen($key)." chars)" : "MANQUANTE ❌"));
        Log::info("[DEBUG 1] FROM: " . ($from ?: "VIDE ❌"));

        // 2. EXTRACTION DES DESTINATAIRES
        $to = [];
        foreach ($message->getTo() as $email => $name) {
            $to[] = [
                'Email' => (string)$email, 
                'Name'  => (string)($name ?: $email)
            ];
        }
        
        if (isset($to[0])) {
            Log::info("[DEBUG 2] DESTINATAIRE CIBLE: " . $to[0]['Email']);
        }

        // 3. PRÉPARATION DU CORPS DE LA REQUÊTE (API v3.1)
        $payload = [
            'Messages' => [
                [
                    'From' => [
                        'Email' => (string)$from,
                        'Name'  => (string)$fromName,
                    ],
                    'To' => $to,
                    'Subject' => (string)$message->getSubject(),
                    'HTMLPart' => (string)$message->getBody(),
                ]
            ]
        ];

        try {
            Log::info("[DEBUG 3] APPEL API MAILJET EN COURS...");

            /**
             * Utilisation de Http::post (Guzzle)
             * withoutVerifying() est crucial pour ton environnement Windows local
             */
            $response = Http::withBasicAuth($key, $secret)
                ->timeout(30)
                ->withoutVerifying() 
                ->post('https://api.mailjet.com/v3.1/send', $payload);

            // 4. ANALYSE DU RÉSULTAT
            Log::info("[DEBUG 4] CODE HTTP REÇU : " . $response->status());
            
            if ($response->successful()) {
                Log::info("✅ [MAILJET] SUCCÈS : L'email a été accepté par le serveur.");
                return $this->numberOfRecipients($message);
            }

            Log::error("❌ [MAILJET API ERROR] L'API a renvoyé une erreur.");
            Log::error("-> Status: " . $response->status());
            Log::error("-> Body: " . $response->body());
            return 0;

        } catch (\Exception $e) {
            Log::error("🚨 [ERREUR SYSTÈME] Problème de connexion ou de code.");
            Log::error("-> Message: " . $e->getMessage());
            return 0;
        }
    }
}