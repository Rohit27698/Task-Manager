<?php

use App\Http\Controllers\AuthController;
// use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::prefix('/auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::middleware('auth:api')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::get('my-account', [AuthController::class, 'myAccount']);
        });
});
Route::group(['middleware' => 'auth:api' , 'prefix' => 'tasks'], function () {
    Route::get('/', [\App\Http\Controllers\TaskController::class, 'index']);
    Route::post('/', [\App\Http\Controllers\TaskController::class, 'store']);
    Route::get('{id}', [\App\Http\Controllers\TaskController::class, 'show']);
    Route::put('{id}', [\App\Http\Controllers\TaskController::class, 'update']);
    Route::patch('{id}', [\App\Http\Controllers\TaskController::class, 'update']);
    Route::delete('{id}', [\App\Http\Controllers\TaskController::class, 'destroy']);
    Route::post('update-status/{id}', [\App\Http\Controllers\TaskController::class, 'toggleStatus']);
    Route::delete('bulk-delete', [\App\Http\Controllers\TaskController::class, 'bulkDelete']);
});

