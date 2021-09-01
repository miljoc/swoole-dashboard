import request from '@/utils/request'

export const getServerStats = () =>
  request({
    url: '/api/server_stats/worker-0',
    method: 'get'
  })

export const getServerSetting = () =>
  request({
    url: '/api/server_setting/worker-0',
    method: 'get'
  })

export const getServer = () =>
  request({
    url: '/api/server/worker-0',
    method: 'get'
  })

export const getPid = (param: any) =>
  request({
    url: `/api/getpid/${param}`,
    method: 'get'
  })

export const getMemoryUsage = (param: any) =>
  request({
    url: `/api/memory_usage/${param}`,
    method: 'get'
  })

export const getCoroutineStats = (param: any) =>
  request({
    url: `/api/coroutine_stats/${param}`,
    method: 'get'
  })
