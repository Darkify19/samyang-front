// src/router/index.js
import Vue from 'vue';
import VueRouter from 'vue-router';
import LayoutComponent from '@/components/LayoutComponent.vue'; // Import the layout component
import RegisterComponent from '@/components/RegisterComponent.vue';
import LoginComponent from '@/components/LoginComponent.vue';
import ProfileComponent from '@/components/ProfileComponent.vue';
import SwipeComponent from '@/components/SwipeComponent.vue'; // Import Swipe component
import MatchesComponent from '@/components/MatchesComponent.vue'; // Import Matches component
import HomeView from '@/views/HomeView.vue';
import AdminLayout from '@/components/admin/AdminLayout.vue'; // Admin Layout component
import UserListComponent from '@/components/admin/UserList.vue'; // Admin User List
import UserProfileComponent from '@/components/admin/UserProfile.vue'; // Admin User Profile
import EditUserProfileComponent from '@/components/admin/EditUserProfile.vue'; // Admin Edit User Profile

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: LayoutComponent,
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView,
      },
      {
        path: '/profile',
        name: 'profile',
        component: ProfileComponent,
      },
      {
        path: '/swipe',
        name: 'swipe',
        component: SwipeComponent,
      },
      {
        path: '/matches',
        name: 'matches',
        component: MatchesComponent,
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
  {
    path: '/admin',
    component: AdminLayout, // Admin layout component to wrap admin pages
    children: [
      {
        path: 'users',
        name: 'userList',
        component: UserListComponent, // User Manager (User List)
      },
      {
        path: 'users/:id',
        name: 'userProfile',
        component: UserProfileComponent, // User Profile View
      },
      {
        path: 'users/:id/edit',
        name: 'editUser',
        component: EditUserProfileComponent, // Edit User Profile
      },
    ],
  },
];

const router = new VueRouter({
  routes,
  mode: 'history', // To remove the # from the URL
});

export default router;
