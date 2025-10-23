import { defineStore } from "pinia";
import axios from "axios";

export const authStore = defineStore("auth",{
    state : ()=>({
        user : null,
        token : null,
        isSaving:false,
        isEditing:false
    }),

    actions : {
        setUser(user, token){ 
            this.user= user;
            this.token=token;
            
            localStorage.setItem('user',JSON.stringify(user));
            localStorage.setItem("token",token);
        },
        getUser(){
            return {
                user:this.user,
                token:this.token
            }
        },
        loadUser(){
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('token');
            if(storedUser && storedToken){
                this.user=JSON.parse(storedUser);
                this.token= storedToken;
            }
        },
        logout(){
            this.user=null;
            this.token=null;
            localStorage.removeItem('user');
            localStorage.removeItem("token");
        },
        async updateProfile (formData,token) {
            this.isSaving = true;
            try {
                const response = await axios.post(
                'http://127.0.0.1:8000/api/user/update',
                formData,
                {
                    headers: {
                    'Authorization': `Bearer ${token}`,
                    }
                }
                );
               this.isEditing = false;
               this.setUser(response.data.user,token)
               return { 
                    success: true, 
                    message: 'Profil mis à jour avec succès!',
                    user: response.data.user 
                };
            } catch (error) {
                console.error('Erreur mise à jour:', error);
               return { 
                    success: false, 
                    message: 'Erreur lors de la mise à jour' 
                };
            } finally {
                this.isSaving = false;
            }
        },
        async updatePassword(passwordForm,token){
            try{
                 const response = await axios.post(
                'http://127.0.0.1:8000/api/user/update-password',
                passwordForm.value,
                {
                    headers: {
                    'Authorization': `Bearer ${token}`
                    }
                }
                );
                return {success :true, message : 'Mot de passe modifié avec succès!'}
            }catch(error){
                console.error('Erreur mot de passe:', error);
                return{  
                    success:false ,
                    "message" :'Erreur lors de la modification du mot de passe'
                }
            }
        }
                
    }

});