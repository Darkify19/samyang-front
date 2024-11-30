import Vue from 'vue';
import VueRouter from 'vue-router';
import LayoutComponent from '../components/LayoutComponent.vue'; // Import the layout component
import RegisterComponent from '../components/RegisterComponent.vue';
import LoginComponent from '../components/LoginComponent.vue';
import ProfileComponent from '../components/ProfileComponent.vue';
import HomeView from '../views/HomeView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: LayoutComponent,  // Use LayoutComponent to wrap other components
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView,  // Replace with your home component or default view
      },
      {
        path: '/profile',
        name: 'profile',
        component: ProfileComponent,  // Your Profile Component
      },
      {
        path: '/login',
        name: 'login',
        component: LoginComponent,
      },
      {
        path: '/register',
        name: 'register',
        component: RegisterComponent,
      },
    ],
  },
];

const router = new VueRouter({
  routes,
  mode: 'history',  // To remove the # from the URL
});

export default router;
