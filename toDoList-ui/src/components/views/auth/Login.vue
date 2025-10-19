<script>
export const description =
  "A login form with email and password. There's an option to login with Google and a link to sign up if you don't have an account.";
export const iframeHeight = "600px";
export const containerClass =
  "w-full h-screen flex items-center justify-center px-4";
</script>

<script setup>
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import  {authStore} from '@/stores/authStore';

const route = useRouter();
const email = ref('');
const password = ref('');
const auth=authStore();
const login=async()=>{

  try{
      const response = await axios.post('http://127.0.0.1:8000/api/auth/login', {
      email: email.value,
      password: password.value,
    });

    if (response.status === 200) {
      auth.setUser(response.data,1111)
      console.log(response.data)
      alert('Connexion réussie');
      route.push('/home'); 
    }

  }catch(error){
      console.log(error)
  //  if (error.response && error.response.status === 401) {
      alert('Email ou mot de passe incorrect');
      console.log(error.message) 
}
};
</script>

<template>
 <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="w-3/5 max-w-2xl mx-auto">
  <Card class="mx-auto max-w-sm">
    <CardHeader>
      <CardTitle class="text-2xl"> Login </CardTitle>
      <CardDescription>
        Enter your email below to login to your account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input id="email" type="email" v-model="email" placeholder="m@example.com" required />
        </div>
        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="password">Password</Label>
            <a href="#" class="ml-auto inline-block text-sm underline">
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" v-model="password" required />
        </div>
        <Button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white" 
         @click="login"> Login </Button>
    <!--    <Button variant="outline" class="w-full"> Login with Google </Button>-->
      </div>
      <div class="mt-4 text-center text-sm">
        Don't have an account?
        <router-link to="/register" class="underline underline-offset-4 "> Sign up </router-link>
      </div>
    </CardContent>
  </Card>
  </div></div>
</template>
