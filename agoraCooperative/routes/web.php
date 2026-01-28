<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::get('/', function () {
    return response()->json([
        'status' => 'OK',
        'message' => 'API Agora opérationnelle 🚀'
    ], 200);
});

// ROUTE TEMPORAIRE POUR LANCER LES MIGRATIONS SUR RAILWAY
Route::get('/force-migrate', function () {
    try {
        // Lance les migrations et le seeding
        Artisan::call('migrate:fresh', [
            '--force' => true,
            '--seed' => true
        ]);
        
        return response()->json([
            'status' => 'Success',
            'message' => 'Base de données migrée et remplie avec succès !',
            'output' => Artisan::output()
        ], 200);
        
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'Error',
            'message' => $e->getMessage()
        ], 500);
    }
});