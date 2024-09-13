<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Check, Loader } from 'lucide-vue-next'
import { Label } from './ui/label'
import LevelInput from './LevelInput.vue'

defineProps<{
  isLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'addStudent', name: string, lvl: number): void
}>()

const DEFAULT_LEVEL = 2

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(2).max(30),
    level: z.number().min(1).max(3).default(DEFAULT_LEVEL)
  })
)

const { errors, handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    level: DEFAULT_LEVEL
  }
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
    emit('addStudent', values.name, values.level)
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
    <LevelInput @set-field-value="setFieldValue" />
    <div class="flex flex-col justify-between">
      <Label></Label>
      <Button type="submit">
        <Loader v-if="isLoading" />
        <Check v-else />
      </Button>
    </div>
  </form>
</template>
