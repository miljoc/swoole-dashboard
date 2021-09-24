import request from '@/utils/request'

export const getVersionInfo = () =>
  request({
    url: '/api/get_version_info',
    method: 'get'
  })

export const getLoadedExtensions = () =>
  request({
    url: '/api/get_loaded_extensions/worker-0',
    method: 'get'
  })

export const getClasses = () =>
  request({
    url: '/api/get_declared_classes/worker-0',
    method: 'get'
  })

export const getGCStatus = () =>
  request({
    url: '/api/gc_status/worker-0',
    method: 'get'
  })

export const getIncludedFiles = () =>
  request({
    url: '/api/get_included_files/worker-0',
    method: 'get'
  })

export const getIncludedFilesContent = (filename = '') =>
  request({
    url: `/api/get_included_file_contents/worker-0?filename=${filename}`,
    method: 'get'
  })

export const getDeclaredClasses = () =>
  request({
    url: '/api/get_declared_classes/worker-0',
    method: 'get'
  })

export const getClassesInfo = (class_name: string) =>
  request({
    url: '/api/get_class_info',
    method: 'get',
    params: { class_name }
  })

export const getDefinedFunctions = () =>
  request({
    url: '/api/get_defined_functions/worker-0',
    method: 'get'
  })

export const getResources = (worker = 'master') =>
  request({
    url: '/api/get_resources/' + worker,
    method: 'get'
  })

export const getDefinedConstants = () =>
  request({
    url: '/api/get_defined_constants/worker-0',
    method: 'get'
  })

export const getDeclaredInterfaces = () =>
  request({
    url: '/api/get_declared_interfaces/worker-0',
    method: 'get'
  })

export const getExtensionDetail = (extension_name: any) =>
  request({
    url: `/api/get_extension_info/worker-0?extension_name=${extension_name}`,
    method: 'get'
  })
