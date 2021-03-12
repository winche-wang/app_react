/**
 * 底部导航组件
 */

import React from 'react'
import PropTypes from 'prop-types'
import { TabBar } from 'antd-mobile'
import { withRouter } from 'react-router-dom'

const Item = TabBar.Item

class NavFooter extends React.Component {

    static propTypes = {
        navList: PropTypes.array.isRequired,
        unReadCount: PropTypes.number.isRequired
    }

    render() {

        const { pathname } = this.props.location
        const navList = this.props.navList.filter(nav => !nav.hide)

        return (
            <TabBar>
                {
                    navList.map((nav, index) => (
                        <Item
                            key={nav.path}
                            title={nav.text}
                            badge={nav.path === '/message' ? this.props.unReadCount : 0}
                            icon={{ uri: require(`../../assets/imgs/${nav.icon}.png`) }}
                            selectedIcon={{ uri: require(`../../assets/imgs/${nav.icon}-selected.png`) }}
                            selected={pathname === nav.path}
                            onPress={() => {
                                this.props.history.replace(nav.path)
                            }}
                        />
                    ))
                }
            </TabBar>
        )
    }
}

/**
 * 让非路由组件可以访问到路由组件的API
 */
export default withRouter(NavFooter)