<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
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
        $imagePath = null;
        if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('profile-images', 'public');
        }
        $user = User::create([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'address' => $request->address,
            'image' => $request->image,
            'password' =>bcrypt($request->password),

        ]);
        
        $token = JWTAuth::fromUser($user);
        return response()->json(['user'=>$user,'token'=>$token], 201);
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
    public function update(Request $request)
    {
        $user = Auth::user();
    
    $request->validate([
       // 'full_name' => 'sometimes|string|max:255',
        'email' => 'sometimes|email|unique:users,email,' . $user->id,
       // 'phone_number' => 'sometimes|string|max:20', 
       // 'address' => 'sometimes|string|max:500',       
       // 'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048', 
    ]);
    
    if($request->has('full_name')){
        $user->full_name = $request->full_name;
    }
    if($request->has('email')){
        $user->email = $request->email;
    }
    if($request->has('phone_number')){
        $user->phone_number = $request->phone_number;
    }
    if($request->has('address')) {
        $user->address = $request->address;
    }
    
    $user->save();
    
    return response()->json([
        'message' => 'Profil mis à jour avec succès',
        'user' => $user->fresh()
    ]);
    }
    public function updatePassword(Request $request){
        $user = Auth::user();
         $request->validate([
        'current_password' => 'required|string',
        'new_password' => 'required|string|min:8',
        'new_password_confirmation' => 'required|string|same:new_password',
        ]);
        if(!Hash::check($request->current_password,$user->password)){
            return response()->json([
                'message' => 'Le mot de passe actuel est incorrect'
            ], 401);
        }
        $user->password = Hash::make($request->new_password);
        $user->save();
        return response()->json([
            'message' => 'Mot de passe modifié avec succès'
        ], 200);
        }
    
}
