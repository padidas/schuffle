<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/MainHeading.vue'
import { useColorMode } from '@vueuse/core'
const mode = useColorMode()

</script>

<template>
  <header>
    <HelloWorld msg="You did it!" />
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>
