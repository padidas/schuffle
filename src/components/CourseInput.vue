<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Loader, Plus } from 'lucide-vue-next'
import { Label } from './ui/label'

defineProps<{
  isLoading: boolean
}>()
const emit = defineEmits<{
  (e: 'addCourse', name: string): void
}>()

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(2).max(30)
  })
)

const { errors, handleSubmit, resetForm } = useForm({
  validationSchema: formSchema
})

const onSubmit = handleSubmit((values) => {
  if (errors.value.name) {
    toast.error(errors.value.name)
    return
  }
  if (values.name) {
    emit('addCourse', values.name)
    resetInput()
  }
})

function resetInput() {
  resetForm()
}
</script>

<template>
  <form @submit="onSubmit" class="flex flex-col gap-4 mb-4 border-b pb-4">
    <div class="flex gap-4">
      <FormField v-slot="{ componentField }" name="name">
        <FormItem class="flex flex-col flex-[3]">
          <FormLabel>Kursbezeichnung</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Fach 9z" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <div class="flex flex-col justify-between">
        <Label></Label>
        <Button type="submit">
          <Loader v-if="isLoading" />
          <Plus v-else />
        </Button>
      </div>
    </div>
  </form>
</template>
