//  React and its typechecking
import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import _ from 'lodash'
//  Redux utils
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'
//  Our API services
import api from '../../services'

import { Link } from 'react-router'
import { Spin, Table, Progress, Badge, Input, Icon } from 'antd'

//  Status indicator mapping for badge components
const indicators = {
  'In Review': 'default',
  'Fully Funded': 'success',
  'Partially Funded': 'success',
  'Revisions Requested': 'warning',
  Denied: 'error'
}
const currency = number =>
  number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  })

//  Import modular CSS. Needs to run through JS because styles are hashed.
import styles from './Proposals.css'
//  This is a decorator, a function that wraps another class (which in JS is essentially a func)
@compose(
  connect((state, props) => ({
    proposals: state.db.proposals,
    enums: state.db.config && state.db.config.enums,
    screen: state.screen,
    user: state.user
  })),
  connectRequest(
    () => api.get('proposals', {
      where: { published: true },
      join: [ 'contacts' ]
    })
  )
)
class // Compose is a redux utility that runs an array of functions:
//  Connect component to cached DB entities
//  Execute necessary AJAX to load said entities
// where: { published: true }
// connectRequest((props) => api.getAll('proposals'))
Proposals extends React.Component {
  static propTypes = {
    proposals: PropTypes.array,
    screen: PropTypes.object,
    user: PropTypes.object
  }
  constructor (props) {
    super(props)
    const { proposals } = this.props
    this.state = {
      proposals,
      myProposals: [],
      filterDropdownVisible: false,
      searchText: '',
      filtered: false
    }
  }
  componentWillReceiveProps (nextProps) {
    const { proposals, user } = nextProps
    if (proposals && user.netID) {
      //  Filter out proposals containing the netID in contacts.
      const myProposals = proposals.filter(proposal => {
        for (const contact of proposal.contacts) {
          return contact.netID === user.netID
        }
      })
      this.setState({ proposals, myProposals })
    }
  }

  onInputChange = searchText => this.setState({ searchText })
  onSearch = () => {
    const { searchText } = this.state
    const { proposals } = this.props
    const reg = new RegExp(searchText, 'gi')
    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
      proposals: proposals
        .map(record => {
          const match = record.title.match(reg)
          if (!match) return null
          return {
            ...record,
            title: (
              <span>
                {record.title
                  .split(reg).map((text, i) => i > 0
                      ? [(<span className='highlight'>{match[0]}</span>), text]
                      : text
                  )}
              </span>
            )
          }
        })
        .filter(record => !!record)
    })
  }
  //  Shorthand assignment of variables when defining render
  render (
    { enums, screen } = this.props,
    //  Proposals go through state since we filter
    { proposals, myProposals } = this.state
  ) {
    //  Create an array of years for select boxes
    const years = _.range(
      2000,
      new Date().getFullYear() + 1
    )
    //  Columns are defined in render because they have many data dependencies.
    const columns = [
      {
        title: 'ID',
        dataIndex: 'number',
        key: 'number',
        render: (text, record) => (
          <span>{`${record.year}-${record.number}`}</span>
        ),
        sorter: (a, b) =>
          a.year * a.number - b.year * b.number,
        filters: years.map((year, i) => {
          return { text: year, value: year }
        }),
        onFilter: (value, record) =>
          record.year.toString().includes(value),
        width: 90
      },
      {
        title: 'Q',
        dataIndex: 'quarter',
        key: 'quarter',
        render: text => (
          <span>{text.substr(0, 2) || ''}</span>
        ),
        filters: [
          { text: 'Autumn', value: 'Autumn' },
          { text: 'Fall', value: 'Fall' },
          { text: 'Spring', value: 'Spring' },
          { text: 'Summer', value: 'Summer' }
        ],
        onFilter: (value, record) =>
          record.quarter.includes(value),
        width: 50
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => (
          <Link to={`/proposals/${record.year}/${record.number}`}>
            {record.title}
          </Link>
        ),
        filterDropdown: (
          <Input
            ref={ele => this.searchInput = ele}
            placeholder='Search title'
            value={this.state.searchText}
            onChange={(e) => this.onInputChange(e.target.value)}
            onPressEnter={this.onSearch}
          />
        ),
        filterIcon: <Icon type='search' style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible: this.state.filterDropdownVisible,
        onFilterDropdownVisibleChange: visible => {
          this.setState(
            { filterDropdownVisible: visible },
            () => this.searchInput.focus()
          )
        }
      },
      {
        title: 'Organization',
        dataIndex: 'organization',
        key: 'organization'
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        filters: enums
          ? enums.categories.map(category => {
            return { text: category, value: category }
          })
          : [],
        onFilter: (value, record) =>
          record.category === value,
        width: 150
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: text => <Badge status={indicators[text] || 'default'} text={<b>{text}</b>} />,
        filters: enums
          ? enums.statuses.map(status => {
            return { text: status, value: status }
          })
          : [],
        onFilter: (value, record) => record.status === value
      },
      {
        title: 'Asked',
        dataIndex: 'asked',
        key: 'asked',
        render: text => <span>{text ? currency(text) : '0'}</span>,
        sorter: (a, b) => a.asked - b.asked
      },
      {
        title: 'Received',
        dataIndex: 'received',
        key: 'received',
        render: (text, record) =>
          record.received
            ? <Progress type='circle' width={70}
              percent={parseInt(record.asked / record.received * 100)} />
            : <span />,
        sorter: (a, b) =>
          a.asked / a.received * 100 -
            b.asked / b.received * 100,
        width: 100
      }
    ]
    const footer = () => (
      <div>
        <em>
          Any campus department or org can submit a proposal with a budget code. <Link to='/create'>
          Click Here!
        </Link>
        </em>
        {myProposals.length > 0 &&
          <div>
            <h6>My Proposals</h6>
            <ul>
              {myProposals.map((p, i) => (
                <li key={p._id}>
                  <Badge status={indicators[p.status] || 'default'}
                    text={
                      <Link to={`/proposals/${p.year}/${p.number}`}>
                        {`${p.year}-${p.number}: ${p.title}`}
                      </Link>
                      }
                  />
                </li>
                ))}
            </ul>
          </div>
        }
      </div>
    )
    return (
      <article className={styles['article']}>
        <h1>STF Proposals</h1>
        <Helmet title='Proposals' />
        {!proposals
            ? <Spin size='large' tip='Loading...' />
            : <Table
              dataSource={proposals}
              sort
              size={screen.lessThan.medium ? 'small' : ''}
              columns={
                screen.lessThan.medium
                ? columns.slice(0, 3)
                : columns
              }
              footer={footer}
            />
            }
      </article>
    )
  }
}
export default Proposals
