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
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          component: () => import(/* webpackChunkName: "index" */ '@/views/dashboard/index.vue'),
          meta: {
            title: 'Swoole Dashboard',
            icon: 'dashboard'
          }
        },
        {
          path: '/worker_states',
          component: () => import(/* webpackChunkName: "worker_states" */ '@/views/dashboard/WorkerStats.vue'),
          meta: {
            title: 'Worker Stats',
            hidden: true,
            activeMenu: '/dashboard'
          }
        },
        {
          path: '/admin_server',
          component: () => import('@/views/server/AdminServer.vue'),
          meta: {
            title: 'Admin Server',
            hidden: true,
            activeMenu: '/dashboard'
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
          component: () => import(/* webpackChunkName: "extensions" */ '@/views/php/Extensions.vue'),
          meta: {
            title: 'Extensions',
            icon: 'component',
            activeMenu: '/extensions'
          }
        },
        {
          path: '/extension_info',
          component: () => import(/* webpackChunkName: "extension_info" */ '@/views/php/ExtensionInfo.vue'),
          meta: {
            title: 'Extension Info',
            hidden: true,
            activeMenu: '/extensions'
          }
        },
        {
          path: '/included_files',
          component: () => import(/* webpackChunkName: "included_files" */ '@/views/php/IncludedFiles.vue'),
          meta: {
            title: 'Included Files',
            icon: 'documentation',
            activeMenu: '/included_files'
          }
        },
        {
          path: '/included_file_info',
          component: () => import(/* webpackChunkName: "included_file_info" */ '@/views/php/IncludedFileInfo.vue'),
          meta: {
            title: 'Included File Info',
            hidden: true,
            activeMenu: '/included_files'
          }
        },
        {
          path: '/classes',
          component: () => import(/* webpackChunkName: "classes" */ '@/views/php/Classes.vue'),
          meta: {
            title: 'Classes',
            icon: 'news',
            activeMenu: '/classes'
          }
        },
        {
          path: '/class_info',
          component: () => import(/* webpackChunkName: "class_info" */ '@/views/php/ClassInfo.vue'),
          meta: {
            title: 'Class Info',
            hidden: true,
            activeMenu: '/classes'
          }
        },
        {
          path: '/functions',
          component: () => import(/* webpackChunkName: "functions" */ '@/views/php/Functions.vue'),
          meta: {
            title: 'Functions',
            icon: 'function',
            activeMenu: '/functions'
          }
        },
        {
          path: '/function_info',
          component: () => import(/* webpackChunkName: "function_info" */'@/views/php/FunctionInfo.vue'),
          meta: {
            title: 'Function Content',
            hidden: true,
            activeMenu: '/functions'
          }
        },
        {
          path: '/constants',
          component: () => import(/* webpackChunkName: "constants" */'@/views/php/Constants.vue'),
          meta: {
            title: 'Constants',
            icon: 'hamburger',
            activeMenu: '/constants'
          }
        },
        {
          path: '/interfaces',
          component: () => import(/* webpackChunkName: "interfaces" */'@/views/php/Interfaces.vue'),
          meta: {
            title: 'Interfaces',
            icon: 'comment-lines',
            activeMenu: '/interfaces'
          }
        },
        {
          path: '/globals',
          component: () => import(/* webpackChunkName: "globals" */'@/views/php/Globals.vue'),
          meta: {
            title: 'Globals',
            icon: 'global_var'
          }
        },
        {
          path: '/objects',
          component: () => import(/* webpackChunkName: "objects" */'@/views/php/Objects.vue'),
          meta: {
            title: 'Objects',
            icon: 'object',
            activeMenu: '/objects'
          }
        },
        {
          path: '/resources',
          component: () => import(/* webpackChunkName: "resources" */ '@/views/php/Resources.vue'),
          meta: {
            title: 'Resources',
            icon: 'resource',
            activeMenu: '/resources'
          }
        },
        {
          path: '/object_var_dump',
          component: () => import(/* webpackChunkName: "object_var_dump" */ '@/views/php/ObjectVarDump.vue'),
          meta: {
            title: 'Object Var Dump',
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
          component: () => import(/* webpackChunkName: "processes" */ '@/views/swoole/Processes.vue'),
          meta: {
            title: 'Processes',
            icon: 'gallery-view',
            activeMenu: '/processes'
          }
        }, {
          path: '/coroutines',
          component: () => import(/* webpackChunkName: "coroutines" */ '@/views/swoole/Coroutines.vue'),
          meta: {
            title: 'Coroutines',
            icon: 'terminal',
            activeMenu: '/coroutines'
          }
        }, {
          path: '/connections',
          component: () => import(/* webpackChunkName: "connections" */ '@/views/swoole/Connections.vue'),
          meta: {
            title: 'Connections',
            icon: 'tree-table',
            activeMenu: '/connections'
          }
        }, {
          path: '/connection_info',
          component: () => import(/* webpackChunkName: "connections" */ '@/views/swoole/ConnectionInfo.vue'),
          meta: {
            title: 'Connection Info',
            hidden: true,
            activeMenu: '/connections'
          }
        },
        {
          path: '/events',
          component: () => import(/* webpackChunkName: "events" */ '@/views/swoole/Events.vue'),
          meta: {
            title: 'Events',
            icon: 'email',
            activeMenu: '/events'
          }
        },
        {
          path: '/worker/:id',
          component: () => import(/* webpackChunkName: "worker" */ '@/views/swoole/WorkerInfo.vue'),
          meta: {
            title: 'Worker Info',
            hidden: true,
            activeMenu: '/processes'
          }
        },
        {
          path: '/timers/',
          component: () => import(/* webpackChunkName: "timers" */ '@/views/swoole/Timers.vue'),
          meta: {
            title: 'Timers',
            icon: 'clock-fill',
            activeMenu: '/timers'
          }
        },
        {
          path: '/network_traffic/',
          component: () => import(/* webpackChunkName: "network_traffic" */ '@/views/chart/NetworkTraffic.vue'),
          meta: {
            title: 'Network Traffic',
            hidden: true,
            activeMenu: '/connections'
          }
        },
        {
          path: '/memory_info/',
          component: () => import(/* webpackChunkName: "memory_info" */ '@/views/swoole/MemoryInfo.vue'),
          meta: {
            title: 'Memory Info',
            hidden: true,
            activeMenu: '/processes'
          }
        },
        {
          path: '/socket_info/',
          component: () => import(/* webpackChunkName: "socket_info" */ '@/views/swoole/SocketInfo.vue'),
          meta: {
            title: 'Socket Info',
            hidden: true,
            activeMenu: '/events'
          }
        }
      ]
    },
    {
      path: '/composer',
      component: Layout,
      redirect: '/composer_info',
      meta: {
        title: 'Composer',
        icon: 'example'
      },
      children: [
        {
          path: '/composer_info',
          component: () => import(/* webpackChunkName: "composer" */ '@/views/composer/Composer.vue'),
          meta: {
            title: 'Composer',
            icon: 'component',
            activeMenu: '/composer_info'
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
