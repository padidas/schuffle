<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'
import { useFetchGetStudents } from '@/composables/useFetchGetStudents'
import { cn } from '@/lib/utils'
import { useHiddenStudentsStore } from '@/stores/hiddenStudents'
import type { Student } from '@/types/schemas'
import { Dices, DropletIcon } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import DroppableGroup from '@/components/DroppableGroup.vue'
import { toast } from 'vue-sonner'
import MainNav from '@/components/MainNav.vue'

const route = useRoute()
const courseId = route.params.id

const { students } = useFetchGetStudents(courseId)
const { hiddenStudents } = useHiddenStudentsStore()
const filteredStudents = computed(() =>
  students.value?.filter((student) => !hiddenStudents.includes(student.id))
)

const showColors = ref(false)
const amountOfGroups = ref([3])

const groups = ref<Map<number, Student[]>>(new Map())
const amountOfStudents = computed(() => filteredStudents.value?.length ?? 0)
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

function reset() {
  groups.value = new Map()
}

function shuffle() {
  // reset Map
  groups.value = new Map()

  // fill Map with amount of groups and empty student list
  for (let i = 0; i < amountOfGroups.value[0]; i++) {
    groups.value.set(i, [])
  }

  // create groups of student levels
  let ones = filteredStudents.value?.filter((stud) => stud.level === 1)
  let twos = filteredStudents.value?.filter((stud) => stud.level === 2)
  let threes = filteredStudents.value?.filter((stud) => stud.level === 3)

  if (ones === undefined || twos === undefined || threes === undefined) return

  // shuffle groups of student levels
  shuffleStudentList(ones)
  shuffleStudentList(twos)
  shuffleStudentList(threes)

  // equally distribute threes
  threes?.forEach((stud) => {
    const groupNumber = weakestSmallestGroups.value.keys().next().value as number
    const groupsStudents = groups.value.get(groupNumber) ?? []
    groups.value.set(groupNumber, [...groupsStudents, stud])
  })

  // distribute twos to weakest smallest group
  twos?.forEach((stud) => {
    const groupNumber = weakestSmallestGroups.value.keys().next().value as number
    const groupsStudents = groups.value.get(groupNumber) ?? []
    groups.value.set(groupNumber, [...groupsStudents, stud])
  })

  // distribute ones by smalles group, if group same size -> strongest group
  ones?.forEach((stud) => {
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

function moveStudent(fromGroup: number, toGroup: number, studentId: string) {
  console.log(`move student ${studentId} from ${fromGroup} to ${toGroup}`)

  if (fromGroup === toGroup) return

  // find prev and new groups
  const prevGroupStudents = groups.value.get(fromGroup)
  const newGroupStudents = groups.value.get(toGroup)
  const movingStudent = students.value?.find((student) => student.id.toString() === studentId)

  // abort if not both groups and student are found
  if (
    prevGroupStudents === undefined ||
    newGroupStudents === undefined ||
    movingStudent === undefined
  ) {
    toast.error('DnD-Fehler')
    return
  }

  // remove student from previous group
  groups.value.set(
    fromGroup,
    [...prevGroupStudents].filter((student) => student.id.toString() !== studentId)
  )

  // add student to new group
  groups.value.set(toGroup, [...newGroupStudents, movingStudent])
}

function toggleShowColors() {
  showColors.value = !showColors.value
}
</script>

<template>
  <MainNav />
  <main class="flex flex-col overflow-hidden flex-1 relative items-center">
    <div class="flex justify-between w-full px-2 items-center mt-2 mb-6 h-12">
      <div class="flex flex-col gap-2">
        <Label>Wie viele Gruppen?</Label>
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
      </div>
      <div class="px-1 py-2 text-sm">
        <div>{{ amountOfStudents }} Personen</div>
        <div>{{ (amountOfStudents / amountOfGroups[0]).toFixed(1) }} pro Gruppe</div>
      </div>
    </div>

    <ScrollArea class="w-full flex flex-col h-auto pr-3">
      <div v-if="groups.size > 0" class="flex gap-6 w-full flex-wrap mb-8">
        <DroppableGroup
          v-for="group in [...groups]"
          :group-id="group[0]"
          v-bind:key="group[0]"
          :show-colors="showColors"
          :students="group[1]"
          @moveStudent="moveStudent"
        />
      </div>

      <div v-else class="flex gap-3 w-full flex-wrap mb-10">
        <div
          class="flex py-1.5 px-2.5 border rounded-md h-fit"
          :class="{
            'border-red-700': student.level === 3 && showColors,
            'border-orange-500': student.level === 2 && showColors,
            'border-yellow-300': student.level === 1 && showColors
          }"
          v-for="student in [...(filteredStudents ?? [])].sort((a, b) =>
            a.name.localeCompare(b.name)
          )"
          v-bind:key="student.id"
        >
          {{ student.name }}
        </div>
      </div>
    </ScrollArea>

    <div class="flex justify-end items-center gap-3 absolute bottom-2 right-2">
      <div class="bg-background rounded-md">
        <Button variant="secondary" @click="toggleShowColors">
          <template v-if="showColors">
            <DropletIcon class="w-4 h-4 mr-2" /> Farben verstecken
          </template>
          <template v-else> <DropletIcon class="w-4 h-4 mr-2" /> Farben zeigen </template>
        </Button>
      </div>
      <div class="bg-background rounded-md">
        <Button v-if="groups.size > 0" variant="secondary" @click="reset">
          <Dices class="w-4 h-4 mr-2" /> Zurücksetzen
        </Button>
        <Button v-else @click="shuffle"> <Dices class="w-4 h-4 mr-2" /> Gruppen erstellen </Button>
      </div>
    </div>
  </main>
</template>
