import React from 'react'
import { billPath } from '../services/bill-helpers'
import { Link } from 'react-router-dom'


export default function BillList(props) {
  const { bills } = props

  const renderedBills = bills.map(function(bill) {
    return <Bill key={bill.id} bill={bill} />;
  })

  return (
    <div className="card list">
      {renderedBills}
    </div>
  )
}


function Bill(props) {
  const { bill } = props

  const {
    shorthand_title,
    subject,
    short_description,
    org_stance,
    official_title
  } = bill



  const billId = props.bill.id.replace(/\s/g, '\u00A0')

  return (
    <div className="list-item">
      <div className="row">
        <div className="col-xs"><div className="box title-description">
          <Link to={billPath(bill)} className="title">
            <span className="bill-id">{billId} - {subject}</span>
          </Link>
          <h3>{official_title}</h3>
          <div className="description">{short_description}</div>
        </div></div>
        { org_stance &&
          <div className="col-xs-3 col-sm-2">
            <div className="box">
              <div className="title">Maine AFL-CIO stance</div>
              <div className={`stance ${org_stance}`}>{org_stance}</div>
            </div>
          </div>
        }
        <div className="col-xs-12 col-sm-2"><div className="box">
          <Link to={billPath(bill)} className="button full-width">Details</Link>
        </div></div>
      </div>
    </div>
  )
}
