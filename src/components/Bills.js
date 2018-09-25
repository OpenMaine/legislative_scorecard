import React from 'react'
import BillList from './BillList'
import { bills as allBills } from '../data/'
import Select from './Select'
import memoize from 'lodash/memoize'
import isEmpty from 'lodash/isEmpty'


const filterOptions = [
  { value: '2018Bills', label: '2018 bills' },
  { value: 'voterBills', label: 'Will of the Voters bills' },
]

class Bills extends React.PureComponent {
  state = {
    filter: '2018Bills',
  }

  getCachedBills = memoize(function(filter) {
    if (filter === '2018Bills')
      return allBills.filter(bill => bill.is_2018_bill)
    else
      return allBills.filter(bill => !isEmpty(bill.voter_stance))
  })

  getBills() {
    const { filter } = this.state;
    return this.getCachedBills(filter);
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
              <div className="col-xs-12 col-sm-4 col-md-3"><div className="box">
                <Select options={filterOptions} value={filter} onChange={this.handeFilterChange} className="full-width" />
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
