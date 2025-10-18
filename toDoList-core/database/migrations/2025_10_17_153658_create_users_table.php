<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');            
            $table->string("email")->unique();
            $table->string('phone_number')->nullable();
            $table->string('address')->nullable();
            $table->string("password");
            $table->string('image')->nullable();
            $table->timestamps();
            $table->rememberToken();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
};


/**User::factory()
    ->has(Task::factory()->count(5)) // 👈 crée 5 tâches liées à cet utilisateur
    ->create(); */