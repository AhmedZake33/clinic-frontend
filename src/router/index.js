import Vue from 'vue'
import VueRouter from 'vue-router'

// Routes
import { canNavigate } from '@/libs/acl/routeProtection'
import { isUserLoggedIn, getUserData, getHomeRouteForLoggedInUser } from '@/auth/utils'
import apps from './routes/apps'
import welcome from './routes/welcome'
import admin from './routes/admin'
import teacher from './routes/teacher'
import student from './routes/student'
import clinic from './routes/clinic'
import uiElements from './routes/ui-elements/index'
import pages from './routes/pages'
import chartsMaps from './routes/charts-maps'
import formsTable from './routes/forms-tables'
import others from './routes/others'


Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    { path: '/', redirect: { name: 'login' } },
    ...apps,
    ...welcome,
    ...admin,
    ...teacher,
    ...student,
    ...clinic,
    ...pages,
    ...chartsMaps,
    ...formsTable,
    ...uiElements,
    ...others,
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})




router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  // Redirect to login if not authenticated and route requires auth
  if (!token && to.meta.requiresAuth) {
    return next({ name: 'login' })
  }

  // Redirect to role-specific dashboard if already logged in and trying to access login
  if (token && to.name === 'login') {
    if (user && user.role === 'doctor') {
      return next({ name: 'doctor-dashboard' })
    } else if (user && user.role === 'assistant') {
      return next({ name: 'assistant-dashboard' })
    } else {
      return next({ name: 'dashboard' })
    }
  }

  // Check role-based access for clinic routes
  if (to.meta.roles && user) {
    const hasAccess = to.meta.roles.includes(user.role)
    if (!hasAccess) {
      // Redirect to appropriate dashboard instead of 404
      if (user.role === 'doctor') {
        return next({ name: 'doctor-dashboard' })
      } else if (user.role === 'assistant') {
        return next({ name: 'assistant-dashboard' })
      } else {
        return next({ name: 'dashboard' })
      }
    }
  }

  return next()
})
// router.afterEach((to) => {
//   const token = localStorage.getItem('token')

//   if (to.meta.requiresAuth && !token) {
//     // needs auth but no token → send to login
//     return next({ name: 'login' })
//   }

//   if (to.name === 'login' && token) {
//     // already logged in → prevent opening login again
//     return next({ name: '/' })
//   }

//   // otherwise continue
//   // next()
// })

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
