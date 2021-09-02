import request from '@/utils/request'

export const getWorkerInfo = (id: number) =>
  request({
    url: `/api/getpid/${id}`,
    method: 'get'
  })

export const getCoroutineStats = (id: number) =>
  request({
    url: `/api/coroutine_stats/${id}`,
    method: 'get'
  })

export const getWorkerMemoryUsage = (id: number) =>
  request({
    url: `/api/memory_usage/${id}`,
    method: 'get'
  })
