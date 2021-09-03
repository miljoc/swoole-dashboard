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

export const getWorkerInfo = (workerId: number) =>
  request({
    url: '/api/get_worker_info/worker-' + workerId,
    method: 'get'
  })

export const getTaskWorkerInfo = (workerId: number) =>
  request({
    url: '/api/get_worker_info/task_worker-' + workerId,
    method: 'get'
  })

export const getCoroutineInfo = (worker: any) =>
  request({
    url: `/api/get_co_info/${worker}`,
    method: 'get'
  })

export const getTimerInfo = (worker: any) =>
  request({
    url: `/api/get_timer_info/${worker}`,
    method: 'get'
  })
