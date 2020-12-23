interface replacerFunc {
  (obj: any): any
}
interface replacerObj {
  trueString?: any;
  falseString?: any;
  trueValue?: any;
  falseValue?: any;
}
export function mapKeyProp (data: any, keyString: string, defaultValue?: any, replacer?: replacerObj | replacerFunc): any { // get object value eg: const data = {test: {test: 'xxx'}} mapKeyProp(data, 'test.test')
  let obj:any = data
  if (!keyString || !data) return (obj === undefined || obj === '--' || obj === '----' || obj === 'NaN' || obj === 'null' || obj === 'undefined' || obj === null) ? defaultValue : obj
  const keyChain = keyString.split('.')
  if (keyChain.length === 1) {
    obj = data[keyString]
  } else {
    keyChain.forEach(key => {
      if (obj) {
        obj = obj[key]
      }
    })
  }
  obj = (obj === undefined || obj === '--' || obj === '----' || obj === 'NaN' || obj === 'null' || obj === 'undefined' || obj === null) ? defaultValue : obj
  if (replacer) {
    if (typeof replacer === 'function') {
      obj = replacer(obj)
    } else {
      if ((replacer as replacerObj).trueString && (replacer as replacerObj).falseString) {
        const trueValue = (replacer as replacerObj).trueValue
        const falseValue = (replacer as replacerObj).falseValue
        if (obj !== defaultValue) {
          if (trueValue !== undefined && falseValue !== undefined) {
            if (obj === trueValue) {
              obj = (replacer as replacerObj).trueString
            } else if (obj === falseValue) {
              obj = (replacer as replacerObj).falseString
            }
          } else {
            obj = obj ? (replacer as replacerObj).trueString : (replacer as replacerObj).falseString
          }
        }
      }
    }
  }
  return obj
}

export function isObject (input: any): boolean {
  return Object.prototype.toString.call(input) === '[object Object]'
}
