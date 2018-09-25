import React from 'react'
import FindMyLegislators from './FindMyLegislators'
import LegislatorCard from './LegislatorCard'
import withStore from '../services/legislators-store'


export default withStore(function Legislators(props) {
  const { store } = props

  const yourLegislators = store.get('yourLegislators')
  // const otherLegislators = store.get('otherLegislators')

  // Array of legislator cards
  const yourLegislatorCards = yourLegislators.map((legislator) => {
    return <LegislatorCard legislator={legislator} your={true} key={legislator.ocdId} />
  })
  // const otherLegislatorCards = otherLegislators.map((legislator) => {
  //   return <LegislatorCard legislator={legislator} your={false} key={legislator.ocdId} />
  // })

  return (
    <div className="legislators">
      <div className="container">
        <FindMyLegislators />
        { yourLegislators.length === 0 &&
          <h1 className="zero-state-message">
            Enter your address to find your representatives.
          </h1>
        }
      </div>
      <div className="legislator-cards container card-container">
        <div className="row">
          {yourLegislatorCards}
        </div>
      </div>
    </div>
  )
});
