import React from 'react'
import { Redirect } from 'react-router-dom'
import BillVoteList from './BillVoteList'
import lowerCase from 'lodash/lowerCase'
import { getBillFromParams } from '../services/bill-helpers'
import iconPopout from '../assets/images/icon-popout.png'
import Linkify from 'react-linkify'

export default function BillDetail({ match }) {
  const bill = getBillFromParams(match.params)


  var splitParagraphs = function(content='') {
    if(Array.isArray(content) || !content || content == '') return content;
    return content.split("\n\n").map((paragraph, i) => {
      return <p key={i}><Linkify >{paragraph}</Linkify></p>
    })
  }

  if (bill == null)
    return <Redirect to="/404.html" />

  return (
    <div className="bill-detail">
      <div className="container">
        <section>
          <h2>{bill.subject}</h2>
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

          <span className={`org-stance stance ${bill.org_stance}`}>
            Maine AFL-CIO&nbsp;{bill.org_stance}
          </span>
        </section>
        <section>
          <div className="bill-photo">
            <img src={bill.photo} alt="" />
            <p className="caption">{splitParagraphs(bill.quote)}</p>
            <div className="quote-attribution">
              {bill.quote_attribution}
            </div>
          </div>
          <div className="bill-copy">
            <i>{bill.official_title} </i>
            <p>- Sponsored by {bill.sponsor} {bill.vote_number}</p>
            
            <h2>What is the bill?</h2>
            {splitParagraphs(bill.short_description)}
            <h2>What happened?</h2>
            <p>{bill.final_outcome}</p>
          </div>
        </section>
      </div>
      <BillVoteList bill={bill} />
    </div>
  )
}
