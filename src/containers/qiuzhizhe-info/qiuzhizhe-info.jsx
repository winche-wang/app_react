/**
 * 求职者完善信息组件
 */

import React, { Component } from 'react'
import { NavBar, InputItem, TextareaItem, Button } from 'antd-mobile'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import HeaderSelector from '../../components/header-selector/header-selector'
import { updateUser } from '../../redux/actions'


class QiuzhizheInfo extends Component {
    /**
     * 头像
     * 个人简介
     * 求职岗位
     */
    state = {
        header: '',
        info: '',
        post: ''
    }

    setHeader = (header) => {
        this.setState({ header })
    }

    handleChange = (name, val) => {
        this.setState({
            [name]: val
        })
    }

    render() {
        const { user } = this.props
        /**
         * 如果用户信息已完善，自动跳转到qiuzhizhe主界面
         */
        if (user.header) {
            return <Redirect to='/qiuzhizhe' />
        }

        return (
            <div>
                <NavBar>求职者信息完善</NavBar>
                <HeaderSelector setHeader={this.setHeader} />
                <InputItem onChange={val => this.handleChange('post', val)} placeholder="请输入求职岗位">求职岗位：</InputItem>
                <TextareaItem title='个人简介：'
                    placeholder="请输入个人简介"
                    rows={3}
                    onChange={val => this.handleChange('info', val)} />
                <Button type='primary' onClick={() => this.props.updateUser(this.state)}>保存</Button>
            </div>
        )
    }
}

export default connect(
    state => ({ user: state.user }),
    { updateUser }
)(QiuzhizheInfo)