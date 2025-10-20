<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

     public function getJWTIdentifier(){
        return $this->getKey();
     }
       public function getJWTCustomClaims()
    {
        // Tu peux ajouter des infos personnalisées au token ici (ex : rôle)
        return [];
    }

    protected $fillable = [
        'full_name',
        'email',
        'phone_number',
        'address',
        'image',
        'password',
    ];
    
    protected $hidden = [
        'password',
        'remember_token',
    ];
    public function tasks(){
        return $this->hasMany(Task::class);
    }
}
