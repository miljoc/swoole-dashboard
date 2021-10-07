import request from '@/utils/request'

export const getUserInfo = () =>
  request({
    url: 'https://business.swoole.com/dashboardLogin/info',
    method: 'post'
  })

export const login = (data: any) =>
  request({
    url: 'https://business.swoole.com/dashboardLogin/login',
    method: 'post',
    data
  })

export const logout = () =>
  request({
    url: 'https://business.swoole.com/dashboardLogin/logout',
    method: 'post'
  })
