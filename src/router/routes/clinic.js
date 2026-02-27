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
      permissions: ['client.view-dashboard'],
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
      permissions: ['assistant.view-dashboard'],
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
      permissions: ['assistant.view-clients'],
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
      permissions: ['assistant.view-clients'],
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
      permissions: ['assistant.view-reservations'],
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
      permissions: ['assistant.view-financials'],
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
      permissions: ['assistant.view-reports'],
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
    path: '/assistant/waiting-queue',
    name: 'assistant-waiting-queue',
    component: () => import('@/views/shared/WaitingQueue.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['assistant.view-waiting-queue'],
      pageTitle: 'menu.waitingQueue',
      pageI18n: true,
      breadcrumb: [
        {
          text: 'menu.waitingQueue',
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
      permissions: ['doctor.view-dashboard'],
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
      permissions: ['doctor.view-reservations'],
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
      permissions: ['doctor.view-schedule'],
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
      permissions: ['doctor.view-financials'],
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
    path: '/doctor/assistants',
    name: 'doctor-assistants',
    component: () => import('@/views/doctor/Assistants.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['doctor.view-assistants'],
      pageTitle: 'menu.assistants',
      pageI18n: true,
      breadcrumb: [
        {
          text: 'menu.assistants',
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
      permissions: ['doctor.view-reports'],
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
    path: '/doctor/waiting-queue',
    name: 'doctor-waiting-queue',
    component: () => import('@/views/shared/WaitingQueue.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['doctor.view-waiting-queue'],
      pageTitle: 'menu.waitingQueue',
      pageI18n: true,
      breadcrumb: [
        {
          text: 'menu.waitingQueue',
          active: true,
          i18n: true,
        },
      ],
    },
  },
  // Admin routes
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: () => import('@/views/admin/dashboard.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['admin.view-dashboard'],
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
    path: '/admin/roles',
    name: 'admin-roles',
    component: () => import('@/views/admin/RolesPermissions.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['admin.view-roles'],
      pageTitle: 'menu.rolesPermissions',
      pageI18n: true,
      breadcrumb: [
        {
          text: 'menu.dashboard',
          to: { name: 'admin-dashboard' },
          i18n: true,
        },
        {
          text: 'menu.rolesPermissions',
          active: true,
          i18n: true,
        },
      ],
    },
  },
]
