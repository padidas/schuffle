<script setup lang="ts">
import type { StudentSchema } from '@/types/schemas'
import { z } from 'zod'
import { Button } from './ui/button'
import { Check, EyeIcon, EyeOffIcon, Loader, Trash } from 'lucide-vue-next'
import { useFetch } from '@vueuse/core'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useHiddenStudentsStore } from '@/stores/hiddenStudents'

const props = defineProps<{
  student: z.infer<typeof StudentSchema>
  editMode: boolean
}>()

const emit = defineEmits<{
  (e: 'fetchStudents'): void
}>()

const { hiddenStudents, hide, show } = useHiddenStudentsStore()

const HOST = 'http://localhost:3000'
const PATH = '/api/students'
const URL = HOST + PATH
const fetchOptions = {
  immediate: false
}

const {
  execute: executeDelete,
  isFetching: isFetchingDelete,
  isFinished,
  error: errorDelete
} = useFetch(URL + `?id=${props.student.id}`, fetchOptions).delete()

const studentUpdate = ref<Partial<z.infer<typeof StudentSchema>>>()

const {
  execute: executePut,
  isFetching: isFetchingPut,
  error: errorPut
} = useFetch(URL + `?id=${props.student.id}`, fetchOptions)
  .put(studentUpdate)
  .json()

async function handleDelete() {
  await executeDelete()
  if (errorDelete.value) toast.error(`${props.student.name} konnte nicht gelöscht werden.`)
  else toast.success(`${props.student.name} wurde gelöscht.`)
  emit('fetchStudents')
}

const levelSchema = z.number().min(1).max(3)

async function handleLevelChange(level: string) {
  const newLevel = Number(level)
  const levelValidation = levelSchema.safeParse(newLevel)
  if (!levelValidation.success) {
    toast.error(getZodErrorMessage(levelValidation.error))
    return
  }

  studentUpdate.value = { level: newLevel }
  await executePut()
  if (errorPut.value) toast.error(JSON.stringify(errorPut.value))
  else toast.success(`Level von ${props.student.name} wurde auf ${newLevel} geändert.`)
  emit('fetchStudents')
}

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(2).max(30)
  })
)

const { errors, handleSubmit } = useForm({
  validationSchema: formSchema
})

const onSubmit = handleSubmit(async (values) => {
  if (errors.value.name) {
    toast.error(errors.value.name)
    return
  }

  const oldName = props.student.name

  studentUpdate.value = { name: values.name }
  await executePut()
  if (errorPut.value) toast.error(JSON.stringify(errorPut.value))
  else toast.success(`Name wurde geändert: ${oldName} → ${values.name}`)
  emit('fetchStudents')
})

function getZodErrorMessage(error: z.ZodError): string {
  const message = error.message
  const parsedMessage = JSON.parse(message) as Array<{ message: string }>
  const zodError = parsedMessage[0]
  if (!zodError) throw Error('Zod is broken')
  return zodError.message
}
</script>

<template>
  <div
    class="flex items-center justify-between space-x-4 rounded-md border p-3"
    :class="{ 'bg-red-950': isFinished }"
  >
    <Transition mode="out-in">
      <div v-if="editMode" class="flex justify-between w-full">
        <form @submit="onSubmit" class="flex gap-3 items-center">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem class="flex flex-col">
              <FormControl>
                <Input
                  type="text"
                  class="w-32"
                  size="sm"
                  v-bind="componentField"
                  :model-value="student.name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button type="submit" size="icon">
            <Loader v-if="isFetchingPut" />
            <Check v-else />
          </Button>
        </form>
        <div class="flex gap-3 items-center">
          <ToggleGroup
            :model-value="student.level.toString()"
            @update:model-value="handleLevelChange"
          >
            <ToggleGroupItem value="1">1</ToggleGroupItem>
            <ToggleGroupItem value="2">2</ToggleGroupItem>
            <ToggleGroupItem value="3">3</ToggleGroupItem>
          </ToggleGroup>
          <Button variant="ghost" size="icon" @click="handleDelete">
            <Loader v-if="isFetchingDelete" class="h-5" />
            <Check v-else-if="isFinished" class="h-5" />
            <Trash v-else class="h-5 text-destructive" />
          </Button>
        </div>
      </div>
      <div
        v-else
        class="flex w-full justify-between"
        :class="{ 'text-muted': hiddenStudents.some((elem) => elem === student.id) }"
      >
        {{ student.name }}
        <div class="-my-2">
          <Button
            v-if="hiddenStudents.some((elem) => elem === student.id)"
            @click="show(student.id)"
            variant="ghost"
            size="icon"
            ><EyeOffIcon class="w-5"
          /></Button>
          <Button v-else @click="hide(student.id)" variant="ghost" size="icon"
            ><EyeIcon class="w-5"
          /></Button>
        </div>
      </div>
    </Transition>
  </div>
</template>
