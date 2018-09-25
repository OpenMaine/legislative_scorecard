import React from 'react'
import { withRouter } from 'react-router'
import { aboutSections, faqs } from '../data/'
import Linkify from 'react-linkify'




class About extends React.PureComponent {

  // Intercept clicks on links to this site and navigate via
  // react-router's history.push
  handleClick = (e) => {
    const { history } = this.props
    const href = e.target.href
    if (href.match(this.hrefRegExp)) {
      const path = href.replace(this.hrefRegExp, '')
      history.push(path)
      e.preventDefault()
      return false
    }
  }

  hrefRegExp = /https?:\/\/(\w+\.)?mpascorecard\.(org|com)/
  linkProps = { target: '_blank', rel: "noopener noreferrer", onClick: this.handleClick }

  splitParagraphs(content='') {
    return content.split("\n\n").map((paragraph, i) => {
      return <p key={i}><Linkify properties={this.linkProps}>{paragraph}</Linkify></p>
    })
  }

  render() {
    const renderedAboutSections = aboutSections.map((section, i) => {
      const { heading, paragraph } = section

      return (
        <section className="about" key={i}>
          <h1>{heading}</h1>
          {this.splitParagraphs(paragraph)}
        </section>
      )
    })

    const renderedFaqs = faqs.map((faq, i) => {
      return (
        <div key={i}>
          <h3>{faq.Question}</h3>
          <Linkify properties={this.linkProps}>{this.splitParagraphs(faq.Answer)}</Linkify>
        </div>
      )
    })

    return (
      <div className="about-page container">
        {renderedAboutSections}
      </div>
    )
  }
}

export default withRouter(About)
