<script setup>
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  isDeleting: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['cancel', 'confirm']);


const handleCancel =()=>{
  emit('cancel');
}
const handleConfirm = ()=>{
  emit('confirm');
}
</script>
<template>
<AlertDialog :open="props.open" @update:open="(value) => !value && emit('cancel')">
   <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirmez la suppression</AlertDialogTitle>
        <AlertDialogDescription>
          Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div class="flex gap-3 justify-end">
        <AlertDialogCancel @click="handleCancel">
          Annuler
        </AlertDialogCancel>
        <AlertDialogAction 
          @click="handleConfirm"
          :disabled="props.isDeleting"
          class="bg-red-600 hover:bg-red-700"
        >
          {{ props.isDeleting ? 'Suppression...' : 'Supprimer' }}
        </AlertDialogAction>
      </div>
    </AlertDialogContent>
  </AlertDialog>
</template>

<style scoped>
/* Cibler le parent AlertDialog avec une classe */
:deep(.custom-alert [data-radix-dialog-overlay]) {
  background-color: transparent !important;
}
</style>