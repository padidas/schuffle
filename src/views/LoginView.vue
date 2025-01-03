<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { LogInIcon } from 'lucide-vue-next'
import { useFetch, type UseFetchOptions } from '@vueuse/core'
import { ref } from 'vue'
import type { User } from '@/types/schemas'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const HOST = import.meta.env.VITE_API_HOST
const PATH = `/auth/login`
const URL = HOST + PATH

const router = useRouter()
const { setAuthToken, login, userName, defaultRequestInit } = useAuthStore()

const fetchOptions: UseFetchOptions = {
  immediate: false
}

const loginPayload = ref<User>()

const {
  execute: executePost,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isFetching: isPosting,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error: postError,
  onFetchResponse: onPostResponse,
  data: postResponse
} = useFetch(URL, { ...defaultRequestInit, credentials: 'include' }, fetchOptions)
  .post(loginPayload)
  .json()

onPostResponse(() => {
  const accessToken = postResponse.value.accessToken
  toast.success(`${userName}, ${accessToken}`)
  setAuthToken(accessToken)
  login(postResponse.value)
  router.push('/')
})

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    password: z.string().min(8).max(60)
  })
)

const { errors, handleSubmit } = useForm({
  validationSchema: formSchema
})

const onSubmit = handleSubmit(async (values) => {
  if (errors.value.email) {
    toast.error(errors.value.email)
    return
  }
  if (errors.value.password) {
    toast.error(errors.value.password)
    return
  }
  if (values.email && values.password) {
    loginPayload.value = { email: values.email, password: values.password }
    await executePost()
  }
})
</script>

<template>
  <form class="flex flex-col gap-4" @submit="onSubmit">
    <div class="flex flex-col gap-4 my-4">
      <FormField v-slot="{ componentField }" name="email">
        <FormItem class="flex flex-col flex-[2]">
          <FormLabel>E-Mail-Adresse</FormLabel>
          <FormControl>
            <Input type="email" placeholder="..." v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="password">
        <FormItem class="flex flex-col flex-[2]">
          <FormLabel>Passwort</FormLabel>
          <FormControl>
            <Input type="password" placeholder="..." v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>
    <Button type="submit"> <LogInIcon class="w-4 h-4 mr-2" /> Login </Button>
  </form>
</template>
