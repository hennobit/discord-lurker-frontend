import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from './stores/authStore';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/auth',
            component: () => import('@/views/AuthView.vue')
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/views/LoginView.vue')
        },
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: () => import('@/views/DashboardView.vue')
        },
        {
            path: '/data/:serverId',
            name: 'Data',
            component: () => import('@/views/DataView.vue'),
            props: route => ({
                serverId: route.params.serverId,
                serverName: route.query.serverName
              })
        }
    ]
});

router.beforeEach(async (to, from) => {
    /*const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;

    console.log('isAuthenticated', isAuthenticated);
    if (!isAuthenticated && to.name !== 'Login') {
        return { name: 'Login' };
    }*/
});

export default router;
