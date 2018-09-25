const fs          = require('fs')
const nodeFetch   = require('node-fetch')
const Cache       = require('file-system-cache').default
const fetchCached = require('fetch-cached').default


// ==========
// = Config =
// ==========

const config = {
  useCache: parseBool(process.env.USE_CACHE),
}

if (config.useCache) {
  console.log(); console.warn('Warning: using cached legislator data when available. This may not be fresh data.'); console.log()
}





// ================
// = Set up cache =
// ================

if (!fs.existsSync('./tmp')){
    fs.mkdirSync('./tmp');
}
if (!fs.existsSync('./tmp/data-fetch')){
    fs.mkdirSync('./tmp/data-fetch');
}

const cache = Cache({
  basePath: './tmp/data-fetch',
})





// =================
// = Fetch wrapper =
// =================

const fetch = fetchCached({
  fetch: (url) => { console.log('fetching', url); return nodeFetch(url) },
  cache: {
    get: (config.useCache) ? (k) => cache.get(k) : (k) => Promise.resolve(null),
    set: (k, v) => cache.set(k, v)
  }
})

async function fetchJSON(url) {
  const response   = await fetch(url)
  const parsedJSON = await response.json()
  return parsedJSON
}

exports.default = fetch


// =============
// = Utilities =
// =============

function parseBool(inputStr) {
  if (typeof(inputStr) !== 'string') return false

  const str = inputStr.toLowerCase()
  return str === 'true' || str === 't'
}
