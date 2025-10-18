<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
       public function register(Request $request){
        //
        /*  $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone_number' => 'required|string|max:20',
            'address' => 'nullable|string|max:255',
            'image' => 'nullable|string',
            'password' => 'required|string|min:6|confirmed', // pour tester avec password_confirmation
        ]); */
        
        $user = User::create([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'address' => $request->address,
            'image' => $request->image,
           // 'password' => Hash::make($request->password),
            'password' =>bcrypt($request->password),

        ]);
        return response()->json($user, 201);
    }
    public function update(Request $request, $id)
    {
        //
    }
    public function login(Request $request){
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

        return response()->json($user);
    }
}
