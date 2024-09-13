<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Slider } from './ui/slider'
import { Loader, Plus } from 'lucide-vue-next'
import { Label } from './ui/label'

defineProps<{
  isLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'addStudent', name: string, lvl: number): void
}>()

const DEFAULT_LEVEL = [2]

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(2).max(30),
    level: z.array(z.number().min(1).max(5)).default(DEFAULT_LEVEL)
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
  if (errors.value.level) {
    toast.error(errors.value.level)
    return
  }
  if (values.name && values.level) {
    emit('addStudent', values.name, values.level[0])
    resetInput()
  }
})

function resetInput() {
  resetForm()
}

function getPlaceholder() {
  const names = ['Hodor', 'Jon', 'Arya', 'Tyrion', 'Bran', 'Jaime']
  const index = Math.floor(Math.random() * names.length)
  return names[index]
}
</script>

<template>
  <form @submit="onSubmit" class="flex gap-4 mb-4 border p-4 rounded-md">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem class="flex flex-col flex-[2]">
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input type="text" :placeholder="getPlaceholder()" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField, value }" name="level">
      <FormItem class="flex flex-col flex-1">
        <FormLabel>Level: {{ value?.[0] }}</FormLabel>
        <FormControl class="flex flex-grow">
          <Slider :default-value="DEFAULT_LEVEL" :min="1" :max="3" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <div class="flex flex-col justify-between">
      <Label></Label>
      <Button type="submit" size="icon">
        <Loader v-if="isLoading" />
        <Plus v-else />
      </Button>
    </div>
  </form>
</template>
