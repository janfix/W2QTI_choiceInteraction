<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\convertisseur;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::post('createRootDir', [convertisseur::class, 'createRootDir']);
Route::post('createDirs', [convertisseur::class, 'createDirs']);
Route::post('createManifest', [convertisseur::class, 'createManifest']);
Route::post('writeQTIContent', [convertisseur::class, 'writeQTIContent']);
Route::post('qtizipper', [convertisseur::class, 'qtizipper']);
Route::post('cleaner', [convertisseur::class, 'cleaner']);


