import { defineStore } from "pinia";

export const authStore = defineStore("auth",{
    state : ()=>({
        user : null,
        token : null
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
        }
    }

});