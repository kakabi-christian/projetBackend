<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateMembreRequest;
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\UpdateProfilRequest;
use App\Http\Requests\UploadPhotoRequest;
use App\Http\Resources\MembreResource;
use App\Http\Resources\ProfilResource;
use App\Models\Membre;
use App\Services\FileStorageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Barryvdh\DomPDF\Facade\Pdf;

class MembreController extends Controller
{
    protected $fileService;
    
    public function __construct(FileStorageService $fileService)
    {
        $this->fileService = $fileService;
    }
    
    /**
     * Display the specified resource.
     *
     * @param  string  $codeMembre
     * @return \Illuminate\Http\Response
     */
    /**
 * Liste tous les membres (Nom, Prénom, Code)
 */
/**
 * Liste tous les membres (Utilise MembreResource)
 */
public function index()
{
    // 1. Vérification de sécurité
    if (auth()->user()->role !== 'administrateur') {
        return response()->json(['message' => 'Accès refusé.'], 403);
    }

    // 2. Récupération des membres (on récupère tout pour que la ressource fonctionne)
    $membres = Membre::orderBy('nom', 'asc')->get();

    // 3. Retourne la collection via la ressource pour un formatage parfait
    return MembreResource::collection($membres)->additional([
        'success' => true
    ]);
}

/**
 * Export de la liste des membres en PDF
 */
public function exportPDF()
{
    // 1. Vérification de sécurité
    if (auth()->user()->role !== 'administrateur') {
        return response()->json(['message' => 'Accès refusé.'], 403);
    }

    // 2. Récupération des données nécessaires pour le tableau PDF
    $membres = Membre::select('code_membre', 'nom', 'prenom', 'email', 'telephone', 'date_inscription')
                     ->orderBy('nom', 'asc')
                     ->get();

    // 3. Génération du PDF via la vue blade
    // Assure-toi d'avoir installé : composer require barryvdh/laravel-dompdf
    $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.liste_membres', compact('membres'));

    // 4. Configuration du format (A4 Portrait)
    $pdf->setPaper('a4', 'portrait');

    // 5. Téléchargement direct
    return $pdf->download('liste_membres_agora_' . date('d_m_Y') . '.pdf');
}
    public function show($codeMembre)
    {
        $membre = Membre::where('code_membre', $codeMembre)
            ->with('profil')
            ->firstOrFail();
        
        // Vérifier permissions (propriétaire ou admin)
        $user = auth()->user();
        if ($user->code_membre !== $codeMembre && $user->role !== 'administrateur') {
            return response()->json([
                'message' => 'Accès refusé.'
            ], 403);
        }
        
        return new MembreResource($membre);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateMembreRequest  $request
     * @param  string  $codeMembre
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateMembreRequest $request, $codeMembre)
    {
        $membre = Membre::where('code_membre', $codeMembre)->firstOrFail();
        
        // Vérifier permissions (propriétaire uniquement)
        if (auth()->user()->code_membre !== $codeMembre) {
            return response()->json([
                'message' => 'Vous ne pouvez modifier que votre propre profil.'
            ], 403);
        }
        
        $membre->update($request->validated());
        
        return new MembreResource($membre->load('profil'));
    }

    /**
     * Update member password.
     *
     * @param  \App\Http\Requests\UpdatePasswordRequest  $request
     * @param  string  $codeMembre
     * @return \Illuminate\Http\Response
     */
    public function updatePassword(UpdatePasswordRequest $request, $codeMembre)
    {
        $membre = Membre::where('code_membre', $codeMembre)->firstOrFail();
        
        // Vérifier permissions (propriétaire uniquement)
        if (auth()->user()->code_membre !== $codeMembre) {
            return response()->json([
                'message' => 'Vous ne pouvez modifier que votre propre mot de passe.'
            ], 403);
        }
        
        // Vérifier l'ancien mot de passe
        if (!Hash::check($request->ancien_mot_de_passe, $membre->mot_de_passe)) {
            return response()->json([
                'message' => 'L\'ancien mot de passe est incorrect.'
            ], 400);
        }
        
        // Mettre à jour le mot de passe
        $membre->update([
            'mot_de_passe' => Hash::make($request->nouveau_mot_de_passe),
        ]);
        
        // Révoquer tous les tokens existants
        $membre->tokens()->delete();
        
        return response()->json([
            'message' => 'Mot de passe modifié avec succès. Veuillez vous reconnecter.'
        ], 200);
    }

    /**
     * Upload member photo.
     *
     * @param  \App\Http\Requests\UploadPhotoRequest  $request
     * @param  string  $codeMembre
     * @return \Illuminate\Http\Response
     */
    public function uploadPhoto(UploadPhotoRequest $request, $codeMembre)
    {
        $membre = Membre::where('code_membre', $codeMembre)->firstOrFail();
        
        // Vérifier permissions (propriétaire uniquement)
        if (auth()->user()->code_membre !== $codeMembre) {
            return response()->json([
                'message' => 'Vous ne pouvez modifier que votre propre photo.'
            ], 403);
        }
        
        // Supprimer l'ancienne photo si elle existe
        if ($membre->photo_url) {
            $this->fileService->deletePhoto($membre->photo_url);
        }
        
        // Stocker la nouvelle photo
        $path = $this->fileService->uploadPhoto($request->file('photo'), $codeMembre);
        
        // Mettre à jour le membre
        $membre->update([
            'photo_url' => $path,
        ]);
        
        return new MembreResource($membre->load('profil'));
    }

    /**
     * Update extended profile.
     *
     * @param  \App\Http\Requests\UpdateProfilRequest  $request
     * @param  string  $codeMembre
     * @return \Illuminate\Http\Response
     */
    public function updateProfil(UpdateProfilRequest $request, $codeMembre)
    {
        $membre = Membre::where('code_membre', $codeMembre)->firstOrFail();
        
        // Vérifier permissions (propriétaire uniquement)
        if (auth()->user()->code_membre !== $codeMembre) {
            return response()->json([
                'message' => 'Vous ne pouvez modifier que votre propre profil.'
            ], 403);
        }
        
        // Mettre à jour le profil
        if (!$membre->profil) {
            $membre->profil()->create($request->validated());
        } else {
            $membre->profil->update($request->validated());
        }
        
        return new ProfilResource($membre->profil);
    }
}
