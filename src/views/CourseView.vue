<script setup lang="ts">
import StudentInput from '@/components/StudentInput.vue'
import { Button } from '@/components/ui/button'
import { useFetch } from '@vueuse/core'
import { EditIcon } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

export type Student = {
  id: string
  name: string
  level: number
}

const HOST = 'http://localhost:3000'
const PATH = '/api/students'
const URL = HOST + PATH

const route = useRoute()

const { isFetching, error, data } = useFetch(URL + `?course=${route.params.id}`).json()

const students = computed(() => data.value)
const editMode = ref(false)

function addStudent(name: string, level: number) {
  students.value.push({ id: self.crypto.randomUUID(), name, level })
}

function toggleEditMode() {
  editMode.value = !editMode.value
}
</script>

<template>
  <main>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">{{ $route.query['name'] }}</h2>
      <Button variant="secondary" size="sm" @click="toggleEditMode"><EditIcon /></Button>
    </div>
    <StudentInput v-if="editMode" @add-student="addStudent" />
    <div v-for="student in students" v-bind:key="student.id">
      {{ student.name }} {{ student.level }}
    </div>
  </main>
</template>
