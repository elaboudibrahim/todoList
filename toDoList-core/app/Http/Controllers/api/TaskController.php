<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use App\Events\TaskCreated;
use Illuminate\Support\Facades\Log; 
class TaskController extends Controller{
    
    public function index()
    {   
       $task=Task::where("user_id",Auth::id())->get();
        return response()->json($task);
        
    }
    public function store(Request $request)
    {
        
        //creation du validator: 
        /*$request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'sometimes|boolean',
        ]);
        */


        //creation
//            "user_id" => Auth::id(), 

        $task=Task::create([
            "user_id"=>$request->user_id,
            "title"=>$request->title,
            "description"=>$request->description,
            "completed"=>$request->completed?? false
        ]);
        // broadcast(new TaskCreated($task))->toOthers();
         $user = Auth::user();
        event(new TaskCreated($task,$user->full_name));

        return response()->json($task, 201);  
    }
    public function show($id)
    {
       $task=Task::where("user_id",Auth::id())->findOrFail($id);
         return response()->json($task);
    }
    public function update(Request $request, $id)
    {
        $task = Task::where('user_id', Auth::id())->findOrFail($id);
        //validate
        /*
         $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'sometimes|boolean',
        ]);
        */   
        $task->update($request->only(['title',"description","completed"]));
        // broadcast(new TaskUpdated($task))->toOthers();
       // event(new TaskCreated($task));
        return response()->json($task);
    }
    public function destroy($id)
    {
        $task = Task::where('user_id', Auth::id())->findOrFail($id);
        // broadcast(new TaskDeleted($taskId, $userId))->toOthers();
        //  event(new TaskState($task));
        $task->delete();
        return response()->json(['message' => 'Task deleted successfully']);
    }
}
