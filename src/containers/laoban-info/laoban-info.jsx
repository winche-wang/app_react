/**
 * 老板信息完善组件
 */

import React, { Component } from 'react'
import { NavBar, InputItem, TextareaItem, Button } from 'antd-mobile'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import HeaderSelector from '../../components/header-selector/header-selector'
import { updateUser } from '../../redux/actions'

class LaobanInfo extends Component {

    /**
     * 头像
     * 职位介绍
     * 职位名称
     * 公司名称
     * 工资
     */
    state = {
        header: '',
        info: '',
        post: '',
        company: '',
        salary: ''
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
         * 如果用户信息已完善，自动跳转到laoban主界面
         */
        if (user.header) {
            return <Redirect to='/laoban' />
        }

        return (
            <div>
                <NavBar>老板信息完善</NavBar>
                <HeaderSelector setHeader={this.setHeader} />
                <InputItem onChange={val => this.handleChange('post', val)} placeholder="请输入招聘职位">招聘职位：</InputItem>
                <InputItem onChange={val => this.handleChange('company', val)} placeholder="请输入公司名称">公司名称：</InputItem>
                <InputItem onChange={val => this.handleChange('salary', val)} placeholder="请输入职位薪资">职位薪资：</InputItem>
                <TextareaItem title='职位要求：'
                    placeholder="请输入职位要求"
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
)(LaobanInfo)