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

// prevent infinte loop
let tokenChecked = false;

router.beforeEach(async (to, from, next) => {

    console.log('to', to, 'tokenChecked', tokenChecked);
    if (to.name === 'Auth') {
        return next();
    }

    if (!tokenChecked) {
        tokenChecked = true;

        const accessToken = useAuthStore().accessToken;
        const expiresAt = Number(useAuthStore().tokenExpiresAt);

        console.log('accessToken in router.ts', accessToken);
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
                return next({ name: 'Dashboard' });
            }
            return next({ name: 'Login' });
        } catch (error) {
            console.error(error);
            return next({ name: 'Login' });
        }
    } else {
        next();
    }
});

export default router;
