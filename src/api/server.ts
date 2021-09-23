import request from '@/utils/request'

export const getServerStats = (worker = 'worker-0') =>
  request({
    url: '/api/server_stats/' + worker,
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

export const getWorkerInfo2 = (worker: string) =>
  request({
    url: '/api/get_worker_info/' + worker,
    method: 'get'
  })

export const getThreadInfo = (threadId: number) =>
  request({
    url: '/api/get_thread_info/reactor-' + threadId,
    method: 'get'
  })

export const getTaskWorkerInfo = (workerId: number) =>
  request({
    url: '/api/get_worker_info/task_worker-' + workerId,
    method: 'get'
  })

export const getCoroutineList = (worker: any) =>
  request({
    url: `/api/get_coroutine_list/${worker}`,
    method: 'get'
  })

export const getCoroutineBackTrace = (worker: string, cid: number) =>
  request({
    url: `/api/coroutine_bt/${worker}`,
    method: 'get',
    params: { cid: cid }
  })

export const getTimerList = (worker: string) =>
  request({
    url: `/api/get_timer_list/${worker}`,
    method: 'get'
  })

export const getObjects = (worker: string) =>
  request({
    url: `/api/get_objects/${worker}`,
    method: 'get'
  })

export const getAllSockets = (worker: string) =>
  request({
    url: `/api/get_all_sockets/${worker}`,
    method: 'get'
  })

export const getConnections = (worker: any) =>
  request({
    url: `/api/get_connections/${worker}`,
    method: 'get'
  })

export const closeConnection = (session_id: number) =>
  request({
    url: '/api/close_session',
    method: 'get',
    params: { session_id }
  })

export const getSocketInfo = (fd: string) =>
  request({
    url: '/api/get_socket_info',
    method: 'get',
    params: { fd }
  })

export const getAllUnixSockets = (type: string, worker: string) =>
  request({
    url: `/api/get_all_unix_sockets/${worker}`,
    method: 'get',
    params: { type: type }
  })

export const getAllPorts = () =>
  request({
    url: '/api/get_all_ports',
    method: 'get'
  })

export const getClientInfo = (worker: string, session_id: number) =>
  request({
    url: `/api/get_client_info/${worker}`,
    method: 'get',
    params: { session_id: session_id }
  })

export const getConnectionInfo = (worker: string, session_id: number) =>
  request({
    url: `/api/get_connection_info/${worker}`,
    method: 'get',
    params: { session_id: session_id }
  })

export const getMemoryInfo = (worker: string) =>
  request({
    url: `/api/get_memory_info/${worker}`,
    method: 'get'
  })
