import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export const useHiddenStudentsStore = defineStore('hiddenStudents', () => {
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
