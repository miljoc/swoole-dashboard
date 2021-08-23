import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout/index.vue'

Vue.use(Router)

/*
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    hidden: true                 if true, this route will not show in the sidebar (default is false)
  }
*/

export default new Router({
  // mode: 'history',  // Enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
      meta: { hidden: true }
    },
    {
      path: '/404',
      component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
      meta: { hidden: true }
    },
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
          meta: {
            title: 'Swoole Dashboard',
            icon: 'dashboard'
          }
        }
      ]
    },
    {
      path: '/php',
      component: Layout,
      redirect: '/php/extensions',
      meta: {
        title: 'PHP信息',
        icon: 'example'
      },
      children: [
        {
          path: '/extensions',
          component: () => import(/* webpackChunkName: "serverstats" */ '@/views/php/Extensions.vue'),
          meta: {
            title: '所有扩展',
            icon: 'stats'
          }
        },
        {
          path: '/gcstatus',
          component: () => import(/* webpackChunkName: "serverstats" */ '@/views/php/GCStatus.vue'),
          meta: {
            title: '垃圾回收信息',
            icon: 'stats'
          }
        }
      ]
    },
    {
      path: '/swoole',
      component: Layout,
      redirect: '/swoole/serverstats',
      meta: {
        title: 'Swoole',
        icon: 'example'
      },
      children: [
        {
          path: '/serverstats',
          component: () => import(/* webpackChunkName: "serverstats" */ '@/views/swoole/ServerStats.vue'),
          meta: {
            title: '服务器状态',
            icon: 'stats'
          }
        },
        {
          path: '/workers',
          component: () => import(/* webpackChunkName: "workers" */ '@/views/swoole/Workers.vue'),
          meta: {
            title: '所有worker进程',
            icon: 'stats'
          }
        },
        {
          path: '/worker/:id',
          component: () => import(/* webpackChunkName: "workers" */ '@/views/swoole/WorkerDetail.vue'),
          meta: {
            title: '进程详情',
            hidden: true
          }
        }
      ]
    },
    {
      path: '*',
      redirect: '/404',
      meta: { hidden: true }
    }
  ]
})
