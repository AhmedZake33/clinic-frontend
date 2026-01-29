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
    { path: '/', redirect: { name: 'dashboard' } },
    ...apps,
    ...welcome,
    ...admin,
    ...teacher,
    ...student,
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
  const user = JSON.parse(localStorage.getItem('user'))

  // console.log('roles'+to);
  // console.log('to object:', JSON.stringify(to, null, 2))

  if (!token && to.name !== 'auth-login') {
    if(to.meta.requiresAuth){
      return next({ name: 'auth-login' })
    }else{
      return next();
    }
  }

  if (to.meta.roles && user) {
    const hasAccess = to.meta.roles.includes(user.type.name)
    if (!hasAccess) {
      return next({ name: 'error-404' }) // 🚫 redirect to 404
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
