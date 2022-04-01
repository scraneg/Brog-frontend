import {createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('@/views/index'),
        children: [
            {
                path: '/notebook',
                component: () => import('@/views/index/notebook/Notebook')
            },
            {
                path: '/bookshelf',
                component: () => import('@/views/index/bookshelf/Bookshelf')
            },
            {
                path: '/community',
                component: () => import('@/views/index/community/Community')
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/Login')
    },
    {
        path: '/register',
        component: () => import('@/views/register/Register')
    },
    {
        path: '/reader',
        component: () => import('@/views/reader/Reader')
    }
]

const history = createWebHistory()
const router = createRouter({
    history, // 路由模式
    routes,
})
export default router