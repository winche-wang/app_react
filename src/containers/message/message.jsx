/**
 * 消息列表组件
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List, Badge } from 'antd-mobile'

const Item = List.Item
const Brief = Item.Brief

/*
    对chatMsgs按chat_id进行分组, 并得到每个组的lastMsg组成的数组
    1. 找出每个聊天的lastMsg, 并用一个对象容器来保存 {chat_id, lastMsg}
    2. 得到所有lastMsg的数组
    3. 对数组进行排序(按create_time降序)
 */
function getLastMsgs(chatMsgs, userid) {

    // 1. 找出每个聊天的lastMsg, 并用一个对象容器来保存 {chat_id:lastMsg}
    const lastMsgObjs = {}

    chatMsgs.forEach(msg => {
        // 对msg进行个体的统计        
        if (msg.to === userid && !msg.read) {
            msg.unReadCount = 1
        } else {
            msg.unReadCount = 0
        }

        // 得到msg的聊天标识id    
        const chatId = msg.chat_id
        // 获取已保存的当前组件的lastMsgs
        const lastMsg = lastMsgObjs[chatId]

        if (!lastMsg) {

            lastMsgObjs[chatId] = msg

        } else {
            // 累加unReadCount=已经统计的 + 当前msg的
            const unReadCount = lastMsg.unReadCount + msg.unReadCount

            // 如果msg比lastMsg晚, 就将msg保存为lastMsg
            if (msg.create_time > lastMsg.create_time) {
                lastMsgObjs[chatId] = msg
            }

            //将unReadCount保存在最新的lastMsg上
            lastMsgObjs[chatId].unReadCount = unReadCount
        }
    })

    // 2. 得到所有lastMsg的数组
    const lastMsgs = Object.values(lastMsgObjs)

    // 3. 对数组进行排序(按create_time降序)
    lastMsgs.sort(function (msg1, msg2) {
        return msg2.create_time - msg1.create_time
    })

    return lastMsgs
}

class Message extends Component {
    render() {

        const { user, chat } = this.props
        const meId = user._id
        const { users, chatMsgs } = chat
        const lastMsgs = getLastMsgs(chatMsgs, meId)

        return (
            <List style={{ marginTop: 50, marginBottom: 60 }}>
                {
                    lastMsgs.map(msg => {
                        // 得到目标用户的id
                        const targetId = msg.from === meId ? msg.to : msg.from
                        // 得到目标用户的信息
                        const targetUser = users[targetId]
                        const headerImg = targetUser.header ?
                            require(`../../assets/imgs/${targetUser.header}.png`) : null
                        return (
                            <Item
                                key={msg._id}
                                extra={<Badge text={msg.unReadCount} />}
                                thumb={headerImg}
                                arrow='horizontal'
                                onClick={() => this.props.history.push(`/chat/${targetId}`)}
                            >
                                {msg.content}
                                <Brief>{targetUser.username}</Brief>
                            </Item>
                        )
                    })
                }
            </List>
        )
    }
}

export default connect(
    state => ({
        user: state.user,
        chat: state.chat
    })
)(Message)