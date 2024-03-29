import { isFunction, isArray, isString } from "../../../src/utils/is"
import {
  formatRowDataByKey,
} from "../../../src/utils/index";


// 储存 column type
export const columnTypeList = { enum: columnTypeByEnum }

// 储存注册的 plugin
export const tablePluginList = []

export function use(fn, options = {}) {
  if (!isFunction(fn)) {
    throw new TypeError("table use plugin install must a function")
  }

  tablePluginList.push(function () {
    fn.call(this, options)
  })
}

// 注册表格列类型
export function registerColumnType(columnTypeName, handler, options) {
  if (!handler && !isFunction(handler)) {
    throw new Error('register table column type must a function')
  }

  if (!columnTypeName) {
    throw new Error('table column type name is required')
  }
  columnTypeList[columnTypeName] = handler(options)

}

// 枚举类型
export function pdTableEnumColumnTypePlugin(options) {
  function enumType(h, row, column) {
    let result = this.nullValueDefault
    const { prop, enumList, } = column
    const { getDomClassName } = options
    let value = formatRowDataByKey(prop, row);

    if (isArray(enumList)) {
      const existingEnumItem = enumList.find(item => item.value === value)
      const enumValue = existingEnumItem ? existingEnumItem.value : null
      const enumLabel = existingEnumItem ? existingEnumItem.label : null
      if (getDomClassName && enumValue) {
        const className = getDomClassName(existingEnumItem.value)
        if (className) {
          result = h('span', { class: [className] }, enumLabel)
        } else {
          result = enumLabel
        }
      } else {
        result = enumLabel || result
      }
    }

    return result
  }
  return enumType
}

// 枚举类型
export function columnTypeByEnum(h, row, column) {
  let result = this.nullValueDefault
  let { prop, enumList, } = column
  let value = formatRowDataByKey(prop, row);
  enumList = isString(enumList) ? this.selectOptionMap[enumList] : enumList

  if (isArray(enumList)) {
    const existingEnumItem = enumList.find(item => item.value === value)
    const enumLabel = existingEnumItem ? existingEnumItem.label : null
    result = enumLabel || result
  }
  return result
}


// element native column type
export const nativeColumnType = ['selection', 'index', 'expand']

// decide native column type
export const isNativeColumnType = (type) => {
  return nativeColumnType.includes(type)
}
