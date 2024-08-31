<script setup lang="ts">
import StudentInput from '@/components/StudentInput.vue'
import { ref } from 'vue'

export type Student = {
  id: string
  name: string
  level: number
}

const students = ref<Array<Student>>([])

function addStudent(name: string, level: number) {
  students.value.push({ id: self.crypto.randomUUID(), name, level })
}
</script>

<template>
  <main>
    <StudentInput @add-student="addStudent" />
    <div v-for="student in students" v-bind:key="student.id">
      {{ student.name }} {{ student.level }}
    </div>
  </main>
</template>
