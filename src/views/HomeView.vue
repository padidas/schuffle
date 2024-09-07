<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFetch } from '@vueuse/core'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { EditIcon } from 'lucide-vue-next'
import CourseInput from '@/components/CourseInput.vue'

const HOST = 'http://localhost:3000'
const PATH = '/api/courses'
const URL = HOST + PATH

const postOptions = {
  immediate: false
}
const newCourse = ref<z.infer<typeof CourseSchema>>()

const { isFetching, error, data } = useFetch(URL).json()

const {
  execute: fetchPost,
  isFetching: isFetchingPost,
  data: dataPost
} = useFetch(URL, postOptions).post(newCourse).json()

const CourseSchema = z.object({
  id: z.number(),
  name: z.string()
})
const CourseArraySchema = z.array(CourseSchema)

const courses = computed(() => {
  if (dataPost.value) return verifyData(dataPost.value)
  else return verifyData(data.value)
})

const editMode = ref(false)

function verifyData(data: unknown): z.infer<typeof CourseArraySchema> | undefined {
  return CourseArraySchema.safeParse(data).data
}

function toggleEditMode() {
  editMode.value = !editMode.value
}

async function addCourse(name: string) {
  newCourse.value = { name, id: getRandomInt() }

  await fetchPost(true)
}

function getRandomInt() {
  const minCeiled = Math.ceil(100000)
  const maxFloored = Math.floor(999999)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}
</script>

<template>
  <main class="flex flex-col gap-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Kurse</h2>
      <Button variant="outline" size="sm" @click="toggleEditMode"><EditIcon /></Button>
    </div>
    <Transition>
      <CourseInput v-if="editMode" @addCourse="addCourse" />
    </Transition>
    <RouterLink
      v-for="course in courses"
      :to="`/courses/${course.id}?name=${course.name}`"
      v-bind:key="course.id"
      >{{ course.name }}</RouterLink
    >
    <span v-if="error !== null">Error! {{ error }}</span>
    <span v-else-if="isFetching || isFetchingPost">Loading...</span>
  </main>
</template>

<style>
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
