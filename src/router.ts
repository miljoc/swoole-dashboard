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
          // component: () => import('@/views/php/Extensions.vue'),
          component: () => import('@/views/php/ExtensionsNew.vue'),
          meta: {
            title: 'Extensions',
            icon: 'component',
            activeMenu: '/extensions'
          }
        },
        {
          path: '/extension_detail',
          component: () => import('@/views/php/ExtensionsDetail.vue'),
          meta: {
            title: 'Extensions Detail',
            hidden: true,
            activeMenu: '/extensions'
          }
        },
        {
          path: '/gcstatus',
          component: () => import('@/views/php/GCStatus.vue'),
          meta: {
            title: 'GC Status',
            icon: 'gc',
            activeMenu: '/gcstatus'
          }
        },
        {
          path: '/includedfiles',
          component: () => import('@/views/php/IncludedFiles.vue'),
          meta: {
            title: 'Included Files',
            icon: 'documentation',
            activeMenu: '/includedfiles'
          }
        },
        {
          path: '/includedfiles_detail',
          component: () => import('@/views/php/IncludedFilesDetail.vue'),
          meta: {
            title: 'Included Files Content',
            hidden: true,
            activeMenu: '/includedfiles'
          }
        },
        {
          path: '/classes',
          component: () => import('@/views/php/Classes.vue'),
          meta: {
            title: 'Classes',
            icon: 'hamburger',
            activeMenu: '/classes'
          }
        },
        {
          path: '/class_info',
          component: () => import('@/views/php/ClassInfo.vue'),
          meta: {
            title: 'Class Info',
            hidden: true,
            activeMenu: '/classes'
          }
        },
        {
          path: '/functions',
          component: () => import('@/views/php/Functions.vue'),
          meta: {
            title: 'Functions',
            icon: 'function',
            activeMenu: '/functions'
          }
        },
        {
          path: '/resources',
          component: () => import('@/views/php/Resources.vue'),
          meta: {
            title: 'Resources',
            icon: 'resource',
            activeMenu: '/resources'
          }
        },
        {
          path: '/defined_constants',
          component: () => import('@/views/php/DefinedConstants.vue'),
          meta: {
            title: 'Constants',
            icon: 'hamburger',
            activeMenu: '/defined_constants'
          }
        },
        {
          path: '/defined_interfaces',
          component: () => import('@/views/php/DefinedInterfaces.vue'),
          meta: {
            title: 'Interfaces',
            icon: 'comment-lines',
            activeMenu: '/defined_interfaces'
          }
        },
        {
          path: '/objects',
          component: () => import('@/views/php/Objects.vue'),
          meta: {
            title: 'Objects',
            icon: 'object',
            activeMenu: '/objects'
          }
        },
        {
          path: '/object_var_dump',
          component: () => import('@/views/php/ObjectVarDump.vue'),
          meta: {
            title: 'ObjectVarDump',
            hidden: true,
            activeMenu: '/objects'
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
            icon: 'gallery-view',
            activeMenu: '/processes'
          }
        }, {
          path: '/coroutines',
          component: () => import('@/views/swoole/Coroutines.vue'),
          meta: {
            title: 'Coroutines',
            icon: 'terminal',
            activeMenu: '/coroutines'
          }
        }, {
          path: '/connections',
          component: () => import('@/views/swoole/Connections.vue'),
          meta: {
            title: 'Connections',
            icon: 'tree-table',
            activeMenu: '/connections'
          }
        },
        {
          path: '/events',
          component: () => import('@/views/swoole/Events.vue'),
          meta: {
            title: 'Events',
            icon: 'email',
            activeMenu: '/events'
          }
        },
        {
          path: '/worker/:id',
          component: () => import('@/views/swoole/WorkerDetail.vue'),
          meta: {
            title: 'Worker Detail',
            hidden: true,
            activeMenu: '/processes'
          }
        },
        {
          path: '/timers/',
          component: () => import('@/views/swoole/Timers.vue'),
          meta: {
            title: 'Timers',
            icon: 'clock-fill',
            activeMenu: '/timers'
          }
        },
        {
          path: '/network_traffic/',
          component: () => import('@/views/chart/NetworkTraffic.vue'),
          meta: {
            title: 'Network Traffic',
            hidden: true,
            activeMenu: '/connections'
          }
        },
        {
          path: '/memory_info/:worker',
          component: () => import('@/views/swoole/MemoryInfo.vue'),
          meta: {
            title: 'Memory Info',
            hidden: true,
            activeMenu: '/processes'
          }
        },
        {
          path: '/socket_info/',
          component: () => import('@/views/swoole/SocketInfo.vue'),
          meta: {
            title: 'Socket Info',
            hidden: true,
            activeMenu: '/events'
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
