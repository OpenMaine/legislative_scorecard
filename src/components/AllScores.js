import React from 'react'
import { Link } from 'react-router-dom'
import { legislators as allLegislators } from '../data/'
import { legislatorPath, abbreviatedChamberTitle } from '../services/legislator-helpers'
import ScoreBar from './ScoreBar'
import LegislatorInfo from './LegislatorInfo'
import Select from './Select'
import memoize from 'lodash/memoize'
import orderBy from 'lodash/orderBy'


const sortOptions = [
  { value: 'alphabetically', label: 'Sorted alph.'},
  { value: 'asc', label: 'Low to high'},
  { value: 'desc', label: 'High to low'},
]

const scoreOptions = [
  { value: 'mpaScore', label: '2018 Score'},
  { value: 'voterScore', label: 'Will of the Voters score'},
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



export default class BillVoteList extends React.PureComponent {
  constructor(props) {
    super()
    this.state = {
      sortFilter: 'alphabetically',
      scoreType: 'mpaScore',
      partyFilter: '',
      chamberFilter: '',
      renderedLegislators: null,
    }
  }

  componentDidMount() {
    this.filterLegislators()
  }

  getCachedrenderedLegislators = memoize(function(cacheKey, filters) {
    const { sortFilter, scoreType, partyFilter,  chamberFilter } = filters
    let legislators = allLegislators.slice()

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

    // sort by score
    if (sortFilter === 'alphabetically') {
      legislators = orderBy(legislators, ['name.lastName'])
    }
    else {
      legislators = orderBy(legislators, 'orgscore', [sortFilter])
    }

    return renderLegislators(legislators, scoreType)
  })

  filterLegislators = () => {
    const { sortFilter, scoreType, partyFilter, chamberFilter } = this.state
    const cacheKey = sortFilter + scoreType + partyFilter + chamberFilter
    const filters = { sortFilter, scoreType, partyFilter,  chamberFilter }
    const renderedLegislators = this.getCachedrenderedLegislators(cacheKey, filters);

    this.setState({ renderedLegislators })
  }

  handeSortFilterChange = (e) => {
    this.setState({ sortFilter: e.target.value })
    setTimeout(this.filterLegislators, 0)
  }

  handeScoreTypeChange = (e) => {
    this.setState({ scoreType: e.target.value })
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
    const { sortFilter, scoreType, partyFilter, chamberFilter, renderedLegislators } = this.state

    return (
      <div>
        <section className="container">
          <div className="row">
            <div className="col-xs-12 col-md"><div className="box">
              <h1>All Scores</h1>
            </div></div>
            <div className="col-xs-6 col-sm-3 col-md-2"><div className="box">
              <Select options={sortOptions} value={sortFilter} onChange={this.handeSortFilterChange} className="full-width" />
            </div></div>
            <div className="col-xs-6 col-sm-3 col-md-2"><div className="box">
              <Select options={partyOptions} value={partyFilter} onChange={this.handePartyFilterChange} className="full-width" />
            </div></div>
            <div className="col-xs-6 col-sm-3 col-md-2"><div className="box">
              <Select options={chamberOptions} value={chamberFilter} onChange={this.handeChamberFilterChange} className="full-width" />
            </div></div>
          </div>
        </section>
        <section className="container card-container">
          <div className="card list">
            {renderedLegislators}
          </div>
        </section>
      </div>
    )
  }
}


function renderLegislators(legislators, scoreType) {
  if (legislators.length !== 0) {
    return legislators.map(function(legislator) {

      return (
        <Legislator
          key={legislator.ocdId}
          legislator={legislator}
          scoreType={scoreType}
          />
      );
    })
  }
  else {
    return <div className="no-results">No results</div>
  }
}

function Legislator(props) {
  const { legislator, scoreType } = props
  const { name } = legislator

  const score = legislator.orgscore

  return (
    <div className="list-item">
      <div className="row">
        <div className="col-xs-12 col-sm"><div className="box title-description">
          <LegislatorInfo legislator={legislator} superCompact includeTitle />
        </div></div>
        <div className="col-xs-12 col-sm-5"><div className="box">
          <ScoreBar score={score} />
          { scoreType === 'mpaScore' &&
            <div className="score-bar-sub-text">
              {`${abbreviatedChamberTitle(legislator)} ${name.lastName}'s alignment with our values this legislative session.`}
            </div>
          }
          { scoreType === 'voterScore' &&
            <div className="score-bar-sub-text">
              {`${abbreviatedChamberTitle(legislator)} ${name.lastName}'s score on respecting referendums the last two years.`}
            </div>
          }
        </div></div>
        <div className="col-xs-12 col-sm-2"><div className="box">
          <Link to={legislatorPath(legislator)} className="button full-width">Voting record</Link>
        </div></div>
      </div>
    </div>
  )
}
