import getKeys from 'lodash/keys'
const apiKey = 'AIzaSyDwRh45Ga8Ci3JGuBPlTL2kbgCKezAfrK0'//process.env.REACT_APP_CIVIC_INFI_API_KEY

function url(address) {
  return `https://www.googleapis.com/civicinfo/v2/representatives?address=${address}&includeOffices=true&levels=administrativeArea1&roles=legislatorLowerBody&roles=legislatorUpperBody&key=${apiKey}`
}

const ERROR_MESSAGES = {
  parseError: "Hmm... we can't understand that address.",
  notFound: "Hmm... we couldn't find any legislators for that address.",
  network: "Hmm... there's a network error.",
  unknown: "Hmm... there was an error. Our bad.",
}

function rejection(errorType) {
  return Promise.reject({ message: ERROR_MESSAGES[errorType] })
}

export function fetchDivisionsByAddress(address) {
  return fetch(url(address))
    .then(
      (response) => {
        // Parse JSON response
        return response.json()
      },
      (networkError) => {
        // Network error
        console.error(networkError)
        return rejection('network')
      }
    )
    .then(function(data) {
      if (data.errors) {
        // Google API error
        switch (data.errors[0].reason) {
          case 'parseError':
            return rejection('parseError')
          case 'notFound':
            return rejection('notFound')
          default:
            return rejection('unknown')
        }
      }
      else if (!data.divisions) {
        // Google return status 200, but there are no legislators.
        return rejection('notFound')
      }
      else {
        return getKeys(data.divisions)
      }
    })
}
