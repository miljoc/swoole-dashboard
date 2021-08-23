import request from '@/utils/request'

export const getLoadedExtensions = () =>
  request({
    url: '/api/get_loaded_extensions/worker-0',
    method: 'get'
  })

export const getGCStatus = () =>
  request({
    url: '/api/gc_status/worker-0',
    method: 'get'
  })
