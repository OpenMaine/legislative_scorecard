import React from 'react'
import LegislatorInfo from './LegislatorInfo'
import ScoreBar from './ScoreBar'
import { Link } from 'react-router-dom'
import {
  legislatorPath,
  abbreviatedChamberTitle,
} from '../services/legislator-helpers'

const badgeTexts = [
  { Senate: 'Senator', House: 'Representative' },
  { Senate: 'Your Senator', House: 'Your Representative' },
]

export default function LegislatorCard(props) {
  const {
    legislator,
    your,
  } = props
  const {
    name,
    legislative_chamber,
    mpaScore,
    voterScore,
  } = legislator

  const badgeText = badgeTexts[Number(your)][legislative_chamber]

  return (
    <div className="col-md-6 col-xs-12"><div className="box">
      <div className={`legislator-card card ${your ? 'your' : ''}`}>
        <div className="badge">{badgeText}</div>
        <LegislatorInfo legislator={legislator} compact />
        <div className="mpa-score">
          <ScoreBar score={mpaScore} />
          <div className="score-bar-sub-text">
            <b>2018 Score:</b> {`${abbreviatedChamberTitle(legislator)} ${name.lastName}'s alignment with our values this legislative session.`}
          </div>
        </div>
        <div className="voter-score">
          <ScoreBar score={voterScore} />
          <div className="score-bar-sub-text">
            <b>Will of the voters:</b> {`${abbreviatedChamberTitle(legislator)} ${name.lastName}'s score on respecting referendums the last two years.`}
          </div>
        </div>
        <div className="view-voting-record">
          <Link
            to={legislatorPath(legislator)}
            className="button full-width"
            >
            View voting record
          </Link>
        </div>
      </div>
    </div></div>
  )
}
