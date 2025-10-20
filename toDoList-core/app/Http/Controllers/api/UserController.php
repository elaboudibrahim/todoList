<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

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
        // if ($validator->fails()) {
        //     return response()->json($validator->errors(), 422);
        // }

        $user = User::create([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'address' => $request->address,
            'image' => $request->image,
           // 'password' => Hash::make($request->password),
            'password' =>bcrypt($request->password),

        ]);
        
        $token = JWTAuth::fromUser($user);

        return response()->json(['user'=>$user,'token'=>$token], 201);
    }
    public function update(Request $request, $id)
    {
        //
    }
    public function login(Request $request){
         $credentials = $request->only('email', 'password');

        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }
        
        return response()->json([
            'user' => auth()->user(),
            'token' => $token,
        ]);
    }
}
