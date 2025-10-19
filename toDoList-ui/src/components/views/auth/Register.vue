<script>
export const description =
  "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account";
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
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';


const route= useRouter();

const firstName = ref('')
const lastName = ref('');
const email = ref('');
const password = ref('');
const phone_number = ref('');
const address = ref('');
const image = ref(null);

const saveUser= async ()=>{
  try{
       const formData = new FormData();
              formData.append('full_name',`${firstName.value} ${lastName.value}`);
              formData.append('email',email.value);
              formData.append('phone_number',phone_number.value);
              formData.append('address',address.value);
              formData.append('password',password.value);
              formData.append('image',image);
        const response = await axios.post(`http://127.0.0.1:8000/api/auth/register`,formData,{
          headers: { 'Content-Type': 'multipart/form-data' },
        });
         console.log(response);
         route.push("/login") 
  }catch(error){
    console.error(error);
    alert('Erreur lors de l\'inscription');
  }
}
</script>

<template>
   <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="w-3/5 max-w-2xl mx-auto">
  <Card >
    <CardHeader>
      <CardTitle class="text-xl"> Sign Up </CardTitle>
      <CardDescription>
        Enter your information to create an account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="first-name">First name</Label>
            <Input id="first-name" v-model="firstName" placeholder="Exe: Brahim" required />
          </div>
          <div class="grid gap-2">
            <Label for="last-name">Last name</Label>
            <Input id="last-name" v-model="lastName" placeholder="Exe: EL ABOUDI" required />
          </div>
        </div>
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input id="email" type="email" v-model="email" placeholder="Exe: brahimelaboudi1@gmail.com" required />
        </div>
        <div class="grid gap-2">
              <Label for="phone">Phone Number</Label>
              <Input id="phone" type="tel" v-model="phone_number" placeholder="+212 637 700 717" required />
            </div>
        <div class="grid gap-2">
          <Label for="password">Password</Label>
          <Input id="password" v-model="password" type="password" required />
        </div>
         <div class="grid gap-2">
              <Label for="address">Address</Label>
              <Input id="address" v-model="address" placeholder="Res , City, Country" required />
          </div>
        <!-- Image Upload -->
            <div class="grid gap-2">
              <Label for="image">Profile Image</Label>
              <Input id="image" type="file" accept="image/*" />
            </div>
        <Button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white"
              @click="saveUser"> Create an account </Button>
    <!-- 
        <Button variant="outline" class="w-full"> Sign up with GitHub </Button>
    -->
       </div>
      <div class="mt-4 text-center text-sm">
        Already have an account?
        <router-link to="/login" class="underline"> Login</router-link>
      </div>
    </CardContent>
  </Card>
  </div></div>
</template>
