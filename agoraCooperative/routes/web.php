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

// ROUTE TEMPORAIRE POUR LANCER LES MIGRATIONS SUR RAILWAY
Route::get('/force-migrate', function () {
    // Augmente le temps d'exécution à 5 minutes pour éviter le timeout
    set_time_limit(300); 

    try {
        // Force la création des tables et l'insertion des données de test
        Artisan::call('migrate:fresh', [
            '--force' => true, 
            '--seed' => true
        ]);
        
        return response()->json([
            'status' => 'Success', 
            'message' => 'Base de données migrée et remplie avec succès !',
            'details' => Artisan::output()
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'Error', 
            'message' => $e->getMessage()
        ], 500);
    }
});