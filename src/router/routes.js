const routes = [
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/HomePage.vue') },
      { path: 'empleados', component: () => import('src/pages/EmpleadosPage.vue') },
      { path: 'ausentismo', component: () => import('src/pages/AusentismoPage.vue') },
    ],
  },

  {
    path: '/',
    component: () => import('src/pages/LoginPage.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/ErrorNotFound.vue'),
  },
]

export default routes
