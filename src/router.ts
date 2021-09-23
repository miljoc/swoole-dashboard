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
      component: () => import('@/views/login/index.vue'),
      meta: { hidden: true }
    },
    {
      path: '/404',
      component: () => import('@/views/404.vue'),
      meta: { hidden: true }
    },
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          component: () => import('@/views/dashboard/index.vue'),
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
      redirect: '/extensions',
      meta: {
        title: 'ZendVM',
        icon: 'example'
      },
      children: [
        {
          path: '/extensions',
          component: () => import('@/views/php/Extensions.vue'),
          meta: {
            title: 'Extensions',
            icon: 'component'
          }
        },
        {
          path: '/gcstatus',
          component: () => import('@/views/php/GCStatus.vue'),
          meta: {
            title: 'GC Status',
            icon: 'gc'
          }
        },
        {
          path: '/includedfiles',
          component: () => import('@/views/php/IncludedFiles.vue'),
          meta: {
            title: 'Included Files',
            icon: 'documentation'
          }
        },
        {
          path: '/includedfiles_detail',
          component: () => import(/* webpackChunkName: "workers" */ '@/views/php/IncludedFilesDetail.vue'),
          meta: {
            title: 'Included Files Content',
            hidden: true
          }
        },
        {
          path: '/classes',
          component: () => import('@/views/php/Classes.vue'),
          meta: {
            title: 'Classes',
            icon: 'hamburger'
          }
        },
        {
          path: '/functions',
          component: () => import('@/views/php/Functions.vue'),
          meta: {
            title: 'Functions',
            icon: 'function'
          }
        },
        {
          path: '/resources',
          component: () => import('@/views/php/Resources.vue'),
          meta: {
            title: 'Resources',
            icon: 'resource'
          }
        },
        {
          path: '/objects',
          component: () => import('@/views/php/Objects.vue'),
          meta: {
            title: 'Objects',
            icon: 'object'
          }
        }
      ]
    },
    {
      path: '/swoole',
      component: Layout,
      redirect: '/processes',
      meta: {
        title: 'Swoole',
        icon: 'sw-1'
      },
      children: [
        {
          path: '/processes',
          component: () => import('@/views/swoole/Processes.vue'),
          meta: {
            title: 'Processes',
            icon: 'gallery-view'
          }
        }, {
          path: '/coroutines',
          component: () => import('@/views/swoole/Coroutines.vue'),
          meta: {
            title: 'Coroutines',
            icon: 'terminal'
          }
        }, {
          path: '/connections',
          component: () => import('@/views/swoole/Connections.vue'),
          meta: {
            title: 'Connections',
            icon: 'tree-table'
          }
        },
        {
          path: '/events',
          component: () => import('@/views/swoole/Events.vue'),
          meta: {
            title: 'Events',
            icon: 'email'
          }
        },
        {
          path: '/worker/:id',
          component: () => import('@/views/swoole/WorkerDetail.vue'),
          meta: {
            title: 'Worker Detail',
            hidden: true
          }
        },
        {
          path: '/timers/',
          component: () => import('@/views/swoole/Timers.vue'),
          meta: {
            title: 'Timers',
            icon: 'clock-fill'
          }
        },
        {
          path: '/network_traffic/',
          component: () => import('@/views/chart/NetworkTraffic.vue'),
          meta: {
            title: 'Network Traffic',
            hidden: true
          }
        },
        {
          path: '/object_var_dump',
          component: () => import(/* webpackChunkName: "workers" */ '@/views/php/ObjectVarDump.vue'),
          meta: {
            title: 'ObjectVarDump',
            hidden: true
          }
        },
        {
          path: '/memory_info/:worker',
          component: () => import(/* webpackChunkName: "workers" */ '@/views/swoole/MemoryInfo.vue'),
          meta: {
            title: 'Memory Info',
            hidden: true
          }
        },
        {
          path: '/socket_info/',
          component: () => import(/* webpackChunkName: "workers" */ '@/views/swoole/SocketInfo.vue'),
          meta: {
            title: 'Socket Info',
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
