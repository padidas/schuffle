import { StudentSchema } from '@/types/schemas'
import { useFetch } from '@vueuse/core'
import { ref } from 'vue'
import type { z } from 'zod'

const HOST = import.meta.env.VITE_SERVER_URL
const PATH = '/api/students'

const postOptions = {
  immediate: false
}

type Student = z.infer<typeof StudentSchema>

export function useFetchPostStudents() {
  const URL = HOST + PATH
  const student = ref<Student | undefined>(undefined)

  const res = useFetch(URL, postOptions).post(student).json()

  async function executeWithPayload(newStudent: Student | undefined) {
    student.value = newStudent
    await res.execute()
  }

  return { ...res, executeWithPayload }
}
