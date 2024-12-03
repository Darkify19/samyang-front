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
import AdminLayout from '@/components/admin/AdminLayoutComponent.vue'; // Admin Layout component
import UserListComponent from '@/components/admin/UserListComponent.vue'; // Admin User List
import UserProfileComponent from '@/components/admin/UserProfileComponent.vue'; // Admin User Profile
import EditUserProfileComponent from '@/components/admin/EditUserProfileComponent.vue'; // Admin Edit User Profile

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
        meta: { requiresAuth: true, role: 'admin' }, // Add meta for role check
      },
      {
        path: 'users/:id',
        name: 'userProfile',
        component: UserProfileComponent, // User Profile View
        meta: { requiresAuth: true, role: 'admin' }, // Add meta for role check
      },
      {
        path: 'users/:id/edit',
        name: 'editUser',
        component: EditUserProfileComponent, // Edit User Profile
        meta: { requiresAuth: true, role: 'admin' }, // Add meta for role check
      },
    ],
  },
];

const router = new VueRouter({
  routes,
  mode: 'history', // To remove the # from the URL
});

// Global route guard for authentication and role check
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('auth_token'); // Check if user is authenticated (adjust based on your auth method)
  const userRole = localStorage.getItem('user_role'); // Assuming the user role is saved in localStorage

  if (to.matched.some(record => record.meta.requiresAuth)) {
    // If the route requires authentication
    if (!isAuthenticated) {
      next('/login'); // Redirect to login if not authenticated
    } else if (to.meta.role && to.meta.role !== userRole) {
      next('/login'); // Redirect to login if the user is not an admin
    } else {
      next(); // Proceed if authenticated and role matches
    }
  } else {
    next(); // Proceed if no authentication is required
  }
});

export default router;
