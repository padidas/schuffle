<script setup lang="ts">
import type { StudentSchema } from '@/types/schemas'
import { z } from 'zod'
import { Button } from './ui/button'
import { Check, Loader, Trash } from 'lucide-vue-next'
import { useFetch } from '@vueuse/core'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput
} from '@/components/ui/number-field'

const props = defineProps<{
  student: z.infer<typeof StudentSchema>
  editMode: boolean
}>()

const emit = defineEmits<{
  (e: 'fetchStudents'): void
}>()

const HOST = 'http://localhost:3000'
const PATH = '/api/students'
const URL = HOST + PATH
const fetchOptions = {
  immediate: false
}

const {
  execute: executeDelete,
  isFetching: isFetchingDelete,
  isFinished
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
  emit('fetchStudents')
}

const levelSchema = z.number().min(1).max(3)

async function changeLevel(level: number) {
  const levelValidation = levelSchema.safeParse(level)
  if (!levelValidation.success) {
    toast.error(getZodErrorMessage(levelValidation.error))
    return
  }

  studentUpdate.value = { level }
  await executePut()
  if (errorPut.value) toast.error(JSON.stringify(errorPut.value))
  emit('fetchStudents')
}

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
    <span>{{ student.name }}</span>
    <Transition>
      <div class="flex gap-2 items-center" v-if="editMode">
        <NumberField
          id="age"
          :min="1"
          :max="3"
          :model-value="student.level"
          @update:model-value="(v) => changeLevel(v)"
          class="w-24"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <Button variant="ghost" size="sm" class="p-2" @click="handleDelete">
          <Loader v-if="isFetchingDelete" class="h-5" />
          <Check v-else-if="isFinished" class="h-5" />
          <Trash v-else class="h-5" />
        </Button>
      </div>
    </Transition>
  </div>
</template>
