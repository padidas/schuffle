<script setup lang="ts">
import StudentInput from '@/components/StudentInput.vue'
import StudentItem from '@/components/StudentItem.vue'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StudentArraySchema, StudentSchema } from '@/types/schemas'
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

const { execute, isFetching, error, data } = useFetch(URL + `?course=${courseId}`).json()
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
const isInitiallyFetching = computed(() => isFetching && students.value === undefined)

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
      <template v-for="student in students" v-bind:key="student.id">
        <StudentItem :edit-mode="editMode" :student="student" @fetch-students="execute" />
      </template>
      <Skeleton v-if="isInitiallyFetching" class="w-full h-12" />
      <Skeleton v-if="isInitiallyFetching" class="w-full h-12" />
      <Skeleton v-if="isInitiallyFetching" class="w-full h-12" />
    </div>
    <span v-if="error !== null">Error! {{ error }}</span>
  </main>
</template>
