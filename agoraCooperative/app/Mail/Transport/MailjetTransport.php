<?php

namespace App\Mail\Transport;

use Mailjet\Client;
use Mailjet\Resources;
use Illuminate\Support\Facades\Log;
use Illuminate\Mail\Transport\Transport;
use Swift_Mime_SimpleMessage;

class MailjetTransport extends Transport
{
    public function __construct() { }

    public function send(Swift_Mime_SimpleMessage $message, &$failedRecipients = null)
    {
        Log::info("--- 📬 [MAILJET TRANSPORT] Début de l'envoi ---");

        $apiKey = config('services.mailjet.key');
        $apiSecret = config('services.mailjet.secret');

        if (!$apiKey || !$apiSecret) {
            Log::error("❌ [MAILJET TRANSPORT] Clés API manquantes.");
            return 0;
        }

        // Désactivation SSL pour Windows + Timeout de 15s pour éviter les blocages
        $client = new Client($apiKey, $apiSecret, false, [
            'version' => 'v3.1',
            'timeout' => 15
        ]);

        // Préparation rigoureuse des destinataires
        $to = [];
        $recipients = $message->getTo();
        if (empty($recipients)) {
            Log::error("❌ [MAILJET] Aucun destinataire trouvé dans le message.");
            return 0;
        }

        foreach ($recipients as $email => $name) {
            $to[] = [
                'Email' => (string) $email,
                'Name'  => (string) ($name ?: $email)
            ];
        }

        // Construction du corps conforme à l'API v3.1
        $body = [
            'Messages' => [
                [
                    'From' => [
                        'Email' => (string) config('mail.from.address'),
                        'Name'  => (string) config('mail.from.name'),
                    ],
                    'To' => $to,
                    'Subject' => (string) $message->getSubject(),
                    'HTMLPart' => (string) $message->getBody(),
                    'TextPart' => (string) ($this->getTextPart($message) ?: ""),
                ]
            ]
        ];

        try {
            Log::info("[MAILJET] Tentative d'envoi API pour : " . $to[0]['Email']);
            
            $response = $client->post(Resources::$Email, ['body' => $body]);

            // Analyse de la réponse
            if ($response->success()) {
                Log::info("✅ [MAILJET SUCCÈS] Email accepté par l'API.");
                return $this->numberOfRecipients($message);
            } else {
                Log::error("❌ [MAILJET API ERROR] Statut HTTP : " . $response->getStatus());
                Log::error("[DEBUG DATA] : " . json_encode($response->getData(), JSON_PRETTY_PRINT));
                return 0;
            }
        } catch (\Exception $e) {
            Log::error("❌ [MAILJET EXCEPTION] Erreur : " . $e->getMessage());
            return 0;
        }
    }

    protected function getTextPart(Swift_Mime_SimpleMessage $message)
    {
        return $message->getContentType() === 'text/plain' ? $message->getBody() : "";
    }
}