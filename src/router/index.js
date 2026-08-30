import Vue from 'vue'
import VueRouter from 'vue-router'

// Routes
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
  /**
   * FIX: Do NOT use VUE_APP_BASE_URL here.
   * VUE_APP_BASE_URL is for your API (https://...).
   * 'base' should be the subdirectory of your frontend (usually '/' or process.env.BASE_URL).
   */
  base: process.env.BASE_URL || '/',
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: () => import('@/views/LandingPage.vue'),
      meta: {
        layout: 'full',
        requiresAuth: false,
      },
    },
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
      path: '/:bookingSlug',
      name: 'public-online-booking',
      component: () => import('@/views/PublicOnlineBooking.vue'),
      meta: {
        layout: 'full',
        requiresAuth: false,
      },
    },
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch (error) {
    localStorage.removeItem('user')
    return null
  }
}

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = getStoredUser()
  const isPublicRoute = to.matched.some(route => route.meta.requiresAuth === false)
  const isAuthenticated = Boolean(token && user)

  // Protect every route by default. Only routes explicitly marked
  // requiresAuth: false can be opened without a logged-in user.
  if (!isAuthenticated && !isPublicRoute) {
    return next({
      name: 'login',
      query: to.fullPath && to.fullPath !== '/' ? { redirect: to.fullPath } : {},
    })
  }

  // Helper: get the home route name for a given role
  const homeForRole = role => {
    if (role === 'doctor') return 'doctor-dashboard'
    if (role === 'assistant') return 'assistant-dashboard'
    if (role === 'sub-doctor') return 'doctor-reservations'
    return 'dashboard'
  }

  // Redirect to role-specific home if already logged in and trying to access login
  if (isAuthenticated && to.name === 'login') {
    return next({ name: homeForRole(user && user.role) })
  }

  // Check permission-based access
  if (to.meta.permissions && user) {
    const userPermissions = JSON.parse(localStorage.getItem('permissions') || '[]')
    const role = user.role || ''

    // Admin bypasses all permission checks
    if (role !== 'admin') {
      const requiredPerms = to.meta.permissions
      const hasPermission = requiredPerms.some(p => userPermissions.includes(p))

      if (!hasPermission) {
        return next({ name: 'error-404' })
      }
    }
  }

  return next()
})

router.afterEach(() => {
  // Remove initial loading splash screen
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
