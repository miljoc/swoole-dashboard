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

export interface IWorkerTimerData {
  id: number
  info: string[]
}
