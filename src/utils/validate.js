/**
 * 验证手机格式
 * @param {*} value 手机号
 */
export function isPhone (value) {
  const reg = /^1[3456789]\d{9}$/
  return reg.test(value)
}

/**
 * 验证邮箱格式
 * @param {*} value 邮箱号
 */
export function isEmail (value) {
  const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
  return reg.test(value)
}

/**
 * 验证密码 6-20位的数字 + 字母格式
 * @param {*} value 数字 + 字母
 */
export function isPassWord (value) {
  const reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/
  return reg.test(value)
}

/**
 * 验证码 6位的数字 + 字母
 * @param {*} value 数字 + 字母
 */
export function isCode (value) {
  const reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6}$/
  return reg.test(value)
}

/**
 * 验证码 6位的数字
 */
export function checkCode (value) {
  const regCode = /^\d{6}$/
  return regCode.test(value)
}

/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername (str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}