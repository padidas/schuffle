<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import MainHeading from './components/MainHeading.vue'
import { useColorMode } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'

const mode = useColorMode()

function toggleMode() {
  if (mode.value === 'light') mode.value = 'dark'
  else mode.value = 'light'
}
</script>

<template>
  <div class="container mx-auto flex flex-col py-4 h-screen max-w-3xl">
    <div class="flex justify-between mb-4">
      <MainHeading />
      <RouterLink to="/login">Login</RouterLink>
      <Button variant="ghost" size="sm" @click="toggleMode">
        <Icon
          icon="radix-icons:moon"
          class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        />
        <Icon
          icon="radix-icons:sun"
          class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </div>
    <RouterView />
  </div>
  <Toaster />
</template>
