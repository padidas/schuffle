<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { computed, reactive } from 'vue'
import { isValidNumberString } from '@/lib/validateLevelInput'
import { toast } from 'vue-sonner'

const emit = defineEmits<{
  (e: 'addStudent', name: string, lvl: number): void
}>()

const student = reactive<{ name: string; level: number | undefined }>({
  name: '',
  level: undefined
})

const levelError = computed(() => !isValidNumberString(student.level))

function handleAddBtnClick() {
  if (levelError.value || student.level === undefined) {
    toast.error('Level muss zwischen 1 und 5 sein.')
    return
  }
  if (student.name === undefined || student.name === '') {
    toast.error('Bitte alle Felder ausfüllen.')
    return
  }
  emit('addStudent', student.name, student.level)
  resetInput()
}

function resetInput() {
  student.name = ''
  student.level = undefined
}
</script>

<template>
  <div class="flex gap-4 items-end w-full justify-between">
    <div class="flex gap-4 w-full">
      <div class="flex-[3]">
        <Label class="mb-1">Name</Label>
        <Input placeholder="Some Name" v-model="student.name" />
      </div>
      <div class="flex-[1]">
        <Label class="mb-1">Level</Label>
        <Input
          placeholder="(1-5)"
          type="number"
          min="1"
          max="5"
          v-model.number="student.level"
          :class="{ '!ring-1 !ring-red-600': levelError && student.level !== undefined }"
        />
      </div>
    </div>
    <Button @click="handleAddBtnClick">+</Button>
  </div>
</template>
