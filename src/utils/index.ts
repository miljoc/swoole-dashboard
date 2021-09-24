// Parse the time to string
export const parseTime = (
  time?: object | string | number | null,
  cFormat?: string
): string | null => {
  if (time === undefined || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date: Date
  if (typeof time === 'object') {
    date = time as Date
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(/-/gm, '/')
      }
    }
    if (typeof time === 'number' && time.toString().length >= 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: { [key: string]: number } = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
    M: date.getMilliseconds()
  }
  const timeStr = format.replace(/{([ymdhisaM])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return timeStr
}

export const parseUptime = (started_time: number) => {
  const date = new Date()
  const diff = date.getTime() / 1000 - started_time

  const _DAY = 60 * 60 * 24
  const _HOUR = 60 * 60
  const _MINUTE = 60

  if (diff > _DAY) {
    return `${parseInt(String(diff / _DAY), 10)} days`
  }
  if (diff > _HOUR) {
    return `${parseInt(String(diff / _HOUR), 10)} hours`
  }
  if (diff > _MINUTE) {
    return `${parseInt(String(diff / _MINUTE), 10)} minutes`
  }
  return `${parseInt(String(diff), 10)} seconds`
}

export const numberFormat = (n: number, step = 1000, width = 3, max_index = 4, map = ['', 'K', 'M', 'B', 'T']) => {
  for (let i = max_index; i >= 1; i--) {
    if (n >= Math.pow(step, i)) {
      return String((n / Math.pow(step, i)).toFixed(width)) + ' ' + map[i]
    }
  }

  return String(n) + ' ' + map[0]
}

export const bytesFormat = (bytes: number) => {
  return numberFormat(bytes, 1024, 2, 4, ['B', 'KB', 'MB', 'GB', 'TB'])
}

export const socketTypeFilter = (type: number, ssl = 0) => {
  let _type = ''
  switch (type) {
    case 1:
      _type += 'TCP:IPv4'
      break
    case 2:
      _type += 'UDP:IPv4'
      break
    case 3:
      _type += 'TCP:IPv6'
      break
    case 4:
      _type += 'UDP:IPv6'
      break
    case 5:
      _type += 'STREAM:Unix'
      break
    case 6:
      _type += 'DGRAM:Unix'
      break
    default:
      return '-'
  }

  if (ssl) {
    _type += ':SSL'
  }

  return _type
}

export const eventsFitler = (events: number) => {
  const array = []
  if (events & 512) {
    array.push('Readable')
  }
  if (events & 1024) {
    array.push('Writable')
  }
  return array.join(' | ')
}

export const fdTypeFilter = (type: number) => {
  switch (type) {
    case 9:
      return 'signal'
    case 3:
      return 'pipe'
    case 0:
      return 'session'
    default:
      return 'php_stream'
  }
}

// Format and filter json data using filterKeys array
export const formatJson = (filterKeys: any, jsonData: any) =>
  jsonData.map((data: any) => filterKeys.map((key: string) => {
    if (key === 'timestamp') {
      return parseTime(data[key])
    } else {
      return data[key]
    }
  }))

// Check if an element has a class
export const hasClass = (ele: HTMLElement, className: string) => {
  return !!ele.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

// Add class to element
export const addClass = (ele: HTMLElement, className: string) => {
  if (!hasClass(ele, className)) ele.className += ' ' + className
}

// Remove class from element
export const removeClass = (ele: HTMLElement, className: string) => {
  if (hasClass(ele, className)) {
    const reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

// Toggle class for the selected element
export const toggleClass = (ele: HTMLElement, className: string) => {
  if (!ele || !className) {
    return
  }
  let classString = ele.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  ele.className = classString
}

/**
 * 获取排序后数据
 * @param field
 * @param sortType
 */
export const getSortFun = (field: string, sortType: string, data: Array<any>) => {
  return data.sort((a, b) => {
    const value1 = a[field]
    const value2 = b[field]
    if (sortType === 'desc') {
      return value2 - value1
    } else {
      return value1 - value2
    }
  })
}

export const parseResourceInfo = (row: any) => {
  if (row.type !== 'stream') {
    return '-'
  }
  return row.info.stream_type
}

/**
 * 格式化数值 千位逗号分隔
 * @param num
 */
export const formatNumber = (num: Number) => {
  return num.toLocaleString()
}
