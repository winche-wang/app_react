/**
 * 包含多个reducer函数：根据老的state和指定的action返回一个新的state
 */

import { combineReducers } from 'redux'
import {AUTH_SUCCESS, ERROR_MSG, RECEIVE_USER, RESET_USER, RECEIVE_USER_LIST, RECEIVE_MSG_LIST, RECEIVE_MSG, MSG_READ  } from './action-type.js'

import {getRedirectPath} from '../utils'

/**
 * 初始化User对象
 * username---用户名
 * usertype---用户类别
 * msg---错误提示信息
 * redirectTo---跳转路由地址
 */
const initUser = {
    username: '',   
    usertype: '',   
    msg: '',        
    redirectTo:''   
}

/**
 * 管理用户的reducer
 * @param {*} state 
 * @param {*} action 
 */
function user(state = initUser, action) {
    switch (action.type) {
        /**
         * 认证成功
         * data是user
         */
        case AUTH_SUCCESS:
            const redirectTo = getRedirectPath(action.data.usertype, action.data.header)
            return { ...state, ...action.data, redirectTo}
        /**
         * 错误信息提示
         * data是msg
         */
        case ERROR_MSG:
            return {...state, msg:action.data}
        /**
         * 接受用户
         */
        case RECEIVE_USER:
            return action.data
        /**
         * 重置用户
         */
        case RESET_USER:
            return{...initUser, msg:action.data}

        default:
            return state
    }
}

/**
 * 初始化用户列表
 */
const initUserList = []

/**
 * 管理用户列表的reducer
 * @param {*} state 
 * @param {*} action 
 */
function userList(state = initUserList, action) {
    switch (action.type) {
        case RECEIVE_USER_LIST:
            return action.data
        default:
            return state
    }
 }

/**
 * 初始chat对象
 * chatMsg---消息数组[{from: id1, to: id2}...]
 * users---所有用户的集合对象{id1: user1, id2: user2}
 * unReadCount---未读消息的数量
 */
const initChat = {
    chatMsgs: [],
    users: {},
    unReadCount: 0
}

 /**
  * 管理聊天相关信息数据的reducer
  * @param {*} state 
  * @param {*} action 
  */
function chat(state = initChat, action) {
    switch (action.type) {
        case RECEIVE_MSG:
            const { chatMsg, isToMe } = action.data
            
            return {
                chatMsgs: [...state.chatMsgs, chatMsg],                
                users: state.users,
                unReadCount: state.unReadCount + (!chatMsg.read && isToMe ? 1 : 0)                
            }
        case RECEIVE_MSG_LIST:
            const { chatMsgs, users, userid } = action.data
            
            return {
                chatMsgs,
                users,
                unReadCount: chatMsgs.reduce((preTotal, msg) => {
                    
                    // 别人发给我的未读消息 
                    return preTotal + (!msg.read && msg.to === userid ? 1 : 0)
                }, 0)
            }
        case MSG_READ:
            const { count, from, to } = action.data                    

            return {
                chatMsgs: state.chatMsgs.map(msg => {
                    if (msg.from === from && msg.to === to && !msg.read) {
                        //需要更新 
                        return { ...msg, read: true }
                    } else {
                        //不需要更新
                        return msg
                    }
                }),
                users: state.users,
                unReadCount: state.unReadCount - count
        }
        default:
            return state
    }
}

/**
 * 向外暴露合并的reducer
 */
export default combineReducers({
    user,
    userList,
    chat
})
