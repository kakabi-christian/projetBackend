<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

// Route d'accueil pour vérifier que l'API répond
Route::get('/', function () {
    return response()->json([
        'status' => 'OK',
        'message' => 'API Agora opérationnelle 🚀'
    ], 200);
});

// ROUTE POUR CRÉER LE LIEN SYMBOLIQUE DU STORAGE
Route::get('/force-link', function () {
    try {
        Artisan::call('storage:link');
        return response()->json([
            'status' => 'Success',
            'message' => 'Le lien symbolique storage a été créé !',
            'details' => Artisan::output()
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'Error',
            'message' => $e->getMessage()
        ], 500);
    }
});

// ROUTE TEMPORAIRE POUR LANCER LES MIGRATIONS SUR RAILWAY
Route::get('/force-migrate', function () {
    set_time_limit(300); 

    try {
        Artisan::call('migrate:fresh', [
            '--force' => true, 
            '--seed' => true
        ]);
        
        // Optionnel : On peut aussi appeler le storage link ici automatiquement
        Artisan::call('storage:link');

        return response()->json([
            'status' => 'Success', 
            'message' => 'Base de données migrée et lien storage créé !',
            'details' => Artisan::output()
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'Error', 
            'message' => $e->getMessage()
        ], 500);
    }
});