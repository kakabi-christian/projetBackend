<?php

namespace App\Services;

use Mailjet\Client;
use Mailjet\Resources;
use Illuminate\Support\Facades\Log;

class MailjetService
{
    protected $client;

    public function __construct()
    {
        $key = config('services.mailjet.key');
        $secret = config('services.mailjet.secret');

        Log::info("--- 🚀 [INIT] DÉMARRAGE DU SERVICE MAILJET ---");

        if (!$key || !$secret) {
            Log::error("❌ [CONFIG ERROR] Clés API Mailjet manquantes dans config/services.php");
        }

        $this->client = new Client(
            $key,
            $secret,
            true,
            ['version' => 'v3.1']
        );
        
        Log::info("✅ [API READY] Client Mailjet initialisé (Port 443)");
    }

    public function sendMail($to, $subject, $htmlContent)
    {
        Log::warning("--- 📥 [TENTATIVE D'ENVOI API] ---");
        Log::info("[DESTINATAIRE]: " . $to);
        Log::info("[SUJET]: " . $subject);

        // Vérification de l'expéditeur config/mail.php
        $fromEmail = config('mail.from.address');
        $fromName = config('mail.from.name');

        $body = [
            'Messages' => [
                [
                    'From' => [
                        'Email' => $fromEmail,
                        'Name' => $fromName
                    ],
                    'To' => [
                        [
                            'Email' => $to,
                            'Name' => $to
                        ]
                    ],
                    'Subject' => $subject,
                    'HTMLPart' => $htmlContent,
                ]
            ]
        ];

        try {
            Log::info("[PROCESS] ⏳ Envoi en cours via API HTTP Mailjet...");
            
            $response = $this->client->post(Resources::$Email, ['body' => $body]);
            
            if ($response->success()) {
                Log::info("✅ [SUCCÈS] Email envoyé avec succès via API");
                return true;
            } else {
                // Récupération de l'erreur détaillée de Mailjet
                $errorDetail = $response->getData();
                Log::error("❌ [API ERROR] Mailjet a rejeté la requête");
                Log::error("[CAUSE]: " . json_encode($errorDetail, JSON_PRETTY_PRINT));
                return false;
            }
        } catch (\Exception $e) {
            Log::error("❌ [EXCEPTION] Échec critique lors de l'envoi à " . $to);
            Log::error("[MESSAGE]: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Envoi du code OTP
     */
    public function sendOtpEmail($to, $code)
    {
        Log::info("[OTP] Préparation du code {$code} pour {$to}");
        
        $subject = "🔐 Code de vérification - Agora Coopérative";
        $html = "
            <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;'>
                <h2 style='color: #2c3e50;'>Votre code de vérification</h2>
                <div style='font-size: 24px; font-weight: bold; color: #3498db; padding: 10px; background: #f9f9f9; display: inline-block; border-radius: 4px;'>
                    {$code}
                </div>
                <p>Ce code est valable pendant 10 minutes.</p>
                <hr style='border: none; border-top: 1px solid #eee;' />
                <small style='color: #7f8c8d;'>Agora Coopérative - Système de sécurité</small>
            </div>";
            
        return $this->sendMail($to, $subject, $html);
    }
}