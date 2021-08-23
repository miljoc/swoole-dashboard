import request from '@/utils/request'

export const getWorkerInfo = (id: number) =>
  request({
    url: `/api/getpid/worker-${id}`,
    method: 'get',
})

export const getCoroutineStats = (id: number) =>
  request({
    url: `/api/coroutine_stats/worker-${id}`,
    method: 'get',
})

export const getWorkerMemoryUsage = (id: number) =>
  request({
    url: `/api/memory_usage/worker-${id}`,
    method: 'get',
})
