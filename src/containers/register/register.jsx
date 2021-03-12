/**
 * 注册路由组件
 */
import React, { Component } from 'react'
import { NavBar, WingBlank, List, InputItem, WhiteSpace, Radio, Button } from 'antd-mobile'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { register } from '../../redux/actions'
import Logo from '../../components/logo/logo'

const ListItem = List.Item

class Register extends Component {

    /**
     * 用户名
     * 密码
     * 确认密码
     * 用户类型
     */
    state = {
        username: '',
        password: '',
        password2: '',
        usertype: 'qiuzhizhe',
    }

    /**
     * 处理输入数据的改变，更新对应的状态
     * 更新数据状态
     */
    handleChange = (name, val) => {
        this.setState({
            [name]: val
        })
    }

    /**
     * 注册按钮--执行注册操作
     */
    register = () => {
        this.props.register(this.state)
    }

    /**
     * 已有用户按钮--跳转到登录页
     */
    toLogin = () => {
        this.props.history.replace('/login')
    }

    render() {
        const { usertype } = this.state
        const {redirectTo, msg} = this.props

        if(redirectTo){
            return <Redirect to={redirectTo}/>
        }
        
        return (
            < div >
                <NavBar>直&nbsp;聘</NavBar>
                <Logo />
                <WingBlank>
                    {msg ? <p className='error-msg'>{msg}</p> : null}
                    <List>
                        <WhiteSpace></WhiteSpace>
                        <InputItem
                            placeholder='请输入用户名'
                            onChange={val => { this.handleChange('username', val) }}>用户名：</InputItem>
                        <WhiteSpace></WhiteSpace>
                        <InputItem
                            placeholder='请输入密码'
                            type="password"
                            onChange={val => { this.handleChange('password', val) }}>密码：</InputItem>
                        <WhiteSpace></WhiteSpace>
                        <InputItem
                            placeholder='请输入确认密码'
                            type="password"
                            onChange={val => { this.handleChange('password2', val) }}>确认密码：</InputItem>
                        <WhiteSpace></WhiteSpace>
                        <ListItem>
                            <span style={{ marginRight: 30 }}>用户类型：</span>
                            <Radio
                                checked={usertype === 'qiuzhizhe'}
                                onChange={() => { this.handleChange('usertype', 'qiuzhizhe') }}>求职者</Radio>
                            <Radio
                                checked={usertype === 'laoban'}
                                onChange={() => { this.handleChange('usertype', 'laoban') }}>老板</Radio>
                        </ListItem>
                        <WhiteSpace></WhiteSpace>
                        <Button type='primary' onClick={this.register}>注册</Button>
                        <Button onClick={this.toLogin}>已有用户</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}

export default connect(
    state => state.user,
    { register }
)(Register)