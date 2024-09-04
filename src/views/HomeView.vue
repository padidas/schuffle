<script setup lang="ts">
import { computed } from 'vue'
import { useFetch } from '@vueuse/core'
import { z } from 'zod'

const { isFetching, error, data } = useFetch('http://localhost:3000/api/courses')

const courses = computed(() => verifyData(data.value))

const CourseSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string()
  })
)

const DataSchema = z.string()

function verifyData(data: unknown): z.infer<typeof CourseSchema> | undefined {
  const dataStr = DataSchema.safeParse(data)
  if (dataStr.error) return

  return CourseSchema.safeParse(JSON.parse(dataStr.data)).data
}
</script>

<template>
  <main class="flex flex-col gap-4">
    <RouterLink
      v-for="course in courses"
      :to="`/courses/${course.id}?name=${course.name}`"
      v-bind:key="course.id"
      >{{ course.name }}</RouterLink
    >
    <span v-if="error !== null">Error! {{ error }}</span>
    <span v-else-if="isFetching">Loading...</span>
  </main>
</template>
