<script setup lang="ts">
import type { z } from 'zod'
import { CourseSchema } from '@/types/schemas'
import { ArrowRightIcon, CheckIcon, LoaderIcon, TrashIcon } from 'lucide-vue-next'
import { Button } from './ui/button'
import { toast } from 'vue-sonner'
import { useFetch } from '@vueuse/core'
import { useAuthStore } from '@/stores/authStore'

const { course } = defineProps<{
  course: z.infer<typeof CourseSchema>
  editMode: boolean
}>()

const HOST = import.meta.env.VITE_API_HOST
const PATH = `/api/courses/${course.id}`
const URL = HOST + PATH
const fetchOptions = {
  immediate: false
}

const { defaultFetchOptions } = useAuthStore()

const {
  execute: executeDelete,
  isFetching: isDeleting,
  isFinished,
  error: deleteError
} = useFetch(URL, defaultFetchOptions, fetchOptions).delete()

async function handleDelete() {
  await executeDelete()
  if (deleteError.value) toast.error(`${course.name} konnte nicht gelöscht werden.`)
  else toast.success(`${course.name} wurde gelöscht.`)
}
</script>

<template>
  <div
    class="flex h-14 items-center justify-between space-x-4 rounded-md border p-3"
    :class="{ 'bg-red-950': isFinished }"
  >
    {{ course.name }}
    <Transition mode="out-in">
      <div v-if="editMode && isFinished && !deleteError" class="flex">
        gelöscht<CheckIcon class="ml-1.5" />
      </div>
      <Button v-else-if="editMode" class="-my-1" variant="ghost" size="icon" @click="handleDelete">
        <LoaderIcon v-if="isDeleting" class="h-5" />
        <TrashIcon v-else class="h-5 text-destructive" />
      </Button>

      <Button v-else class="-my-1" size="icon">
        <RouterLink :to="`/${course.id}?name=${course.name}`">
          <ArrowRightIcon class="text-secondary" />
        </RouterLink>
      </Button>
    </Transition>
  </div>
</template>
