export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: {
      layout: 'full',
      requiresAuth: false,
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      requiresAuth: true,
      pageTitle: 'menu.dashboard',
      pageI18n: true,
      breadcrumb: [
        {
          text: 'menu.dashboard',
          active: true,
          i18n: true,
        },
      ],
    },
  },
  {
    path: '/assistant/dashboard',
    name: 'assistant-dashboard',
    component: () => import('@/views/assistant/Dashboard.vue'),
    meta: {
      requiresAuth: true,
      roles: ['assistant'],
      pageTitle: 'menu.dashboard',
      pageI18n: true,
      breadcrumb: [
        {
          text: 'menu.dashboard',
          active: true,
          i18n: true,
        },
      ],
    },
  },
  {
    path: '/assistant/clients',
    name: 'assistant-clients',
    component: () => import('@/views/assistant/Clients.vue'),
    meta: {
      requiresAuth: true,
      roles: ['assistant'],
      pageTitle: 'menu.clients',
      pageI18n: true,
      breadcrumb: [
        {
          text: 'menu.clients',
          active: true,
          i18n: true,
        },
      ],
    },
  },
  {
    path: '/assistant/clients/:id',
    name: 'assistant-client-profile',
    component: () => import('@/views/assistant/ClientProfile.vue'),
    meta: {
      requiresAuth: true,
      roles: ['assistant'],
      pageTitle: 'client.clientDetails',
      pageI18n: true,
      breadcrumb: [
        {
          text: 'menu.clients',
          to: { name: 'assistant-clients' },
          i18n: true,
        },
        {
          text: 'client.clientDetails',
          active: true,
          i18n: true,
        },
      ],
    },
  },
  {
    path: '/assistant/reservations',
    name: 'assistant-reservations',
    component: () => import('@/views/assistant/Reservations.vue'),
    meta: {
      requiresAuth: true,
      roles: ['assistant'],
      pageTitle: 'menu.reservations',
      pageI18n: true,
      breadcrumb: [
        {
          text: 'menu.reservations',
          active: true,
          i18n: true,
        },
      ],
    },
  },
  {
    path: '/assistant/financials',
    name: 'assistant-financials',
    component: () => import('@/views/assistant/Financials.vue'),
    meta: {
      requiresAuth: true,
      roles: ['assistant'],
      pageTitle: 'menu.financials',
      pageI18n: true,
      breadcrumb: [
        {
          text: 'menu.financials',
          active: true,
          i18n: true,
        },
      ],
    },
  },
  {
    path: '/assistant/reports',
    name: 'assistant-reports',
    component: () => import('@/views/shared/Reports.vue'),
    meta: {
      requiresAuth: true,
      roles: ['assistant'],
      pageTitle: 'menu.reports',
      pageI18n: true,
      breadcrumb: [
        {
          text: 'menu.reports',
          active: true,
          i18n: true,
        },
      ],
    },
  },
  {
    path: '/doctor/dashboard',
    name: 'doctor-dashboard',
    component: () => import('@/views/doctor/Dashboard.vue'),
    meta: {
      requiresAuth: true,
      roles: ['doctor'],
      pageTitle: 'menu.dashboard',
      pageI18n: true,
      breadcrumb: [
        {
          text: 'menu.dashboard',
          active: true,
          i18n: true,
        },
      ],
    },
  },
  {
    path: '/doctor/reservations',
    name: 'doctor-reservations',
    component: () => import('@/views/doctor/Reservations.vue'),
    meta: {
      requiresAuth: true,
      roles: ['doctor'],
      pageTitle: 'menu.myReservations',
      pageI18n: true,
      breadcrumb: [
        {
          text: 'menu.myReservations',
          active: true,
          i18n: true,
        },
      ],
    },
  },
  {
    path: '/doctor/schedule',
    name: 'doctor-schedule',
    component: () => import('@/views/doctor/Schedule.vue'),
    meta: {
      requiresAuth: true,
      roles: ['doctor'],
      pageTitle: 'menu.schedule',
      pageI18n: true,
      breadcrumb: [
        {
          text: 'menu.schedule',
          active: true,
          i18n: true,
        },
      ],
    },
  },
  {
    path: '/doctor/financials',
    name: 'doctor-financials',
    component: () => import('@/views/doctor/Financials.vue'),
    meta: {
      requiresAuth: true,
      roles: ['doctor'],
      pageTitle: 'menu.financials',
      pageI18n: true,
      breadcrumb: [
        {
          text: 'menu.financials',
          active: true,
          i18n: true,
        },
      ],
    },
  },
  {
    path: '/doctor/reports',
    name: 'doctor-reports',
    component: () => import('@/views/shared/Reports.vue'),
    meta: {
      requiresAuth: true,
      roles: ['doctor'],
      pageTitle: 'menu.reports',
      pageI18n: true,
      breadcrumb: [
        {
          text: 'menu.reports',
          active: true,
          i18n: true,
        },
      ],
    },
  },
]
