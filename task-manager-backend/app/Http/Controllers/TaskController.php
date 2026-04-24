<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use App\Models\Task;
use Illuminate\Http\Request;

use function Laravel\Prompts\task;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $userId = auth('api')->user()->id;

        $search = $request->query('search');
        $limit = $request->query('limit', 6);
        $filter = $request->query('filter');
        $sort = $request->query('sort', 'desc');

        $query = Task::where('user_id', $userId)
        ->when($search, fn($q) => $q->where('title', 'LIKE', "%$search%"))
        ->when($filter, fn($q) => $q->where('status', $filter))
        ->orderBy('created_at', $sort);

        $tasks = $query->paginate($limit);

        return response()->json($tasks);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(TaskRequest $request)
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TaskRequest $request)
    {
         $validatedData = $request->validated();
        try {
            $task = Task::create([
                'title' => $validatedData['title'],
                'description' => $validatedData['description']??null,
                'status' => 'pending',
                'user_id' => auth('api')->user()->id,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred while creating the task', 'error' => $e->getMessage()], 500);
        }

        return response()->json($task, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
         $userId = auth('api')->user()->id;
         $task = Task::where('id', $id)->where('user_id', $userId)->first();
         if(!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }
        return response()->json($task);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TaskRequest $request, string $id)
    {
         $validatedData = $request->validated();
         $userId = auth('api')->user()->id;
         if (!$task = Task::where('id', $id)->where('user_id', $userId)->first()) {
            return response()->json(['message' => 'Task not found'], 404);
        }
        try {
            $task->update([
                'title' => $validatedData['title'],
                'description' => $validatedData['description']??null,
                'status' => $validatedData['status']??'pending',
                'user_id' => $userId,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred while updating the task', 'error' => $e->getMessage()], 500);
        }

        return response()->json($task, 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $userId = auth('api')->user()->id;
            if (!$task = Task::where('id', $id)->where('user_id', $userId)->first()) {
                return response()->json(['message' => 'Task not found'], 404);
            }
            try {
                $task->delete();
            } catch (\Exception $e) {
                return response()->json(['message' => 'An error occurred while deleting the task', 'error' => $e->getMessage()], 500);
            }
            return response()->json(['message' => 'Task deleted successfully']);
    }
    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);
        $userId = auth('api')->user()->id;

        try {
            Task::whereIn('id', $ids)->where('user_id', $userId)->delete();
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred while deleting the tasks', 'error' => $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Tasks deleted successfully']);
    }
    public function toggleStatus(string $id)
    {
        $userId = auth('api')->user()->id;
        if (!$task = Task::where('id', $id)->where('user_id', $userId)->first()) {
            return response()->json(['message' => 'Task not found'], 404);
        }
        try {
            $task->status = $task->status === 'completed' ? 'pending' : 'completed';
            $task->save();
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred while toggling the task status', 'error' => $e->getMessage()], 500);
        }

        return response()->json($task);

    }
}
