<script setup>
import { ref } from "vue";
import { Button } from '@/components/ui/button'

const todos = ref([
  {title :"Tache 1", completed : true , date:null},
  {title :"Tache 2", completed : false , date:null},
  {title :"Tache 3", completed : false , date:null}
]);

const newTodo = ref('');

const addTodo=()=>{
  event.preventDefault()
  todos.value.push({
    title : newTodo,
    completed : false,
    date : Date.now()
  });
  newTodo.value = '';
  console.log(todos)
}
</script>
<template class="container py-8">
    <div class="container mx-auto py-8 px-4 max-w-2xl">

  <div v-if="todos.length === 0"> vous n'avez pas tache à faire .</div>
  <div v-else > 
    <div>vous avez {{todos.length}} tahces à faire .</div>
    <ul>
        <li 
          v-for = "todo in todos"
         :key= "todo.date"
          :class =" {completed : todo.completed}">
        <input type="checkbox" v-model = "todo.completed"/>
         {{todo}}
        </li>
    </ul>  
  </div>
  <form action="Post" @Submit.prevent="saveTodo">
    <fieldSet>
          <legend>Informations personnelles</legend>
          <input v-model = "newTodo"
            type="text"
            placeholder="Tache à effectuer">
          {{newTodo}}
          </input>
          <Button variant="default"
          :disabled = "newTodo.length === 0" 
          @click="addTodo">Ajouter </Button>
    </fieldSet>  
  </form>
</div>

</template>
<style scoped>
.completed {
  opacity : .5;
  text-decoration : line-through;
}
</style>
