<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
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
    Route::delete('/bulk-delete', [TaskController::class, 'bulkDelete']);
    Route::post('update-status/{id}', [TaskController::class, 'toggleStatus']);
    Route::get('/', [TaskController::class, 'index']);
    Route::post('/', [TaskController::class, 'store']);
    Route::get('{id}', [TaskController::class, 'show']);
    Route::put('{id}', [TaskController::class, 'update']);
    Route::patch('{id}', [TaskController::class, 'update']);
    Route::delete('{id}', [TaskController::class, 'destroy']);
});

