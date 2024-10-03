<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFetch } from '@vueuse/core'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { BookPlus, EditIcon, X, XIcon } from 'lucide-vue-next'
import CourseInput from '@/components/CourseInput.vue'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'

const HOST = 'http://localhost:3000'
const PATH = '/api/courses'
const URL = HOST + PATH

const postOptions = {
  immediate: false
}
const newCourse = ref<z.infer<typeof CourseSchema>>()

const { isFetching, error, data } = useFetch(URL).json()

const {
  execute: fetchPost,
  isFetching: isFetchingPost,
  data: dataPost
} = useFetch(URL, postOptions).post(newCourse).json()

const CourseSchema = z.object({
  id: z.number(),
  name: z.string()
})
const CourseArraySchema = z.array(CourseSchema)

const courses = computed(() => {
  if (dataPost.value) return verifyData(dataPost.value)
  else return verifyData(data.value)
})

const editMode = ref(false)

function verifyData(data: unknown): z.infer<typeof CourseArraySchema> | undefined {
  return CourseArraySchema.safeParse(data).data
}

function toggleEditMode() {
  editMode.value = !editMode.value
}

async function addCourse(name: string) {
  newCourse.value = { name, id: getRandomInt() }

  await fetchPost(true)
}

function getRandomInt() {
  const minCeiled = Math.ceil(100000)
  const maxFloored = Math.floor(999999)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}
</script>

<template>
  <main class="flex flex-col overflow-hidden flex-1 relative items-center">
    <Transition>
      <CourseInput v-if="editMode" @addCourse="addCourse" :isLoading="isFetchingPost" />
    </Transition>

    <ScrollArea class="border w-full flex h-auto rounded-md p-3">
      <div class="flex flex-col gap-2">
        <RouterLink
          v-for="course in courses"
          :to="`/${course.id}?name=${course.name}`"
          v-bind:key="course.id"
          class="flex items-center justify-between space-x-4 rounded-md border p-3"
          >{{ course.name }}</RouterLink
        >
        <template v-if="isFetching">
          <Skeleton v-for="n in 3" :key="n" class="w-full h-12" />
        </template>
      </div>
      <span v-if="error !== null">Error! {{ error }}</span>
    </ScrollArea>

    <div class="flex justify-end items-center gap-3 absolute bottom-2 right-2">
      <div class="bg-background rounded-md">
        <Button @click="toggleEditMode" variant="secondary"
          ><template v-if="editMode"><X class="w-4 h-4 mr-2" />Schließen</template
          ><template v-else><BookPlus class="w-4 h-4 mr-2" />Kurs hinzufügen</template></Button
        >
      </div>
    </div>
  </main>
</template>

<style global>
.v-enter-active {
  transition: opacity 0.5s ease;
}

.v-leave-active {
  transition: opacity 0.3s ease-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
