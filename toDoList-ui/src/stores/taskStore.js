import { defineStore } from "pinia";
import axios from "axios";


// export const taskStore = defineStore('tasks', {
//   state: () => ({
//     tasks: [],
//   }),
//   getters: {
//     remainingCount: (state) => {
//       return state.tasks.filter(t => !t.completed).length;
//     },
//     completedCount: (state) => {
//       return state.tasks.filter(t => t.completed).length;
//     }
//   },
//   actions: {
//     setter(newTasks) {
//       this.tasks = newTasks;
//     }
//   }
// });
export const taskStore = defineStore('tasks',{
    state:()=>({
        todos:[],
        isLoading :false,
        error:null,
    }),
    getters:{
            remaining : (state)=>state.todos.filter(t=>!t.completed),
            completedCount : (state)=>state.todos.filter(t=>t.completed),
            done : (state)=>state.todos.filter(t=>t.completed),
            countRemains: (state) => state.todos.filter((t) => !t.completed).length,
            countDone: (state) => state.todos.filter((t) => t.completed).length,
            completionPercentage: (state)=>{
               completed= state.todos.filter(t=>t.completed).length;
               return Math.round((completed / state.todos.length) * 100);
            }
        },
        actions : {

        async fetchTask (token){
            this.isLoading=true;
            this.error=null;
            try{
                const response = await axios.get("http://127.0.0.1:8000/api/tasks",{
                headers:{
                    Authorization : `Bearer ${token}`
                }
            });
            this.todos = response.data;
            return{success:true, data:response.data}
            }catch(error){
                console.error("erreur api: ",error);
            }finally{
            this.isLoading=false;
            }
        },
        async addTodo(todo,token){
            try{
                const response = await axios.post(
                    "http://127.0.0.1:8000/api/tasks/",
                    todo,
                    {
                    headers:{
                        Authorization : `Bearer ${token}`
                }});
                this.todos.push(todo);
                return{success:true,
                    data:response.data,
                    message:`Tâche "${todo.title}" créée avec succès!`
                }
                }catch(error){
                    console.log("Erreur lors de la création :", error)
                    return { 
                    success: false, 
                    error: error.message,
                    message: "Erreur lors de la création"
                    };
                }
        },  
        async updateTodo(todoId,updatedData,token){
            this.isLoading = true;
            this.error = null;
            try{
                const response =await axios.put(`
                    http://127.0.0.1:8000/api/tasks/:${todoId}`,
                    updatedData,
                    {
                    headers:{
                        Authorization : `Bearer ${token}`
                    }
                });
            const index = this.todos.filter(t=>t===todoId);
            if(index!== -1){
                this.todos[index]=updatedData;
            }   
            return {
                success:true,
                data:response.data, 
                message:`Tâche modifiée avec succès!`
            }; 
            }catch(error){
                console.error("Erreur mise à jour:", error);
            return { 
            success: false, 
            error: error.message,
            message: "Erreur lors de la mise à jour"
            };
            }finally{
                this.isLoading=false;
            }
        },
        async deleteTask(taskId, token) {
            this.isLoading=true;
            this.error=null;
            try{
            const response = await axios.delete(`http://127.0.0.1:8000/api/tasks/:${taskId}`,
            {
            headers:{
                Authorization : `Bearer ${token}`
            }})
            this.todos = this.todos.filter(t => t.id !== taskId);
            return { 
            success: true,
            message: "Tâche supprimée avec succès!"
            };
            }catch(error){
            console.error("Erreur suppression:", error);
            return { 
            success: false, 
            error: error.message,
            message: "Erreur lors de la suppression"
            };
            }finally{
                this.isLoading=false
            }
        },
        setter(todos){
            this.todos=todos;
        },
        // countRemains(){
        //     return this.remaining.length();
        // },
        // countDone(){
        //     return this.done.length();
        // },
        reset() {
        this.todos = [];
        this.isLoading = false;
        this.error = null;
        },
    }
})