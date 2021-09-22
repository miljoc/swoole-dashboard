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
  session_id: number
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

export interface IUnixSocket {
  fd: number
}
