import Vue from 'vue';
import VueRouter from 'vue-router';
import LayoutComponent from '@/components/LayoutComponent.vue'; // Import the layout component
import RegisterComponent from '@/components/RegisterComponent.vue';
import LoginComponent from '@/components/LoginComponent.vue';
import ProfileComponent from '@/components/ProfileComponent.vue';
import SwipeComponent from '@/components/SwipeComponent.vue'; // Import Swipe component
import MatchesComponent from '@/components/MatchesComponent.vue'; // Import Matches component
import HomeView from '@/views/HomeView.vue';

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
        path: '/swipe',
        name: 'swipe',
        component: SwipeComponent,  // Swipe Page
      },
      {
        path: '/matches',
        name: 'matches',
        component: MatchesComponent,  // Matches Page
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
