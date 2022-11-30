export * from './format-input'
export * from './parse-input'
export * from './validation'
export * from './utils'


export const isEmptyObject = (obj) => {
  for (var i in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(i)) {
      return false;
    }
  }
  return true;
}

export const removeValuesFromObjectByKey = (object, values) => {
  const obj = {...object}
  if (values instanceof Array) {
    values.forEach(value => {
      delete obj[value]
    })
  } else {
    delete obj[values]
  }
  return obj
}
