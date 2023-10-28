import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from './stores/authStore';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/auth',
            name: 'Auth',
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
            props: (route) => ({
                serverId: route.params.serverId,
                serverName: route.query.serverName
            })
        }
    ]
});

let tokenChecked = false;

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    const accessToken = authStore.accessToken;
    const expiresAt = Number(authStore.tokenExpiresAt);

    if (!tokenChecked) {
        if (!accessToken || expiresAt < Date.now()) {
            return next({ name: 'Login' });
        }

        try {
            const response = await fetch('https://discord.com/api/v10/users/@me', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (response.status === 200) {
                next({ name: 'Dashboard' });
                tokenChecked = true;
            } else {
                next({ name: 'Login' });
            }
        } catch (error) {
            console.error(error);
            next({ name: 'Login' });
        }
    } else {
        next();
    }
});

export default router;
