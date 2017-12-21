export default {
  routes: [
    {
      path: '/',
      component: './Landing',
      authenticated: false
    },
    {
      path: '/user/dashboard',
      component: './User/Dashboard',
      authenticated: true
    },
    {
      path: '/user/settings',
      component: './User/Settings',
      authenticated: false
    }
  ]
};
