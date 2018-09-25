import slug from 'slug'
import { legislatorsByOcdId } from '../data/index'

export const legislatorPath = (legislator) => {
  const ocdId = legislator.ocdId
  const snippit = ocdId
    .replace('ocd-division/country:us/state:me/', '')
    .replace(':', '-')
  const nameSlug = slug(legislator.name.fullName)

  return `/legislators/${snippit}/${nameSlug}`
}

export const getLegislatorFromParams = (snippit) => {
  const unescapedSnippit = snippit.replace('-', ':')
  const ocdId = `ocd-division/country:us/state:me/${unescapedSnippit}`

  return legislatorsByOcdId[ocdId]
}


// Chamber titles

const abbreviatedChamberTitles = {
  House: 'Rep.',
  Senate: 'Sen.',
}

const chamberTitles = {
  House: 'Representative',
  Senate: 'Senator',
}

export const chamberTitle = (legislator) => {
  return chamberTitles[legislator.legislative_chamber]
}

export const abbreviatedChamberTitle = (legislator) => {
  return abbreviatedChamberTitles[legislator.legislative_chamber]
}
