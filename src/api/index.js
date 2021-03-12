/**
 * 包含多个接口请求的函数模块
 */

import ajax from './ajax'

export const reqRegister = user => ajax('/register', user, 'POST')

export const reqLogin = ({ username, password}) => ajax('/login', { username, password }, 'POST')

export const reqUpdateUser = user => ajax('/update', user, 'POST')

export const reqUser = () => ajax('/user')

export const reqUserList = usertype => ajax('/list', { usertype })

export const reqChatMsgList = () => ajax('/msglist')

export const reqReadChatMsg = (from) => ajax('/readmsg', {from}, 'POST')