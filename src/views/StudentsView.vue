<script setup lang="ts">
import StudentInput from '@/components/StudentInput.vue'
import StudentItem from '@/components/StudentItem.vue'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useFetchGetStudents } from '@/composables/useFetchGetStudents'
import { useFetchPostStudents } from '@/composables/useFetchPostStudent'
import { Dices, EditIcon } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

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

function getRandomInt() {
  const minCeiled = Math.ceil(100000)
  const maxFloored = Math.floor(999999)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}
</script>

<template>
  <main class="flex flex-col overflow-hidden flex-1 relative items-center">
    <Transition>
      <StudentInput v-if="editMode" @add-student="addStudent" :isLoading="isFetchingPost" />
    </Transition>

    <ScrollArea class="border w-full flex h-auto rounded-md p-3">
      <h3 class="text-lg font-semibold mb-3">Students</h3>

      <div class="flex flex-col gap-2">
        <template v-for="student in students" v-bind:key="student.id">
          <StudentItem :edit-mode="editMode" :student="student" @fetch-students="execute" />
        </template>
        <template v-if="isInitiallyFetching">
          <Skeleton v-for="n in 3" :key="n" class="w-full h-12" />
        </template>
      </div>

      <h3 class="text-lg font-semibold mt-4 mb-3">Group History</h3>
    </ScrollArea>

    <div class="flex justify-end items-center gap-2 absolute bottom-2 right-2">
      <RouterLink :to="`/${courseId}/shuffle/?name=${courseName}`">
        <div class="bg-background rounded-md">
          <Button size="sm"><Dices class="w-4 h-4 mr-2" /> Shuffle </Button>
        </div>
      </RouterLink>
      <div class="bg-background rounded-md">
        <Button size="sm" variant="secondary" @click="toggleEditMode"
          ><EditIcon class="w-4 h-4 mr-2" /> Edit</Button
        >
      </div>
    </div>
  </main>
</template>
