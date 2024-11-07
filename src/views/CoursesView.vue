<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '@vueuse/core'
import { z } from 'zod'
import { ArrowRightIcon } from 'lucide-vue-next'
import CourseInput from '@/components/CourseInput.vue'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'

const HOST = import.meta.env.VITE_API_HOST
const PATH = '/api/courses'
const URL = HOST + PATH

const postOptions = {
  immediate: false
}
const newCourse = ref<z.infer<typeof CourseSchema>>()
const courses = ref<z.infer<typeof CourseArraySchema>>([])

const { isFetching, error, onFetchResponse } = useFetch(URL).json()
const {
  execute: executePost,
  isFetching: isPosting,
  onFetchResponse: onPostResponse
} = useFetch(URL, postOptions).post(newCourse).json()

onFetchResponse(async (res) => verifyFetchResponse(await res.json()))
onPostResponse(async (res) => verifyPostResponse(await res.json()))

const CourseSchema = z.object({
  id: z.number(),
  name: z.string()
})
const CourseArraySchema = z.array(CourseSchema)

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
  newCourse.value = { name, id: getRandomInt() }

  await executePost(true)
}

function getRandomInt() {
  const minCeiled = Math.ceil(100000)
  const maxFloored = Math.floor(999999)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}
</script>

<template>
  <main class="flex flex-col overflow-hidden flex-1 relative items-center">
    <ScrollArea class="w-full flex h-auto pr-3">
      <div class="flex flex-col gap-2">
        <RouterLink
          v-for="course in courses"
          :to="`/${course.id}?name=${course.name}`"
          v-bind:key="course.id"
          class="flex items-center justify-between space-x-4 rounded-md border p-3"
          >{{ course.name }}
          <div class="w-16 -my-1 h-8 flex items-center justify-center bg-primary rounded">
            <ArrowRightIcon class="text-secondary" /></div
        ></RouterLink>
        <template v-if="isFetching">
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
