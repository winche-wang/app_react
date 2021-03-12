/**
 * 聊天的路由组件
 */

import React, { Component } from 'react'
import { NavBar, List, InputItem, Icon, Grid } from 'antd-mobile'
import { connect } from 'react-redux'
import { sendMsg, readMsg } from '../../redux/actions'
import QueueAnim from 'rc-queue-anim'

const Item = List.Item

class Chat extends Component {
    /**
     * content---输入的聊天内容
     * isShow---是否显示表情列表
     */
    state = {
        content: '',
        isShow: false
    }
    /**
     * 在第一次render()之前回调
     */
    componentWillMount() {
        this.emojis = [
            '😀', '😁', '🤣', '😀', '😁', '🤣', '😀', '😁', '🤣', '😀', '😁',
            '🤣', '😀', '😁', '🤣', '😀', '😁', '🤣', '😀', '😁', '🤣', '😀',
            '😁', '🤣', '😁', '🤣', '😀', '😁', '🤣', '😀', '😁', '🤣', '😀',
            '😁', '🤣', '😁', '🤣', '😀', '😁', '🤣', '😀', '😁', '🤣', '😀', '😁', '🤣'
        ]
        this.emojis = this.emojis.map(value => ({ text: value }))
    }

    /**
     * 初始显示列表 
     */
    componentDidMount() {
        window.scrollTo(0, document.body.scrollHeight)
        const from = this.props.match.params.userid
        const to = this.props.user._id
        this.props.readMsg(from, to)
    }

    /**
     * 更新显示列表 
     */
    componentDidUpdate() {
        window.scrollTo(0, document.body.scrollHeight)
    }

    /**
     * 在退出之前
     * 更新未读数量
     */
    componentWillUnmount() {
        const from = this.props.match.params.userid
        const to = this.props.user._id
        this.props.readMsg(from, to)
    }

    /**
     * 切换表情列表的显示
     */
    toggleShow = () => {
        const isShow = !this.state.isShow
        this.setState({ isShow })

        if (isShow) {
            // 异步手动派发resize事件,解决表情列表显示的bug
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'))
            }, 0)
        }
    }

    submit = () => {
        const content = this.state.content.trim()
        const to = this.props.match.params.userid
        const from = this.props.user._id

        //发送请求（发消息）
        if (content) {
            this.props.sendMsg({ from, to, content })
        }
        this.setState({
            content: '',
            isShow: false
        })
    }

    render() {

        const { user } = this.props
        const { chatMsgs, users } = this.props.chat
        const targetId = this.props.match.params.userid

        if (!users[targetId]) {
            return null
        }

        //计算当前聊天的chatId
        const meId = user._id

        if (!users[meId]) {
            return null
        }

        const chatId = [targetId, meId].sort().join('_')
        // 对chatMsgs进行过滤
        const msgs = chatMsgs.filter(msg => msg.chat_id === chatId)
        // 得到目标用户的header图片对象
        const targetHeader = users[targetId].header
        const myHeader = user.header
        const targetIcon = targetHeader ? require(`../../assets/imgs/${targetHeader}.png`) : null
        const myIcon = myHeader ? require(`../../assets/imgs/${myHeader}.png`) : null

        return (
            <div id='chat-page'>
                <NavBar
                    className='stick-top'
                    icon={<Icon type='left' />}
                    onLeftClick={() => this.props.history.goBack()}
                >
                    {users[targetId].username}
                </NavBar>
                <List style={{ marginBottom: 50, marginTop: 50 }}>
                    <QueueAnim type='scale' delay={100}>
                        {
                            msgs.map(msg => {
                                //对方发给我的
                                if (msg.from === targetId) {
                                    return (
                                        <Item
                                            key={msg._id}
                                            thumb={targetIcon}
                                        >
                                            {msg.content}
                                        </Item>
                                    )
                                } else {
                                    //我发给对方的
                                    return (
                                        <Item
                                            key={msg._id}
                                            thumb={myIcon}
                                            className='chat-me'
                                        >
                                            {msg.content}
                                        </Item>
                                    )
                                }
                            })
                        }
                    </QueueAnim>
                </List>
                <div className='am-tab-bar'>
                    <InputItem
                        placeholder="请输入"
                        className='chat-input'
                        value={this.state.content}
                        onChange={val => this.setState({ content: val })}
                        onFocus={() => this.setState({ isShow: false })}
                        extra={
                            <span>
                                <span onClick={this.toggleShow} style={{ marginRight: 10 }}>😊</span>
                                <span onClick={this.submit}>发送</span>
                            </span>
                        } />
                    {
                        this.state.isShow ? (
                            <Grid
                                data={this.emojis}
                                columnNum={8}
                                carouselMaxRow={4}
                                isCarousel={true}
                                onClick={(item) => {
                                    this.setState({ content: this.state.content + item.text })
                                }} />
                        ) : null
                    }
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        user: state.user,
        chat: state.chat
    }),
    { sendMsg, readMsg }
)(Chat)