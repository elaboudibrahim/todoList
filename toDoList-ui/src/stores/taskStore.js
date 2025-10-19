import { defineStore } from "pinia";
import axios from "axios";
export const taskStore = defineStore('tasks',{
    state:()=>({
        todos:[],
        remaining:[],
        done:[]
    }),
    getters:{
            remaining : (state)=>state.todos.filter(t=>!t.completed),
            done : (state)=>state.todos.filter(t=>t.completed),
            countRemains: (state) => state.todos.filter((t) => !t.completed).length,
            countDone: (state) => state.todos.filter((t) => t.completed).length,
        },
        actions : {

        async fetchTask (){
            try{
                const response = await axios.get("http://127.0.0.1:8000/api/tasks");
                this.todos = response.data;
                tasks.setter(todos.value)
            }catch(error){
                console.error("erreur api: ",error);
            }
            },

        setter(todos){
            this.todos=todos;
        },
        countRemains(){
            return this.remaining.length();
        },
        countDone(){
            return this.done.length();
            
        }
    }
})