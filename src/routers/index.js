import {createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('@/views/index/index'),
        children: [
            {
                path: '/notebook',
                component: () => import('@/views/index/notebook/notebook')
            },
            {
                path: '/bookshelf',
                component: () => import('@/views/index/bookshelf/bookshelf')
            },
            {
                path: '/community',
                component: () => import('@/views/index/community/community')
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/login')
    },
    {
        path: '/register',
        component: ()=>import('@/views/register/register')
    },
    {
        path: '/reader',
        component:()=>import('@/views/reader/reader')
    }
]

const history = createWebHistory()
const router = createRouter({
    history, // 路由模式
    routes,
})
export default router