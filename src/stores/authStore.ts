import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useFetch, type UseFetchOptions } from '@vueuse/core'

type User = {
  accessToken: string,
  refreshToken: string
}

const HOST = import.meta.env.VITE_API_HOST
const PATH = `/auth/refresh`
const URL = HOST + PATH

const refreshRequestInit: RequestInit = {
  credentials: "include"
}

const refreshFetchOptions: UseFetchOptions = {
  immediate: false
}

export const useAuthStore = defineStore('auth', () => {
  const authToken = ref<string>()
  const user = ref<User | undefined>(undefined)
  const refreshTokenTimeout = ref<ReturnType<typeof setTimeout>>()
  const userName = computed(() => {
    if (!user.value || !user.value.accessToken) return ""

    // parse json object from base64 encoded jwt token
    const jwtBase64 = user.value.accessToken.split('.')[1];
    const jwtPayload = JSON.parse(atob(jwtBase64));

    console.log("SUB:", jwtPayload.sub)

    // set a timeout to refresh the token a minute before it expires
    return jwtPayload.sub
  })
  const defaultRequestInit = computed<RequestInit>(() => (
    {
      headers: {
        Authorization: `Bearer ${authToken.value ?? ''}`
      }
    }
  ))

  const {
    execute: executeRefresh,
    onFetchResponse: onPostResponse,
    data: postResponse
  } = useFetch(URL, refreshRequestInit, refreshFetchOptions).post().json()

  onPostResponse(() => {
    user.value = postResponse.value
    console.log("REFRESHING THE TOKEN!")
    startRefreshTokenTimer()
  })

  function setAuthToken(newToken: string) {
    authToken.value = newToken
  }

  function login(userPayload: User | undefined) {
    user.value = userPayload
    console.log("USER PAYLOAD", userPayload)
    console.log("USER.VALUE", user.value)
    startRefreshTokenTimer();
  }

  function startRefreshTokenTimer() {
    if (!user.value || !user.value.accessToken) return

    // parse json object from base64 encoded jwt token
    const jwtBase64 = user.value.accessToken.split('.')[1];
    const jwtToken = JSON.parse(atob(jwtBase64));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const SEC_BEFORE_EXP = 30
    const timeout = expires.getTime() - Date.now() - (1000 * SEC_BEFORE_EXP);

    console.log(`Timer started. Expires: ${expires}. Timeout: ${timeout / 1000} sec`)

    refreshTokenTimeout.value = setTimeout(executeRefresh, timeout);
  }

  return { authToken, user, login, setAuthToken, refreshTokenTimeout, userName, executeRefresh, defaultRequestInit }
})

