<script setup lang="ts">
import StudentInput from '@/components/StudentInput.vue'
import { Button } from '@/components/ui/button'
import { useFetch } from '@vueuse/core'
import { EditIcon } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { z } from 'zod'

export type Student = {
  id: string
  name: string
  level: number
}

const HOST = 'http://localhost:3000'
const PATH = '/api/students'
const URL = HOST + PATH
const postOptions = {
  immediate: false
}

const route = useRoute()
const courseId = route.params.id

const newStudent = ref<z.infer<typeof StudentSchema>>()

const { isFetching, error, data } = useFetch(URL + `?course=${courseId}`).json()
const {
  execute: executePost,
  isFetching: isFetchingPost,
  data: dataPost
} = useFetch(URL, postOptions).post(newStudent).json()

const students = computed(() => {
  if (dataPost.value) return verifyData(dataPost.value)
  else return verifyData(data.value)
})
const editMode = ref(false)

const StudentSchema = z.object({
  id: z.number(),
  name: z.string(),
  level: z.number().min(1).max(3),
  courseId: z.number()
})
const StudentArraySchema = z.array(StudentSchema)

function verifyData(data: unknown): z.infer<typeof StudentArraySchema> | undefined {
  return StudentArraySchema.safeParse(data).data
}

function addStudent(name: string, level: number) {
  newStudent.value = {
    name,
    level,
    id: getRandomInt(),
    courseId: +courseId
  }
  executePost()
}

function toggleEditMode() {
  editMode.value = !editMode.value
}

function getRandomInt() {
  const minCeiled = Math.ceil(100000)
  const maxFloored = Math.floor(999999)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}
</script>

<template>
  <main>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">{{ $route.query['name'] }}</h2>
      <Button variant="ghost" size="sm" @click="toggleEditMode"><EditIcon /></Button>
    </div>
    <Transition>
      <StudentInput v-if="editMode" @add-student="addStudent" :isLoading="isFetchingPost" />
    </Transition>

    <div class="flex flex-col gap-2">
      <div
        v-for="student in students"
        v-bind:key="student.id"
        class="flex items-center justify-between space-x-4 rounded-md border p-3"
      >
        <span>{{ student.name }}</span>
        <div
          class="bg-primary text-primary-foreground font-semibold text-sm rounded-full w-6 h-6 text-center content-center"
        >
          {{ student.level }}
        </div>
      </div>
    </div>
    <span v-if="error !== null">Error! {{ error }}</span>
    <span v-else-if="isFetching">Loading...</span>
  </main>
</template>
