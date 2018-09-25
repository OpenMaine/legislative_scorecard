import legislators from './legislators.json'
import bills from './bills.json'
import aboutSections from './aboutSections.json'
import faqs from './faqs.json'

// Index legislators by ocdId
const legislatorsByOcdId = {}
legislators.forEach(function(legislator) {
  legislatorsByOcdId[legislator.ocdId] = legislator
})

// Index bills by id
const billsById = {}
bills.forEach(function(bill) {
  billsById[bill.id] = bill
})

export {
  legislators,
  legislatorsByOcdId,
  bills,
  billsById,
  aboutSections,
  faqs,
}
