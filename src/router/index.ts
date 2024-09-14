import { createRouter, createWebHistory } from 'vue-router'
import CoursesView from '@/views/CoursesView.vue'
import GroupsView from '@/views/GroupsView.vue'
import StudentsView from '@/views/StudentsView.vue'

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
      path: '/shuffle/:id',
      name: 'shuffle',
      component: GroupsView
    }
  ]
})

export default router
