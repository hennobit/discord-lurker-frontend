import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './stores/authStore';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/auth',
            component: () => import('@/views/Auth.vue')
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/views/Login.vue')
        }
    ]
});

router.beforeEach(async (to, from) => {
    /*const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;

    if (!isAuthenticated && to.name !== 'Login') {
        return { name: 'Login' };
    }*/
});

export default router;
