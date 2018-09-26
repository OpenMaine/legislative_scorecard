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
    orgscore,
    voterScore,
  } = legislator

  const badgeText = badgeTexts[Number(your)][legislative_chamber]

  return (
    <div className="col-md-6 col-xs-12"><div className="box">
      <div className={`legislator-card card ${your ? 'your' : ''}`}>
        <div className="badge">{badgeText}</div>
        <LegislatorInfo legislator={legislator} compact />
        <div className="mpa-score">
          <ScoreBar score={orgscore} />
          <div className="score-bar-sub-text">
            <b>2018 Score:</b> {`${abbreviatedChamberTitle(legislator)} ${name.lastName}'s alignment with our values this legislative session.`}
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
