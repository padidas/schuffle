<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { BookPlusIcon, LoaderIcon } from 'lucide-vue-next'
import { Label } from './ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

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
    toast.success(`${values.name} wurde hinzugefügt.`)
    resetForm()
  }
})
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline"><BookPlusIcon class="w-4 h-4 mr-2" /> Kurs hinzufügen </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Kurs hinzufügen</DialogTitle>
      </DialogHeader>
      <form class="flex flex-col" @submit="onSubmit">
        <div class="flex my-4">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem class="flex flex-col flex-[3]">
              <FormLabel>Kursbezeichnung</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Fach 9z" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Label></Label>
        </div>
        <DialogFooter class="flex flex-row justify-end">
          <Button type="submit">
            <template v-if="isLoading"><LoaderIcon class="w-4 h-4 mr-2" /> Lädt</template>
            <template v-else><BookPlusIcon class="w-4 h-4 mr-2" /> Hinzufügen</template>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
