<script setup lang="ts">
import { ref } from 'vue'
import { useFetch, type UseFetchOptions } from '@vueuse/core'
import { z } from 'zod'
import { EditIcon, XIcon } from 'lucide-vue-next'
import CourseInput from '@/components/CourseInput.vue'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { CourseArraySchema, CourseInsertSchema, CourseSchema } from '@/types/schemas'
import CourseItem from '@/components/CourseItem.vue'
import MainNav from '@/components/MainNav.vue'
import { useAuthStore } from '@/stores/authStore'

const { defaultFetchOptions, userName } = useAuthStore()

const HOST = import.meta.env.VITE_API_HOST
const PATH = '/api/courses'
const URL = HOST + PATH

const postOptions: UseFetchOptions = {
  immediate: false
}

const newCourse = ref<z.infer<typeof CourseInsertSchema>>()
const courses = ref<z.infer<typeof CourseArraySchema>>([])

const {
  execute: executeFetch,
  isFetching,
  error,
  onFetchResponse
} = useFetch(URL, defaultFetchOptions).json()

const {
  execute: executePost,
  isFetching: isPosting,
  onFetchResponse: onPostResponse
} = useFetch(URL, defaultFetchOptions, postOptions).post(newCourse).json()

onFetchResponse(async (res) => verifyFetchResponse(await res.json()))
onPostResponse(async (res) => verifyPostResponse(await res.json()))

function verifyFetchResponse(data: Promise<any>) {
  const result = CourseArraySchema.safeParse(data)
  if (!result.success) {
    // handle error then return
    result.error
  } else {
    courses.value = result.data
  }
}

function verifyPostResponse(data: unknown) {
  const result = CourseSchema.safeParse(data)
  if (!result.success) {
    // handle error then return
    result.error
  } else {
    courses.value = [...courses.value, result.data]
  }
}

async function addCourse(name: string) {
  newCourse.value = { name }

  await executePost(true)
}

const editMode = ref(false)
function toggleEditMode() {
  editMode.value = !editMode.value
  if (!editMode.value) executeFetch()
}
</script>

<template>
  <MainNav />
  Hi, {{ userName }}!
  <main class="flex flex-col overflow-hidden flex-1 relative items-center">
    <div class="flex w-full justify-end items-center mb-3">
      <Button size="sm" variant="ghost" @click="toggleEditMode">
        <template v-if="editMode"> <XIcon class="w-4 h-4 mr-2" />Beenden </template>
        <template v-else><EditIcon class="w-4 h-4 mr-2" />Bearbeiten </template>
      </Button>
    </div>
    <ScrollArea class="w-full flex h-auto pr-3 pb-12">
      <div class="flex flex-col gap-2">
        <CourseItem v-for="course of courses" :course="course" :key="course.id" :editMode />
        <template v-if="isFetching && courses.length === 0">
          <Skeleton v-for="n in 3" :key="n" class="w-full h-12" />
        </template>
      </div>
      <span v-if="error !== null">Error! {{ error }}</span>
    </ScrollArea>

    <div class="flex justify-end items-center gap-3 absolute bottom-2 right-2">
      <div class="bg-background rounded-md">
        <CourseInput @addCourse="addCourse" :isLoading="isPosting" />
      </div>
    </div>
  </main>
</template>

<style global>
.v-enter-active {
  transition: opacity 0.5s ease;
}

.v-leave-active {
  transition: opacity 0.3s ease-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
