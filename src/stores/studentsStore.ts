import { ref } from 'vue'
import { defineStore } from 'pinia'

export const studentsStore = defineStore('hiddenStudents', () => {
  const hiddenStudents = ref<number[]>([])

  function hide(studentId: number) {
    hiddenStudents.value.push(studentId)
  }

  function show(studentId: number) {
    const index = hiddenStudents.value.indexOf(studentId)
    if (index > -1) hiddenStudents.value.splice(index, 1)
  }

  return { hiddenStudents, hide, show }
})
