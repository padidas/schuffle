import { StudentArraySchema } from '@/types/schemas'
import { useFetch } from '@vueuse/core'
import { computed } from 'vue'
import type { z } from 'zod'

const HOST = import.meta.env.VITE_API_HOST
const PATH = '/api/students'

export function useFetchGetStudents(courseId: string | string[]) {
  const params = `?courseId=${courseId}`
  const URL = HOST + PATH + params

  const res = useFetch(URL).json()

  const students = computed(() => verifyData(res.data.value))

  return { ...res, students }
}

function verifyData(data: unknown): z.infer<typeof StudentArraySchema> | undefined {
  const result = StudentArraySchema.safeParse(data)
  console.log('success', result.success)
  return result.data
}
