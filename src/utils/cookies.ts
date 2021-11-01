import Cookies from 'js-cookie'

// App
const sidebarStatusKey = 'sidebar_status'
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey)
export const setSidebarStatus = (sidebarStatus: string) => Cookies.set(sidebarStatusKey, sidebarStatus)

const languageKey = 'language'
export const getLanguage = () => Cookies.get(languageKey) || 'en'
export const setLanguage = (language: string) => Cookies.set(languageKey, language)

// User
const tokenKey = 'swoole_dashboard_access_token'
export const getToken = () => Cookies.get(tokenKey)
export const setToken = (token: string) => Cookies.set(tokenKey, token, { expires: 30 })
export const removeToken = () => Cookies.remove(tokenKey)

// Admin Server Token
const adminServerTokenKey = 'admin_server_access_token'
export const getAdminServerToken = () => Cookies.get(adminServerTokenKey) || ''
export const setAdminServerToken = (token: string) => Cookies.set(adminServerTokenKey, token)
export const removeAdminServerToken = () => Cookies.remove(adminServerTokenKey)

// API
const adminSeverKey = 'admin_server_address'
export const getAdminServer = () => Cookies.get(adminSeverKey) || 'http://127.0.0.1:9502/'
export const setAdminServer = (address: string) => Cookies.set(adminSeverKey, address)
export const removeAdminServer = () => Cookies.remove(adminSeverKey)

const adminSeverListKey = 'admin_server_address_list'
export const getAdminServerList = () => Cookies.getJSON(adminSeverListKey) || [{ value: getAdminServer(), token: '', status: 404 }]
export const setAdminServerList = (address: any) => Cookies.set(adminSeverListKey, address)
export const removeAdminServerList = () => Cookies.remove(adminSeverListKey)
