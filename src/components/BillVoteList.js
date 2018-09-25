import React from 'react'
import { Link } from 'react-router-dom'
import { legislators as allLegislators } from '../data/'
import { legislatorPath } from '../services/legislator-helpers'
import LegislatorInfo from './LegislatorInfo'
import Select from './Select'
import memoize from 'lodash/memoize'


const stanceOptions = [
  { value: '', label: 'All Stances' },
  { value: 'Supported', label: 'Supported' },
  { value: 'Opposed', label: 'Opposed' },
]

const partyOptions = [
  { value: '', label: 'All Parties' },
  { value: 'Democrat', label: 'Democrats' },
  { value: 'Republican', label: 'Republicans' },
  { value: 'Independent', label: 'Independents' },
  { value: 'Unenrolled', label: 'Green' },
]

const chamberOptions = [
  { value: '', label: 'Both Chambers'},
  { value: 'Senate', label: 'Senate' },
  { value: 'House', label: 'House'},
]

function renderVotes({ legislators, bill }) {
  if (legislators.length !== 0) {
    return legislators.map(function(legislator) {
      const stance = legislator.votes[bill.id];
      if (stance == null) return null;
      const key = 'bill-vote' + legislator.ocdId + bill.id
      return (
        <Vote
          key={key}
          bill={bill}
          legislator={legislator}
          legislator_stance={stance}
          />
      );
    })
  }
  else {
    return <div className="no-results">No results</div>
  }
}




export default class BillVoteList extends React.PureComponent {
  constructor(props) {
    super()
    this.state = {
      stanceFilter: '',
      partyFilter: '',
      chamberFilter: '',
      renderedVotes: null,
    }
  }

  componentDidMount() {
    this.filterLegislators()
  }

  getCachedrenderedVotes = memoize(function(cacheKey, bill, filters) {
    const { stanceFilter, partyFilter,  chamberFilter } = filters
    let legislators = allLegislators.slice()

    // Filter by stance
    if (stanceFilter !== '') {
      legislators = legislators.filter((legislator) => {
        return legislator.votes[bill.id] === stanceFilter
      })
    }

    // filter party
    if (partyFilter !== '') {
      legislators = legislators.filter((legislator) => {
        return legislator.political_party === partyFilter
      })
    }

    // filter chamber
    if (chamberFilter !== '') {
      legislators = legislators.filter((legislator) => {
        return legislator.legislative_chamber === chamberFilter
      })
    }

    return renderVotes({ legislators, bill })
  })

  filterLegislators = () => {
    const { bill } = this.props;
    const { stanceFilter, partyFilter, chamberFilter } = this.state
    const cacheKey = bill + stanceFilter + partyFilter + chamberFilter
    const filters = { stanceFilter, partyFilter,  chamberFilter }
    const renderedVotes = this.getCachedrenderedVotes(cacheKey, bill, filters);

    this.setState({ renderedVotes })
  }

  handeStanceFilterChange = (e) => {
    this.setState({ stanceFilter: e.target.value })
    setTimeout(this.filterLegislators, 0)
  }

  handePartyFilterChange = (e) => {
    this.setState({ partyFilter: e.target.value })
    setTimeout(this.filterLegislators, 0)
  }

  handeChamberFilterChange = (e) => {
    this.setState({ chamberFilter: e.target.value })
    setTimeout(this.filterLegislators, 0)
  }

  render() {
    const { stanceFilter, partyFilter, chamberFilter, renderedVotes } = this.state

    return (
      <div>
        <section className="container">
          <div className="row">
            <div className="col-xs-12 col-md"><div className="box">
              <h1>Votes</h1>
            </div></div>
            <div className="col-xs-6 col-sm-4 col-md-3"><div className="box">
              <Select options={partyOptions} value={partyFilter} onChange={this.handePartyFilterChange} className="full-width" />
            </div></div>
            <div className="col-xs-6 col-sm-4 col-md-3"><div className="box">
              <Select options={chamberOptions} value={chamberFilter} onChange={this.handeChamberFilterChange} className="full-width" />
            </div></div>
            <div className="col-xs-12 col-sm-4 col-md-3"><div className="box">
              <Select options={stanceOptions} value={stanceFilter} onChange={this.handeStanceFilterChange} className="full-width" />
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
    org_stance,
  } = bill

  const lastName = legislator.name.lastName

  let stanceClassName
  if (legislator_stance.match((/Excused|n\/a/i)))
    stanceClassName = 'neutral'
  else if (legislator_stance === org_stance)
    stanceClassName = 'good'
  else
    stanceClassName = 'bad'

  return (
    <div className="list-item">
      <div className="row">
        <div className="col-xs-12 col-sm"><div className="box title-description">
          <LegislatorInfo legislator={legislator} superCompact includeTitle />
        </div></div>
        <div className="col-xs-6 col-sm-2"><div className="box">
          <div className="title">Maine AFL-CIO bill stance</div>
          <div className="stance">{org_stance}</div>
        </div></div>
        <div className="col-xs-6 col-sm-2"><div className="box">
          <div className="title">
            {lastName} vote
          </div>
          <div className={`stance ${stanceClassName}`}>{legislator_stance}</div>
        </div></div>
        <div className="col-xs-12 col-sm-2"><div className="box">
          <Link to={legislatorPath(legislator)} className="button full-width">Voting record</Link>
        </div></div>
      </div>
    </div>
  )
}
