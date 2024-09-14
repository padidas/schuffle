<script setup lang="ts">
import StudentInput from '@/components/StudentInput.vue'
import StudentItem from '@/components/StudentItem.vue'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useFetchGetStudents } from '@/composables/useFetchGetStudents'
import { useFetchPostStudents } from '@/composables/useFetchPostStudent'
import { StudentSchema } from '@/types/schemas'
import { Dices, EditIcon } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { z } from 'zod'

export type Student = {
  id: string
  name: string
  level: number
}

const route = useRoute()
const courseId = route.params.id
const courseName = route.query['name']

const { execute, isFetching, error, students } = useFetchGetStudents(courseId)
const { isFetching: isFetchingPost, executeWithPayload } = useFetchPostStudents()

const editMode = ref(false)
const isInitiallyFetching = computed(() => isFetching && students.value === undefined)

async function addStudent(name: string, level: number) {
  const newStudent = {
    name,
    level,
    id: getRandomInt(),
    courseId: +courseId
  }
  await executeWithPayload(newStudent)
  execute()
}

function toggleEditMode() {
  editMode.value = !editMode.value
}

// function shuffle() {
//   toast('schuffeling')

//   const ones = students.value?.filter((stud) => stud.level === 1)
//   const twos = students.value?.filter((stud) => stud.level === 2)
//   const threes = students.value?.filter((stud) => stud.level === 3)
// }

function getRandomInt() {
  const minCeiled = Math.ceil(100000)
  const maxFloored = Math.floor(999999)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}
</script>

<template>
  <main>
    <div class="flex justify-between items-center mb-3">
      <h2 class="text-xl font-semibold">{{ courseName }}</h2>
      <div class="flex">
        <RouterLink :to="`/shuffle/${courseId}?name=${courseName}`">
          <Button size="sm"><Dices class="w-4 h-4 mr-2" /> Shuffle </Button>
        </RouterLink>
      </div>
    </div>
    <div class="flex justify-between items-center mb-2">
      <h3 class="text-lg font-semibold">Student List</h3>
      <Button size="sm" variant="ghost" @click="toggleEditMode"
        ><EditIcon class="w-4 h-4 mr-2" /> Edit</Button
      >
    </div>
    <Transition>
      <StudentInput v-if="editMode" @add-student="addStudent" :isLoading="isFetchingPost" />
    </Transition>
    <div class="flex flex-col gap-2">
      <template v-for="student in students" v-bind:key="student.id">
        <StudentItem :edit-mode="editMode" :student="student" @fetch-students="execute" />
      </template>
      <template v-if="isInitiallyFetching">
        <Skeleton v-for="n in 3" :key="n" class="w-full h-12" />
      </template>
    </div>
    <h3 class="text-lg font-semibold mt-4 mb-2">Group History</h3>
  </main>
</template>
