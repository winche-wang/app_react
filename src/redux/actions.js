/**
 * 包含多个action creator
 * 异步action
 * 同步action
 */

import {reqRegister, reqLogin, reqUpdateUser, reqUser, reqUserList, reqChatMsgList, reqReadChatMsg } from '../api'
import { AUTH_SUCCESS, ERROR_MSG, RECEIVE_USER, RESET_USER, RECEIVE_USER_LIST, RECEIVE_MSG_LIST, RECEIVE_MSG, MSG_READ } from './action-type';

import io from 'socket.io-client'

/**
 * 认证成功的同步action
 * @param {*} user 
 */
const authSuccess = (user) => ({
    type: AUTH_SUCCESS,
    data:user
})
/**
 * 认证失败的同步action
 * @param {*} msg 
 */
const errorMsg = (msg) => ({
    type: ERROR_MSG,
    data:msg
})
/**
 * 获取用户信息的同步action
 * @param {*} user 
 */
const receiveUser = (user)=>({
    type: RECEIVE_USER,
    data: user
})
/**
 * 接收用户列表的同步action
 * @param {*} users 
 */
const receiveUserList = (users) => ({
    type: RECEIVE_USER_LIST,
    data: users
})
/**
 * 重置用户信息的同步action
 * @param {*} msg 
 */
export const resetUser = (msg)=>({
    type: RESET_USER,
    data: msg
})
/**
 * 接收消息列表的同步action
 * @param {*} param0 
 */
const receiveMsgList = ({ users, chatMsgs, userid }) => ({
    type: RECEIVE_MSG_LIST,
    data: { users, chatMsgs, userid }
})
/**
 * 接收消息的同步action
 * @param {*} chatMsg 
 * @param {*} isToMe 
 */
const receiveMsg = (chatMsg, isToMe) => ({
    type: RECEIVE_MSG,
    data: { chatMsg, isToMe }
})
/**
 * 读取了消息的同步action
 * @param {*} param0 
 */
const msgRead = ({from, to, count}) => ({
    type: MSG_READ,
    data: {from, to, count}
})

/**
 * 注册
 * @param {*} param0 
 */
export const register = ({username, password, password2, usertype}) => {
    /**
     * 同步action
     */
    if (!username || !password || !usertype) {
        return errorMsg('用户名密码必须输入')
    }

    if (password !== password2) {
        return errorMsg('密码和确认密码不同')
    }

    /**
     * 异步action，注册的异步ajax请求
     */
    return async dispatch => {
        const response = await reqRegister({username, password, usertype})
        const result = response.data
        
        if (result.code === 1) {
            getMsgList(dispatch, result.data._id)
            dispatch(authSuccess(result.data))
        } else {
            dispatch(errorMsg(result.msg))
        }
     }
}

/**
 * 登录
 * @param {*} param0 
 */
export const login = ({ username, password }) => {
    if (!username || !password) {
        return errorMsg('用户名密码必须输入')
    }

    return async dispatch => {
        const response = await reqLogin({username,password})
        const result = response.data

        if (result.code === 1) {
            getMsgList(dispatch, result.data._id)
            dispatch(authSuccess(result.data))
        } else {
            dispatch(errorMsg(result.msg))
        }
     }
}

/**
 * 更新用户信息
 */
export const updateUser = (user)=>{
    return async dispatch=>{
        const response = await reqUpdateUser(user)
        const result = response.data

        if(result.code === 1){
            dispatch(receiveUser(result.data))
        }else{
            dispatch(resetUser(result.msg))
        }
    }
}


/**
 * 获取用户信息
 */
export const getUser = () => {
    return async dispatch => {
        const response = await reqUser();
        const result = response.data
        
        if (result.code === 1) {
            getMsgList(dispatch, result.data._id)
            dispatch(receiveUser(result.data))
        } else {
            dispatch(resetUser(result.msg))
        }
    }
}

/**
 * 获取用户列表信息
 */
export const getUserList = ( usertype ) => {
    return async dispatch => {
        const response = await reqUserList(usertype);
        const result = response.data
        
        if (result.code === 1) {
            dispatch(receiveUserList(result.data))
        } else {
            
        }
    }
}

/**
 * 初始化客户端socketio
 *  1 连接服务器
 *  2 绑定用于接收服务器返回chatMsg的监听
 */
function initIO(dispatch, userid) {

    if (!io.socket) { 
        io.socket = io('ws://172.20.10.5:4000')
        //io.socket = io('ws://localhost:4000')
        
        io.socket.on('receiveMsg', (chatMsg) => {
            
            if (chatMsg.from === userid || chatMsg.to === userid) {
                dispatch(receiveMsg(chatMsg, chatMsg.to === userid))
            }
        })
    }
}

/**
 * 获取当前用户相关的所有聊天消息列表
 */
async function getMsgList(dispatch, userid) {
    
    initIO(dispatch, userid)

    const response = await reqChatMsgList()
    const result = response.data
    
    if (result.code === 1) {
        const { chatMsgs, users } = result.data
        
        dispatch(receiveMsgList({ chatMsgs, users, userid }))    
    }

}


/**
 * 发送消息的异步action
 */
export const sendMsg = ({ from, to, content }) => {
    return async dispatch => {
       
        io.socket.emit('sendMsg', { from, to, content })        
    }
}

/**
 * 更新获取消息的异步aciton
 */
export const readMsg = (from,to) => {
    return async dispatch => {
        const response = await reqReadChatMsg(from)
        const result = response.data

        if (result.code === 1) {
            const count = result.data

            dispatch(msgRead({ from, to, count }))        
        }
    }
}