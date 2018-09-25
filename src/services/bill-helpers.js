import slug from 'slug'
import { billsById } from '../data/index'

export const billPath = (bill) => {
  const idSlug = slug(bill.id)
  const titleSlug = slug(bill.subject)

  return `/bills/${idSlug}/${titleSlug}`
}

export const getBillFromParams = (params) => {
  const idSlug = params.billId
  const id = idSlug.replace('-', ' ')
  return billsById[id]
}
