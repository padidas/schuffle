<script setup lang="ts">
import { useFetchGetStudents } from '@/composables/useFetchGetStudents'
import { StudentArraySchema } from '@/types/schemas'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { z } from 'zod'

const route = useRoute()
const courseId = route.params.id
const courseName = route.query['name']
const { execute, isFetching, error, data, students } = useFetchGetStudents(courseId)
</script>

<template>
  <main>
    <div class="flex justify-between items-center mb-3">
      <h2 class="text-xl font-semibold">{{ courseName }}</h2>
    </div>
    <template v-for="student in students" v-bind:key="student.id">
      {{ student.name }}
    </template>
  </main>
</template>
