export default [
  {
    path: '/',
    component: () => import('layouts/login')
  },
  {
    path: '/app',
    component: () => import('layouts/default'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/index') },
      { path: 'payments', component: () => import('pages/payments') },
      { path: 'clients', component: () => import('pages/clients') },
      { path: 'shedule', component: () => import('pages/schedule') },
      {
        path: 'barbers',
        component: () => import('pages/barbers'),
        children: [
          { path: '/', component: () => import('components/organism/barbersTable') }
        ]
      },
      { path: 'services', component: () => import('pages/services') },
      { path: 'reports', component: () => import('pages/reports') }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
