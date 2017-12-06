import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Link } from 'react-router'

import Helmet from 'react-helmet'
import favicon from '../../images/favicon.ico'
const meta = [
  { charset: 'utf-8' },
  // Meta descriptions are commonly used on search engine result pages to
  // display preview snippets for a given page.
  { name: 'Student Tech Fee - UW', content: 'Driving change and enriching learning environments one project, one proposal at a time.' },
  // Setting IE=edge tells Internet Explorer to use the latest engine to
  //  render the page and execute Javascript
  { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
  // Using the viewport tag allows you to control the width and scaling of
  // the browser's viewport:
  // - include width=device-width to match the screen's width in
  // device-independent pixels
  // - include initial-scale=1 to establish 1:1 relationship between css pixels
  // and device-independent pixels
  // - ensure your page is accessible by not disabling user scaling.
  { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  // Disable tap highlight on IE
  { name: 'msapplication-tap-highlight', content: 'no' },
  // Add to homescreen for Chrome on Android
  { name: 'mobile-web-app-capable', content: 'yes' },
  // Add to homescreen for Safari on IOS
  { name: 'apple-mobile-web-app-capable', content: 'yes' },
  { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
  { name: 'apple-mobile-web-app-title', content: 'UW STF' }
]
// Add to homescreen for Chrome on Android
const link = [{ rel: 'icon', href: favicon }]

import enUS from 'antd/lib/locale-provider/en_US'
import { LocaleProvider, Spin, Layout, Icon, Menu } from 'antd'
const { Header } = Layout
const SubMenu = Menu.SubMenu
const Item = Menu.Item
const ItemGroup = Menu.ItemGroup

import Drawer from 'rc-drawer'

import Login from './Login/Login'

import '../../css/main'
import styles from './Template.css'

import mobileLogo from '../../images/mobileLogo.png'
import desktopLogo from '../../images/desktopLogo.png'

import WordmarkWhite from '../../images/WordmarkWhite.png'

const RFP = 'https://docs.google.com/document/d/1X-M1HqTMYEDe6BrL7JUMqWWr4k9kpx0Hp8x_SrpS1O8/edit?usp=sharing'
const drive = 'https://drive.google.com/drive/folders/0BwVcM9nLxRsqbVNqV2lwa3lRZzA?usp=sharing'
const keyserver = 'http://itconnect.uw.edu/wares/acquiring-software-and-hardware/keyserver-help-for-it-staff/'

@connect(state => ({
  screen: state.screen,
  //  Nextlocation is the route of new pages router is transitioning to.
  nextLocation: state.routing.locationBeforeTransitions
    ? state.routing.locationBeforeTransitions.pathname
    : '1',
  stf: (state.user && state.user.stf) || {},
  year: state.config.year
}))
class Template extends React.Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    screen: PropTypes.object,
    router: PropTypes.object,
    nextLocation: PropTypes.string
  }
  constructor (props) {
    super(props)
    this.state = { open: false }
  }
  //  Toggle menu view
  handleToggle = () => this.setState({ open: !this.state.open })
  //  Changed pages? Close the nav
  componentWillReceiveProps (nextProps) {
    if (this.state.open) {
      if (this.props.nextLocation !== nextProps.nextLocation) {
        this.setState({ open: false })
      }
    }
  }
  render (
    { children, screen, nextLocation, router, stf, year } = this.props,
    { open } = this.state
  ) {
    // React-router is separated from redux store - too heavy to persist.
    return (
      <LocaleProvider locale={enUS}>
        <div>
          <Helmet
            titleTemplate='%s - UW Student Tech'
            meta={meta} link={link}
          />
          <Header>
            {screen.lessThan.large
              ? <Icon
                style={{fontSize: 32, lineHeight: 'inherit', color: 'white', marginRight: 16}}
                type={this.state.open ? 'menu-unfold' : 'menu-fold'}
                onClick={this.handleToggle}
              />
              : <a href='http://www.washington.edu/'>
                <img src={WordmarkWhite} className={styles['uw-logo']} />
              </a>
            }
            <Link to='/'>
              <img src={screen.lessThan.medium ? mobileLogo : desktopLogo} className={styles['stf-logo']} />
            </Link>
            <Login />
          </Header>
          <Drawer
            position={screen.greaterThan.medium ? 'top' : 'left'}
            docked={screen.greaterThan.medium}
            open={!screen.greaterThan.medium && open}
            transitions
            touch
            onOpenChange={this.handleToggle}
            enableDragHandle={false}
            dragToggleDistance={30}
            sidebarStyle={screen.lessThan.large
              ? { overflowY: 'auto', overflowX: 'hidden' } : {}
            }
            sidebar={
              <Menu
                theme='dark'
                mode={screen.lessThan.large ? 'inline' : 'horizontal'}
                selectedKeys={[nextLocation]}
                // onClick={this.handleNavigate}
                onClick={({ key }) => key.startsWith('/') && router.push(key)}
              >
                <Item key='/proposals'>
                  <Icon type='solution' /><span className='nav-text'>Proposals</span>
                </Item>
                <Item key='/blocks'>
                  <Icon type='desktop' /><span className='nav-text'>Block Funding</span>
                </Item>
                <Item key='/members'>
                  <Icon type='team' /><span className='nav-text'>Members</span>
                </Item>
                <Item key='/faq'>
                  <Icon type='question' /><span className='nav-text'>F.A.Q.</span>
                </Item>
                <Item key='/contact'>
                  <Icon type='info' /><span className='nav-text'>Contact Us</span>
                </Item>
                <SubMenu key='sub2' title={<span><Icon type='folder-open' /><span>Documents</span></span>}>
                  <Item key='rfp'>
                    <a href={RFP} target='_blank'>Request For Proposals</a>
                  </Item>
                  <Item key='drive'>
                    <a href={drive} target='_blank'>Committee Docs</a>
                  </Item>
                  <Item key='keyserver'>
                    <a href={keyserver} target='_blank'>License Keyserver</a>
                  </Item>
                </SubMenu>
                {Object.keys(stf).length > 0 && // if associated in any way with STF
                  <SubMenu key='sub1' title={<span><Icon type='safety' /><span>Committee</span></span>}>
                    <Item key='/dashboard'>
                      <Icon type='area-chart' /><span className='nav-text'>Dashboard</span>
                    </Item>
                    <Item key='/voting'>
                      <Icon type='check-circle-o' /><span className='nav-text'>Voting</span>
                    </Item>
                    {stf.admin &&
                      <ItemGroup key='g1' title='Admin Tools'>
                        <Item key={`/docket/${year}`}>
                          <Icon type='schedule' /><span className='nav-text'>Docket</span>
                        </Item>
                        <Item key='/config'>
                          <Icon type='tool' /><span className='nav-text'>Site Config</span>
                        </Item>
                      </ItemGroup>
                    }
                  </SubMenu>
                }
              </Menu>
            }
           >
            <div className={styles['body']}>
              {children || <Spin size='large' tip='Loading Page...' />}
            </div>
          </Drawer>
        </div>
      </LocaleProvider>
    )
  }
}

export default Template
