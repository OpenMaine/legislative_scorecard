import React from 'react'
import { Redirect } from 'react-router-dom'
import BillVoteList from './BillVoteList'
import lowerCase from 'lodash/lowerCase'
import { getBillFromParams } from '../services/bill-helpers'
import iconPopout from '../assets/images/icon-popout.png'

export default function BillDetail({ match }) {
  const bill = getBillFromParams(match.params)

  if (bill == null)
    return <Redirect to="/404.html" />

  return (
    <div className="bill-detail">
      <div className="container">
        <section>
          <h1>{bill.shorthand_title}</h1>
        </section>
        <section>
          <a
            className="bill-text-link"
            href={bill.bill_text_url}
            target="_blank" rel="noopener noreferrer"
            >
            {bill.id} bill text&nbsp;
            <img src={iconPopout} alt="" />
          </a>
          <a
            className="bill-more-info-link"
            href={bill.more_info_url}
            target="_blank" rel="noopener noreferrer"
            >
            Read More&nbsp;
            <img src={iconPopout} alt="" />
          </a>
          <span className={`mpa-stance stance ${bill.mpa_stance}`}>
            MPA&nbsp;{lowerCase(bill.mpa_stance)}
          </span>
        </section>
        <section>
          <div className="bill-photo">
            <img src={bill.photo} alt="" />
            <p className="caption">{bill.photo_caption}</p>
          </div>
          <div className="bill-copy">
            <p>
              {bill.quote}
              <br />
              <span className="quote-attribution">
                &ndash; {bill.quote_attribution}
              </span>
            </p>
            <h2>What is the bill</h2>
            <p>{bill.what_is_the_bill}</p>
            <h2>Why it matters</h2>
            <p>{bill.why_it_matters}</p>
            <h2>What happened</h2>
            <p>{bill.what_happened}</p>
          </div>
        </section>
      </div>
      <BillVoteList bill={bill} />
    </div>
  )
}
