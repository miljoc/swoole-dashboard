export interface IArticleData {
  id: number
  status: string
  title: string
  abstractContent: string
  fullContent: string
  sourceURL: string
  imageURL: string
  timestamp: string | number
  platforms: string[]
  disableComment: boolean
  importance: number
  author: string
  reviewer: string
  type: string
  pageviews: number
}

export interface IDeclaredClass {
  id: number
  name: string
}

export interface IDeclaredConstants {
  id: number
  name: string
  value: any
}

export interface IDeclaredInterfaces {
  id: number
  name: string
}

export interface IExtensions {
  id: number
  name: string
  version: string
}

export interface IDefinedFunction {
  id: number
  name: string
  type: string
}

export interface IWorkerData {
  id: number
  pid: number
  reload_count: number
  reload_last_time: number
}

export interface IThreadData {
  id: number
  tid: number
}

export interface IIncludedFilesData {
  id: number
  filename: string
}

export interface IWorkerCoroutineData {
  id: number
  elapsed: number
  backTrace: string[]
}

export interface IConnectionInfo {
  total_recv_bytes: number
  total_send_bytes: number
  recv_queued_bytes: number
  send_queued_bytes: number
  server_port: number
  session_id: number
  reactor_id: number
  connect_time: number
  last_recv_time: number
  last_send_time: number
  port?: number
  address?: number
}

export interface IWorkerTimerData {
  id: number
  info: string[]
}

export interface IServerSetting {
  mode: number
  reactor_num: number
  worker_num: number
  manager_pid: number
  task_worker_num: number
  master_pid: number
}

export interface IServerStats {
  start_time: number
  request_count: number
  response_count: number
  abort_count: number
  accept_count: number
  close_count: number
  coroutine_num: number
  idle_worker_num: number
  dispatch_count: number
  connection_num: number
  tasking_num: number
  worker_dispatch_count: number
  worker_request_count: number
  worker_response_count: number
  worker_num: number
  user_worker_num: number
  task_worker_num: number
}

export interface IUnixSocket {
  fd: number
}

export interface IExtensionDetail {
  id: number
  name: string
}

export interface IExtensionInfo {
  class_name: string[]
  constants: object
  dependencies: string[]
  functions: string[]
  info: string
  ini_entries: object
  version: string
}

export interface IVersionInfo {
  os: string
  swooleVersion: string
  phpVersion: string
  host: string
}

export interface IObjectsData {
  id: number
  hash: string
  class: string
  memory_size: number
}

export interface IEventsData {
  fd: number
  events: number
  address: string
  socket_type: number
  fd_type: number
  out_buffer_size: number
  total_send_bytes: number
  total_recv_bytes: number
  port: number
  name?: string
}
