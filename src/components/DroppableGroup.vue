<script setup lang="ts">
import { getChar } from '@/lib/utils'
import type { Student, StudentArray } from '@/types/schemas'
import { computed } from 'vue'
import { toast } from 'vue-sonner'

const props = defineProps<{
  groupId: number
  students: StudentArray
  showColors: boolean
}>()
const emit = defineEmits<{
  (e: 'moveStudent', fromGroup: number, toGroup: number, studentId: string): void
}>()

const groupInfo = computed(() => getChar(props.groupId))

function startDrag(event: DragEvent, item: Student, fromGroup: number) {
  const studentId = item.id.toString()
  console.log('dragging', item)

  if (!event.dataTransfer) {
    toast('DnD-Fehler')
    return
  }
  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('studentId', studentId)
  event.dataTransfer.setData('fromGroup', fromGroup.toString())
}

function onDrop(event: DragEvent, groupId: number) {
  const draggedStudentId = event.dataTransfer?.getData('studentId')
  const fromGroup = event.dataTransfer?.getData('fromGroup')

  console.log(`hello i am dropping ${draggedStudentId}`)

  if (draggedStudentId === undefined) {
    toast.error('DnD-Fehler')
    return
  }
  emit('moveStudent', Number(fromGroup), groupId, draggedStudentId)
}
</script>

<template>
  <ul
    ref="groupRef"
    class="flex p-3 border rounded-md w-full gap-3 flex-wrap flex-1 min-w-72 max-w-full flex-grow"
    :class="groupInfo[2]"
    @drop="onDrop($event, groupId)"
    @dragenter.prevent
    @dragover.prevent
  >
    <div
      class="flex bg-primary text-primary-foreground w-8 h-8 rounded-full justify-center items-center self-center"
      :class="groupInfo[1]"
    >
      {{ groupInfo[0] }}
    </div>
    <li
      v-for="student in students"
      :key="student.id"
      class="flex py-1.5 px-2.5 border rounded-md h-fit"
      :class="{
        'border-red-700': student.level === 3 && showColors,
        'border-orange-500': student.level === 2 && showColors,
        'border-yellow-300': student.level === 1 && showColors
      }"
      draggable="true"
      @dragstart="startDrag($event, student, groupId)"
    >
      {{ student.name }}
    </li>
  </ul>
</template>
