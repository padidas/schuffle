import { StudentInsertSchema } from '@/types/schemas'
import { useFetch } from '@vueuse/core'
import { ref } from 'vue'
import type { z } from 'zod'

const HOST = import.meta.env.VITE_API_HOST
const PATH = '/api/students'

const postOptions = {
  immediate: false
}

type StudentInsert = z.infer<typeof StudentInsertSchema>

export function useFetchPostStudents() {
  const URL = HOST + PATH
  const student = ref<StudentInsert | undefined>(undefined)

  const res = useFetch(URL, postOptions).post(student).json()

  async function executeWithPayload(newStudent: StudentInsert | undefined) {
    student.value = newStudent
    await res.execute()
  }

  return { ...res, executeWithPayload }
}
