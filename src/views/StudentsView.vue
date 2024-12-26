<script setup lang="ts">
import AddStudentDialog from '@/components/AddStudentDialog.vue'
import MainNav from '@/components/MainNav.vue'
import StudentItem from '@/components/StudentItem.vue'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useFetchGetStudents } from '@/composables/useFetchGetStudents'
import { useFetchPostStudents } from '@/composables/useFetchPostStudent'
import { Dices, EditIcon, XIcon } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'

const route = useRoute()
const courseId = route.params.id
const courseName = route.query['name']

const { execute, isFetching, students } = useFetchGetStudents(courseId)
const { isFetching: isFetchingPost, executeWithPayload, error: postError } = useFetchPostStudents()

const sortedStudents = computed(() =>
  [...(students.value ?? [])]?.sort((a, b) => a.name.localeCompare(b.name))
)

const editMode = ref(false)
const addMode = ref(false)
const isInitiallyFetching = computed(() => isFetching && students.value === undefined)

async function addStudent(name: string, level: number) {
  const newStudent = {
    name,
    level,
    courseId: +courseId // TODO: validate
  }
  await executeWithPayload(newStudent)
  if (!postError.value) toast.success(`${newStudent.name} wurde hinzugefügt.`)
  execute()
}

function toggleEditMode() {
  editMode.value = !editMode.value
}
</script>

<template>
  <MainNav />
  <main class="flex flex-col overflow-hidden flex-1 relative items-center">
    <ScrollArea class="w-full flex h-auto pr-3">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-lg font-semibold">Schülis</h3>
        <Button size="sm" variant="ghost" @click="toggleEditMode">
          <template v-if="editMode"> <XIcon class="w-4 h-4 mr-2" />Beenden </template>
          <template v-else> <EditIcon class="w-4 h-4 mr-2" />Bearbeiten </template>
        </Button>
      </div>

      <div class="flex flex-col gap-2 mb-14">
        <template v-for="student in sortedStudents" :key="student.id">
          <StudentItem :edit-mode="editMode" :student="student" @fetch-students="execute" />
        </template>
        <template v-if="isInitiallyFetching">
          <Skeleton v-for="n in 3" :key="n" class="w-full h-12" />
        </template>
      </div>
    </ScrollArea>

    <div class="flex justify-end items-center gap-3 absolute bottom-2 right-2">
      <div class="bg-background rounded-md">
        <AddStudentDialog :is-loading="isFetchingPost" @add-student="addStudent" />
      </div>
      <RouterLink :to="`/${courseId}/shuffle/?name=${courseName}`">
        <div class="bg-background rounded-md">
          <Button :variant="editMode || addMode ? 'secondary' : 'default'">
            <Dices class="w-4 h-4 mr-2" /> Gruppen erstellen
          </Button>
        </div>
      </RouterLink>
    </div>
  </main>
</template>
