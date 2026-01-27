# Modifications Backend Requises

## Contexte
Le frontend a été mis à jour pour permettre aux nouveaux membres de changer leur mot de passe temporaire après leur première connexion.

## Modifications à apporter dans le Backend Laravel

### 1. Migration - Ajouter le champ `mot_de_passe_temporaire`

Créer une migration pour ajouter le champ dans la table `membres` :

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('membres', function (Blueprint $table) {
            $table->boolean('mot_de_passe_temporaire')->default(false)->after('mot_de_passe');
        });
    }

    public function down(): void
    {
        Schema::table('membres', function (Blueprint $table) {
            $table->dropColumn('mot_de_passe_temporaire');
        });
    }
};
```

### 2. Modèle Membre - Ajouter le champ dans `$fillable`

Dans `app/Models/Membre.php` :

```php
protected $fillable = [
    // ... autres champs
    'mot_de_passe',
    'mot_de_passe_temporaire',
    // ...
];

protected $casts = [
    // ... autres casts
    'mot_de_passe_temporaire' => 'boolean',
];
```

### 3. Lors de l'approbation d'un membre

Quand un administrateur approuve un nouveau membre, définir `mot_de_passe_temporaire = true` :

```php
// Dans le contrôleur d'approbation
$membre->update([
    'est_actif' => true,
    'mot_de_passe' => Hash::make($motDePasseTemporaire), // Générer un mot de passe aléatoire
    'mot_de_passe_temporaire' => true, // IMPORTANT
]);

// Envoyer l'email avec le mot de passe temporaire
```

### 4. Route et Contrôleur - Changement de mot de passe

#### Route dans `routes/api.php` :

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);
});
```

#### Méthode dans `AuthController` :

```php
public function changePassword(Request $request)
{
    $request->validate([
        'ancien_mot_de_passe' => 'required|string',
        'nouveau_mot_de_passe' => 'required|string|min:8|confirmed',
        'confirmation_mot_de_passe' => 'required|string',
    ]);

    $membre = $request->user();

    // Vérifier l'ancien mot de passe
    if (!Hash::check($request->ancien_mot_de_passe, $membre->mot_de_passe)) {
        return response()->json([
            'success' => false,
            'message' => 'L\'ancien mot de passe est incorrect.'
        ], 400);
    }

    // Vérifier que le nouveau mot de passe est différent
    if (Hash::check($request->nouveau_mot_de_passe, $membre->mot_de_passe)) {
        return response()->json([
            'success' => false,
            'message' => 'Le nouveau mot de passe doit être différent de l\'ancien.'
        ], 400);
    }

    // Mettre à jour le mot de passe
    $membre->update([
        'mot_de_passe' => Hash::make($request->nouveau_mot_de_passe),
        'mot_de_passe_temporaire' => false, // Plus temporaire
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Mot de passe changé avec succès.'
    ]);
}
```

### 5. Resource - Inclure le champ dans la réponse

Dans `app/Http/Resources/MembreResource.php` ou `AuthResource.php` :

```php
public function toArray($request)
{
    return [
        'code_membre' => $this->code_membre,
        'nom' => $this->nom,
        'prenom' => $this->prenom,
        'email' => $this->email,
        'role' => $this->role,
        'est_actif' => $this->est_actif,
        'mot_de_passe_temporaire' => $this->mot_de_passe_temporaire, // AJOUTER
        'telephone' => $this->telephone,
        'adresse' => $this->adresse,
        'ville' => $this->ville,
        'code_postal' => $this->code_postal,
        'biographie' => $this->biographie,
        'photo_url' => $this->photo_url,
        'date_inscription' => $this->date_inscription,
    ];
}
```

## Flux utilisateur

1. **Approbation** : Admin approuve un membre → `mot_de_passe_temporaire = true`
2. **Email** : Le membre reçoit un email avec son mot de passe temporaire
3. **Connexion** : Le membre se connecte avec le mot de passe temporaire
4. **Redirection** : Il est redirigé vers `/membre/tableau-de-bord`
5. **Alerte** : Une alerte s'affiche dans son profil pour changer le mot de passe
6. **Changement** : Il change son mot de passe → `mot_de_passe_temporaire = false`

## Tests à effectuer

- [ ] Vérifier que le champ `mot_de_passe_temporaire` est bien retourné dans la réponse de login
- [ ] Tester le changement de mot de passe avec un ancien mot de passe incorrect
- [ ] Tester le changement de mot de passe avec une confirmation qui ne correspond pas
- [ ] Vérifier que `mot_de_passe_temporaire` passe à `false` après changement
- [ ] Tester qu'un membre avec `mot_de_passe_temporaire = true` voit l'alerte dans son profil

## Endpoint attendu

**POST** `/api/auth/change-password`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Body:**
```json
{
  "ancien_mot_de_passe": "TempPass123",
  "nouveau_mot_de_passe": "NewSecurePass123",
  "confirmation_mot_de_passe": "NewSecurePass123"
}
```

**Réponse succès (200):**
```json
{
  "success": true,
  "message": "Mot de passe changé avec succès."
}
```

**Réponse erreur (400):**
```json
{
  "success": false,
  "message": "L'ancien mot de passe est incorrect."
}
```
