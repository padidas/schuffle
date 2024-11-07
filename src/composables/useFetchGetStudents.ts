import { StudentArraySchema } from '@/types/schemas'
import { useFetch } from '@vueuse/core'
import { computed } from 'vue'
import type { z } from 'zod'

const HOST = import.meta.env.VITE_SERVER_URL
const PATH = '/api/students'

export function useFetchGetStudents(courseId: string | string[]) {
  const params = `?course=${courseId}`
  const URL = HOST + PATH + params

  const res = useFetch(URL).json()

  const students = computed(() => verifyData(res.data.value))

  return { ...res, students }
}

function verifyData(data: unknown): z.infer<typeof StudentArraySchema> | undefined {
  const parsed = StudentArraySchema.safeParse(data)
  console.log('success', parsed.success)
  return parsed.data
}
