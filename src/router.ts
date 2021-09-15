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
      return {
        x: 0,
        y: 0
      }
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
      path: '/workers',
      component: () => import(/* webpackChunkName: "workers" */ '@/views/swoole/Workers.vue'),
      meta: {
        hidden: true
      }
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
        title: 'ZendVM',
        icon: 'example'
      },
      children: [
        {
          path: '/extensions',
          component: () => import(/* webpackChunkName: "serverstats" */ '@/views/php/Extensions.vue'),
          meta: {
            title: 'Extensions',
            icon: 'component'
          }
        },
        {
          path: '/gcstatus',
          component: () => import(/* webpackChunkName: "serverstats" */ '@/views/php/GCStatus.vue'),
          meta: {
            title: 'GC Status',
            icon: 'component'
          }
        },
        {
          path: '/includedfiles',
          component: () => import(/* webpackChunkName: "serverstats" */ '@/views/php/IncludedFiles.vue'),
          meta: {
            title: 'Included Files',
            icon: 'component'
          }
        },
        {
          path: '/declared_classes',
          component: () => import(/* webpackChunkName: "serverstats" */ '@/views/php/DeclaredClasses.vue'),
          meta: {
            title: 'Classes',
            icon: 'list'
          }
        },
        {
          path: '/defined_functions',
          component: () => import(/* webpackChunkName: "serverstats" */ '@/views/php/DefinedFunctions.vue'),
          meta: {
            title: 'Functions',
            icon: 'list'
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
        icon: 'international'
      },
      children: [
        {
          path: '/serverstats',
          component: () => import(/* webpackChunkName: "serverstats" */ '@/views/swoole/ServerStats.vue'),
          meta: {
            title: 'Server Stats',
            icon: 'list'
          }
        }, {
          path: '/processes',
          component: () => import(/* webpackChunkName: "workers" */ '@/views/swoole/Processes.vue'),
          meta: {
            title: 'Processes',
            icon: 'list'
          }
        }, {
          path: '/pipelines',
          component: () => import(/* webpackChunkName: "workers" */ '@/views/swoole/Pipelines.vue'),
          meta: {
            title: 'Pipelines',
            icon: 'list'
          }
        }, {
          path: '/connections',
          component: () => import(/* webpackChunkName: "workers" */ '@/views/swoole/Connections.vue'),
          meta: {
            title: 'Connections',
            icon: 'list'
          }
        },
        {
          path: '/worker/:id',
          component: () => import(/* webpackChunkName: "workers" */ '@/views/swoole/WorkerDetail.vue'),
          meta: {
            title: 'Worker Detail',
            hidden: true
          }
        },
        {
          path: '/coroutines/:id',
          component: () => import(/* webpackChunkName: "workers" */ '@/views/swoole/Coroutines.vue'),
          meta: {
            title: 'Coroutine List',
            hidden: true
          }
        },
        {
          path: '/events/:id',
          component: () => import(/* webpackChunkName: "workers" */ '@/views/swoole/Events.vue'),
          meta: {
            title: 'Event List',
            hidden: true
          }
        },
        {
          path: '/timers/:id',
          component: () => import(/* webpackChunkName: "workers" */ '@/views/swoole/Timers.vue'),
          meta: {
            title: 'Timer List',
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
