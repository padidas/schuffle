<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFetch } from '@vueuse/core'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { EditIcon } from 'lucide-vue-next'
import CourseInput from '@/components/CourseInput.vue'

const {
  execute: fetchGet,
  isFetching: isFetchingGet,
  error: errorGet,
  data: data
} = useFetch('http://localhost:3000/api/courses').json()

const { execute: fetchPut, isFetching: isFetchingPut } = useFetch(
  'http://localhost:3000/api/courses',
  {
    immediate: false
  }
)
  .put()
  .json()

const CourseSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string()
  })
)

const courses = computed(() => verifyData(data.value))
const editMode = ref(false)

function verifyData(data: unknown): z.infer<typeof CourseSchema> | undefined {
  return CourseSchema.safeParse(data).data
}

function toggleEditMode() {
  editMode.value = !editMode.value
}

async function addCourse(name: string) {
  alert(`bla ${name}`)
  const { data } = useFetch('http://localhost:3000/api/courses').post().json()
  alert(`res ${data}`)
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
    <span v-if="errorGet !== null">Error! {{ errorGet }}</span>
    <span v-else-if="isFetchingGet">Loading...</span>
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
