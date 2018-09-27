import React from 'react'
import BillList from './BillList'
import { bills as allBills } from '../data/'
import Select from './Select'
import memoize from 'lodash/memoize'
import isEmpty from 'lodash/isEmpty'
import Linkify from 'react-linkify'


class Bills extends React.PureComponent {
  state = {
    filter: '2018Bills',
  }

  getCachedBills = memoize(function(filter) {
      return allBills
  })

  splitParagraphs(content='') {
    if(Array.isArray(content) || !content || content == '') return content;

    return content.split("\n\n").map((paragraph, i) => {
      return <p key={i}><Linkify properties={this.linkProps}>{paragraph}</Linkify></p>
    })
  }

  getBills() {
    const { filter } = this.state;
    var bills = this.getCachedBills(filter);
    bills.map((bill, i) => {
      bill.short_description = this.splitParagraphs(bill.short_description);
    })
    return bills;
  }

  handeFilterChange = (e) => {
    this.setState({ filter: e.target.value })
  }

  render() {
    const { filter } = this.state

    const bills = this.getBills()

    return (
      <div className="bills">
        <div className="container">
          <section>
            <div className="row">
              <div className="col-xs"><div className="box">
                <h1>Bills</h1>
              </div></div>
            </div>
          </section>
        </div>
        <section className="container card-container">
          <BillList bills={bills} />
        </section>
      </div>
    )
  }
}

export default Bills
