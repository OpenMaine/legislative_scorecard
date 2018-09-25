import React from 'react'
import Select from './Select'
import towns from '../data/townNames.json'
import { BarLoader as Spinner } from 'react-spinners'

import withStore, {
  setStreetAddress,
  setTown,
  setZip,
  fetchLegislators,
} from '../services/legislators-store'

function handleSubmit(e) {
  fetchLegislators()
  e.preventDefault()
  return false
}

export default withStore(function FindMyLegislators(props) {
  const { store } = props

  const streetAddress = store.get('streetAddress')
  const town          = store.get('town')
  const zip           = store.get('zip')
  const isFetching    = store.get('isFetching')
  const error         = store.get('error')

  return (
    <div className="find-my-legislators">
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Street address"
          onChange={(e) => setStreetAddress(e.target.value)}
          value={streetAddress}
          />
        <Select
          className="town"
          placeholder="Town Name"
          options={towns}
          onChange={(e) => setTown(e.target.value)}
          value={town}
          />
        <input
          className="zip"
          placeholder="Zip"
          onChange={(e) => setZip(e.target.value)}
          value={zip}
          />
        { !isFetching &&
          <input
            type="submit"
            value="Find my legislators"
            />
        }
        { isFetching &&
          <button disabled >
            <Spinner color="#ffffff" />
          </button>
        }
      </form>
      { error &&
        <div className="error-message">
          {error.message}
        </div>
      }
    </div>
  )
})
