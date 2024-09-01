<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Slider } from './ui/slider'
import { Check } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'addStudent', name: string, lvl: number): void
}>()

const DEFAULT_LEVEL = [3]

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
  <form @submit="onSubmit" class="flex flex-col gap-4">
    <div class="flex gap-4">
      <FormField v-slot="{ componentField }" name="name">
        <FormItem class="flex-[3]">
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Hodor" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField, value }" name="level">
        <FormItem class="flex-1">
          <FormLabel>Level: {{ value?.[0] }}</FormLabel>
          <FormControl>
            <Slider :default-value="DEFAULT_LEVEL" :max="5" :min="1" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>
    <Button type="submit"> <Check /> </Button>
  </form>
</template>
