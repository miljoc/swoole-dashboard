import request from '@/utils/request'

export const getServerStats = () =>
  request({
    url: '/api/server_stats/worker-0',
    method: 'get'
  })
