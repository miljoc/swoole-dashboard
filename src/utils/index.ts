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

export const bytesFormat = (bytes: number) => {
  if (bytes > 1024 * 1024 * 1024) {
    return String((bytes / (1024 * 1024 * 1024)).toFixed(2)) + ' GB'
  }
  if (bytes > 1024 * 1024) {
    return String((bytes / (1024 * 1024)).toFixed(2)) + ' MB'
  }
  if (bytes > 1024) {
    return String((bytes / (1024)).toFixed(2)) + ' KB'
  }
  return String(bytes) + ' B'
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
