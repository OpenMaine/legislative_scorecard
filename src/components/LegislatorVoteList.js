import React from 'react'
import Select from './Select'
import { Link } from 'react-router-dom'
import { billsById } from '../data/'
import { billPath } from '../services/bill-helpers'
import map from 'lodash/map'
import pickBy from 'lodash/pickBy'
import isEmpty from 'lodash/isEmpty'
import memoize from 'lodash/memoize'


const filterOptions = [
  { value: '2018Bills', label: '2018 bills' },
  { value: 'voterBills', label: 'Will of the Voters bills' },
]


export default class LegislatorVoteList extends React.PureComponent {

  state = {
    filter: '2018Bills',
  }

  getCachedVotes = memoize(function(filter) {
    const votes = {...this.props.legislator.votes};

    if (filter === '2018Bills') {
      return pickBy(votes, (stance, billId) => {
        return billsById[billId].is_2018_bill
      })
    }
    else {
      return pickBy(votes, (stance, billId) => {
        return !isEmpty(billsById[billId].voter_stance)
      })
    }
  })

  getVotes() {
    const { filter } = this.state;
    const votes = this.getCachedVotes(filter);
    return votes;
  }

  handeFilterChange = (e) => {
    this.setState({ filter: e.target.value })
  }

  render() {
    const { filter } = this.state
    const { legislator } = this.props
    const votes = this.getVotes()

    const renderedVotes = map(votes, function(stance, billId) {
      const bill = billsById[billId]
      const key  = legislator.ocdId + billId
      return (
        <Vote
          key={key}
          bill={bill}
          legislator={legislator}
          legislator_stance={stance}
          />
      );
    })

    return (
      <div>
        <section className="voting-history container">
          <div className="row">
            <div className="col-xs-12 col-sm"><div className="box">
              <h1>Voting history</h1>
            </div></div>
            <div className="col-xs-6 col-sm-4 col-md-3"><div className="box">
              <Select options={filterOptions} value={filter} onChange={this.handeFilterChange} className="full-width" />
            </div></div>
          </div>
        </section>
        <section className="container card-container">
          <div className="card list">
            {renderedVotes}
          </div>
        </section>
      </div>
    )
  }
}


function Vote(props) {
  const { bill, legislator, legislator_stance } = props

  const {
    shorthand_title,
    short_description,
    mpa_stance,
  } = bill

  const billId = bill.id.replace(/\s/g, '\u00A0')

  const lastName = legislator.name.lastName

  let stanceClassName
  if (legislator_stance.match((/Excused|n\/a/i)))
    stanceClassName = 'neutral'
  else if (legislator_stance === mpa_stance)
    stanceClassName = 'good'
  else
    stanceClassName = 'bad'

  return (
    <div className="list-item">
      <div className="row">
        <div className="col-xs-12 col-sm"><div className="box title-description">
          <Link to={billPath(bill)} className="title">
            {shorthand_title} &nbsp;
            <span className="bill-id">{billId}</span>
          </Link>
          <div className="description">{short_description}</div>
        </div></div>
        <div className="col-xs-6 col-sm-2"><div className="box">
          <div className="title">MPA bill stance</div>
          <div className="stance">{mpa_stance}</div>
        </div></div>
        <div className="col-xs-6 col-sm-2"><div className="box">
          <div className="title">
            {lastName} vote
          </div>
          <div className={`stance ${stanceClassName}`}>{legislator_stance}</div>
        </div></div>
      </div>
    </div>
  )
}
