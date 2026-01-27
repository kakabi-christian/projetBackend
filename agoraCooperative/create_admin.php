<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Membre;
use Illuminate\Support\Facades\Hash;

echo "=== Création d'un membre administrateur ===\n\n";

// Collecte des informations
echo "Nom: ";
$nom = trim(fgets(STDIN));

echo "Prénom: ";
$prenom = trim(fgets(STDIN));

echo "Email: ";
$email = trim(fgets(STDIN));

echo "Mot de passe: ";
$password = trim(fgets(STDIN));

echo "Téléphone (optionnel, appuyez sur Entrée pour ignorer): ";
$telephone = trim(fgets(STDIN)) ?: null;

echo "Adresse (optionnel): ";
$adresse = trim(fgets(STDIN)) ?: null;

echo "Ville (optionnel): ";
$ville = trim(fgets(STDIN)) ?: null;

// Génération du code membre
$lastMembre = Membre::orderBy('created_at', 'desc')->first();
$nextNum = $lastMembre ? intval(substr($lastMembre->code_membre, -4)) + 1 : 1;
$codeMembre = 'MBR-' . date('Y') . '-' . str_pad($nextNum, 4, '0', STR_PAD_LEFT);

try {
    $membre = Membre::create([
        'code_membre' => $codeMembre,
        'nom' => $nom,
        'prenom' => $prenom,
        'email' => $email,
        'mot_de_passe' => Hash::make($password),
        'date_inscription' => now(),
        'role' => 'administrateur',
        'est_actif' => true,
        'telephone' => $telephone,
        'adresse' => $adresse,
        'ville' => $ville,
    ]);

    echo "\n✓ Membre administrateur créé avec succès!\n";
    echo "----------------------------------------\n";
    echo "Code membre: " . $membre->code_membre . "\n";
    echo "Nom complet: " . $membre->prenom . " " . $membre->nom . "\n";
    echo "Email: " . $membre->email . "\n";
    echo "Rôle: " . $membre->role . "\n";
} catch (Exception $e) {
    echo "\n✗ Erreur: " . $e->getMessage() . "\n";
}
