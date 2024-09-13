<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Slider } from './ui/slider'
import { Check, Loader } from 'lucide-vue-next'

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
</script>

<template>
  <form @submit="onSubmit" class="flex flex-col gap-4 mb-4 border-b pb-4">
    <div class="flex gap-4">
      <FormField v-slot="{ componentField }" name="name">
        <FormItem class="flex flex-col flex-[3]">
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Hodor" v-bind="componentField" />
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
    </div>
    <Button type="submit">
      <Loader v-if="isLoading" />
      <Check v-else />
    </Button>
  </form>
</template>
