import React from 'react'
import { Redirect } from 'react-router-dom'
import {
  getLegislatorFromParams,
  abbreviatedChamberTitle,
} from '../services/legislator-helpers'
import LegislatorInfo from './LegislatorInfo'
import ScoreBar from './ScoreBar'
import LegislatorVoteList from './LegislatorVoteList'

export default function LegislatorDetail({ match }) {
  const param = match.params.ocdId
  const legislator = getLegislatorFromParams(param)

  if (legislator == null)
    return <Redirect to="/404.html" />

  const {
    name,
    legislative_chamber,
    districtNum,
    towns,
    orgscore,
    voterScore,
    seeking_reelection,
    term_limited,
  } = legislator

  const upForReelection = seeking_reelection ? '2018' : 'Not seeking re-election'

  return (
    <div className="legislator-detail">
      <div className="container">
        <section>
          <LegislatorInfo legislator={legislator} />
        </section>
        <hr />
        <section className="district-info">
          <div className="row">
            <div className="col-xs-12 col-sm-6"><div className="box">
              <div className="title">Representing {legislative_chamber} District {districtNum}</div>
              <div className="description">{towns}</div>
            </div></div>
            <div className="col-xs-12 col-sm-5 col-sm-offset-1"><div className="box term-info"><div className="row">
              <div className="col-xs-6"><div className="box">
                <div className="title">Term limited</div>
                <div className="description">{term_limited}</div>
              </div></div>
              <div className="col-xs-6"><div className="box">
                <div className="title">Up for re-election</div>
                <div className="description">{upForReelection}</div>
              </div></div>
            </div></div></div>
          </div>
        </section>
        <hr />
        <section className="scores">
          <div className="row">
            <div className="col-xs-12 col-md-5"><div className="mpa-score box">
              <h1>2018 Score</h1>
              <ScoreBar score={orgscore} />
              <div className="score-bar-sub-text">
                {`${abbreviatedChamberTitle(legislator)} ${name.lastName}'s alignment with our values this legislative session.`}
              </div>
            </div>
            </div>
            
          </div>
        </section>
        <hr />
      </div>
      <LegislatorVoteList legislator={legislator} />
    </div>
  )
}
