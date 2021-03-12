/**
 * 主界面的路由组件
 */
import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Cookies from 'js-cookie'
import { connect } from 'react-redux'
import { NavBar } from 'antd-mobile'

import LaobanInfo from '../laoban-info/laoban-info'
import QiuzhizheInfo from '../qiuzhizhe-info/qiuzhizhe-info'
import Laoban from '../laoban/laoban'
import Qiuzhizhe from '../qiuzhizhe/qiuzhizhe'
import Message from '../message/message'
import Personal from '../personal/personal'
import NotFound from '../../components/not-found/not-found'
import NavFooter from '../../components/nav-footer/nav-footer'
import Chat from '../chat/chat'

import { getUser } from '../../redux/actions'
import { getRedirectPath } from '../../utils'

class Main extends Component {

    navList = [
        {
            path: '/laoban',
            component: Laoban,
            title: '求职者列表',
            icon: 'qiuzhizhe',
            text: '求职者'
        },
        {
            path: '/qiuzhizhe',
            component: Qiuzhizhe,
            title: '老板列表',
            icon: 'laoban',
            text: '老板'
        },
        {
            path: '/message',
            component: Message,
            title: '消息列表',
            icon: 'message',
            text: '消息'
        },
        {
            path: '/personal',
            component: Personal,
            title: '用户中心',
            icon: 'personal',
            text: '个人'
        }
    ]

    componentDidMount() {
        const userid = Cookies.get('userid')
        const { user } = this.props
        /**
         * 实现自动登录
         * 如果浏览器存在cookie.userid且redux中的user没有_id
         * 使用cookie中的userid查询数据库中的信息
         * 如果存在则将user添加在state中
         */
        if (userid && !user._id) {

            this.props.getUser()
        }

    }

    render() {
        const userid = Cookies.get('userid')
        const pathname = this.props.location.pathname

        if (!userid) {
            return <Redirect to='/login' />
        }

        const { user, unReadCount } = this.props

        if (!user._id) {
            return null
        } else {
            /**
             * 请求根路径时, 自动跳转到对应的用户主界面
             */
            if (pathname === '/') {
                const path = getRedirectPath(user.usertype, user.header)
                return <Redirect to={path} />
            }
        }

        if (user.usertype === 'laoban') {
            this.navList[1].hide = true
        } else {
            this.navList[0].hide = true
        }
        /**
         * 得到当前的nav
         */
        const currentNav = this.navList.find(nav => nav.path === pathname)
        const { navList } = this

        return (
            <div>
                {currentNav ? <NavBar className='stick-top'>{currentNav.title}</NavBar> : null}
                <Switch>
                    {
                        navList.map(nav =>
                            <Route
                                key={nav.path}
                                path={nav.path}
                                component={nav.component}
                            />
                        )
                    }

                    <Route path='/laobaninfo' component={LaobanInfo} />
                    <Route path='/qiuzhizheinfo' component={QiuzhizheInfo} />
                    <Route path='/chat/:userid' component={Chat} />

                    <Route component={NotFound}></Route>
                </Switch>
                {currentNav ? <NavFooter unReadCount={unReadCount} navList={this.navList} /> : null}
            </div>
        )
    }
}

export default connect(
    state => ({
        user: state.user,
        unReadCount: state.chat.unReadCount
    }),
    { getUser }
)(Main)