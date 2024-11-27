import { createRouter, createWebHistory } from 'vue-router'
import CoursesView from '@/views/CoursesView.vue'
import GroupsView from '@/views/GroupsView.vue'
import StudentsView from '@/views/StudentsView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CoursesView
    },
    {
      path: '/:id',
      name: 'students',
      component: StudentsView
    },
    {
      path: '/:id/shuffle',
      name: 'shuffle',
      component: GroupsView
    },
    {
      path: "/login",
      name: "login",
      component: LoginView
    }
  ]
})

export default router
