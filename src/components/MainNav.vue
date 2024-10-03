<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const courseId = computed(() => route.params.id)
const courseName = computed(() => route.query['name'])
const shuffle = computed(() => route.path.includes('shuffle'))
</script>

<template>
  <Breadcrumb class="mb-4">
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink as-child>
          <RouterLink to="/"> Kurse </RouterLink>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator v-if="courseId && courseName" />
      <BreadcrumbItem v-if="courseId && courseName">
        <BreadcrumbLink as-child>
          <RouterLink :to="`/${courseId}/?name=${courseName}`">
            {{ courseName }}
          </RouterLink>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator v-if="courseId && courseName && shuffle" />
      <BreadcrumbItem v-if="courseId && courseName && shuffle">
        <BreadcrumbPage>Gruppen erstellen</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</template>
