/**
 * 登录的路由组件
 */
import React, { Component } from 'react'
import { NavBar, WingBlank, List, InputItem, WhiteSpace, Button } from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import {login} from '../../redux/actions'
import Logo from '../../components/logo/logo'

class Login extends Component {

    /**
     * 用户名
     * 密码
     */
    state = {
        username: '',
        password: '',
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
     * 登录按钮--执行登录操作
     */
    login = () => {
        this.props.login(this.state)
        console.log(this.state)
    }

    /**
     * 还有没有用户按钮--跳转注册路由
     */
    toRegister = () => {
        this.props.history.replace('/register')
    }

    render() {
        const {redirectTo, msg} = this.props

        if(redirectTo){
            return <Redirect to={redirectTo}/>
        }

        return (
            <div>
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
                        <Button type='primary' onClick={this.login}>登录</Button>
                        <Button onClick={this.toRegister}>还没有用户</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}

export default connect(
    state => state.user,
    {login}
)(Login)
