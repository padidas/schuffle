<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useFetchGetStudents } from '@/composables/useFetchGetStudents'
import { cn, getChar } from '@/lib/utils'
import type { Student } from '@/types/schemas'
import { ChevronRight, Dices } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const courseId = route.params.id
const courseName = route.query['name']
const { students } = useFetchGetStudents(courseId)

const amountOfGroups = ref([3])

const groups = ref<Map<number, Student[]>>(new Map())
const amountOfStudents = computed(() => students.value?.length ?? 0)
const smallestGroups = computed(() => {
  const minLength = Math.min(...[...groups.value.values()].map((arr) => arr.length))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return new Map([...groups.value].filter(([_, arr]) => arr.length === minLength))
})
const weakestSmallestGroups = computed(() => {
  const weakestLevel = Math.min(
    ...[...smallestGroups.value.values()].map((arr) =>
      arr.reduce((acc, curr) => acc + curr.level, 0)
    )
  )
  return new Map(
    [...smallestGroups.value].filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, arr]) => arr.reduce((acc, curr) => acc + curr.level, 0) === weakestLevel
    )
  )
})
const strongestSmallestGroups = computed(() => {
  const strongestLevel = Math.max(
    ...[...smallestGroups.value.values()].map((arr) =>
      arr.reduce((acc, curr) => acc + curr.level, 0)
    )
  )
  return new Map(
    [...smallestGroups.value].filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, arr]) => arr.reduce((acc, curr) => acc + curr.level, 0) === strongestLevel
    )
  )
})

function shuffle() {
  // reset Map
  groups.value = new Map()

  // fill Map with amount of groups and empty student list
  for (let i = 0; i < amountOfGroups.value[0]; i++) {
    groups.value.set(i, [])
  }

  // create groups of student levels
  let soyStudents = students.value?.filter((stud) => stud.level === 1)
  let midStudents = students.value?.filter((stud) => stud.level === 2)
  let chadStudents = students.value?.filter((stud) => stud.level === 3)

  if (soyStudents === undefined || midStudents === undefined || chadStudents === undefined) return

  // shuffle groups of student levels
  shuffleStudentList(soyStudents)
  shuffleStudentList(midStudents)
  shuffleStudentList(chadStudents)

  // equally distribute chad students
  chadStudents?.forEach((stud) => {
    const groupNumber = weakestSmallestGroups.value.keys().next().value as number
    const groupsStudents = groups.value.get(groupNumber) ?? []
    groups.value.set(groupNumber, [...groupsStudents, stud])
  })

  // distribute mid students to weakest smallest group
  midStudents?.forEach((stud) => {
    const groupNumber = weakestSmallestGroups.value.keys().next().value as number
    const groupsStudents = groups.value.get(groupNumber) ?? []
    groups.value.set(groupNumber, [...groupsStudents, stud])
  })

  // distribute by smalles group, if group same size -> strongest group
  soyStudents?.forEach((stud) => {
    const groupNumber = strongestSmallestGroups.value.keys().next().value as number
    const groupsStudents = groups.value.get(groupNumber) ?? []
    groups.value.set(groupNumber, [...groupsStudents, stud])
  })

  // final shuffle to randomly order the students inside of the group
  ;[...groups.value].forEach((group) => {
    const groupsStudents = groups.value.get(group[0]) ?? []
    shuffleStudentList(groupsStudents)
    groups.value.set(group[0], groupsStudents)
  })
}

function shuffleStudentList(array: Student[]) {
  let currentIndex = array.length

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }
}
</script>

<template>
  <main>
    <div class="flex justify-between items-center mb-3 h-12">
      <div class="flex gap-2">
        <Slider
          v-model="amountOfGroups"
          :min="2"
          :max="15"
          :step="1"
          :class="cn('w-28', $attrs.class ?? '')"
        />
        {{ amountOfGroups[0] }}
      </div>
      <Button size="sm" @click="shuffle"><Dices class="w-4 h-4 mr-2" /> Shuffle </Button>
    </div>

    <div class="flex gap-3 w-full flex-wrap my-8">
      <div
        class="flex p-3 border rounded-md w-full gap-3 flex-wrap"
        v-for="group in [...groups]"
        v-bind:key="group[0]"
      >
        <div
          class="flex bg-primary text-primary-foreground w-8 h-8 rounded-full justify-center items-center self-center"
        >
          {{ getChar(group[0]) }}
        </div>
        <div
          v-for="student in group[1]"
          v-bind:key="student.id"
          class="flex py-1 px-2 border rounded-md"
          :class="{
            'border-red-700': student.level === 3,
            'border-orange-500': student.level === 2,
            'border-yellow-300': student.level === 1
          }"
        >
          {{ student.name }}
        </div>
      </div>
    </div>
    <div class="flex gap-3 w-full flex-wrap">
      <div
        class="flex py-1 px-2 border rounded-md"
        :class="{
          'border-red-700': student.level === 3,
          'border-orange-500': student.level === 2,
          'border-yellow-300': student.level === 1
        }"
        v-for="student in students?.toSorted((a, b) => a.name.localeCompare(b.name))"
        v-bind:key="student.id"
      >
        {{ student.name }}
      </div>
    </div>
    <div class="px-1 py-2">
      <div>{{ amountOfStudents }} students</div>
      <div>{{ (amountOfStudents / amountOfGroups[0]).toFixed(1) }} per group</div>
    </div>
  </main>
</template>
