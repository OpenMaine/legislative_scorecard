import React from 'react'
import { Link } from 'react-router-dom'
import { legislatorPath, abbreviatedChamberTitle } from '../services/legislator-helpers'
import LegislatorAction from './LegislatorAction'
import iconLink from '../assets/images/icon-link.png'
import iconPhone from '../assets/images/icon-phone.png'
import iconEmail from '../assets/images/icon-email.png'

export default function LegislatorInfo(props) {
  const {
    compact,
    superCompact,
    includeTitle,
    legislator,
  } = props

  const {
    name,
    party,
    legal_residence,
    url,
    phone,
    email,
  } = legislator

  const isSuperCompact = superCompact
  const isCompact = superCompact || compact
  const isFull = !isCompact

  const title = includeTitle ? abbreviatedChamberTitle(legislator) : null

  const photo_url = '/legislator-photos/'
    + legislator.ocdId.replace(/^.+\//, '').replace(':', '.')
    + '.jpg'
  const avatar_styles = { backgroundImage: `url('${photo_url}')`}

  return (
    <div className={`legislator-info row middle-xs ${isCompact ? 'compact' : ''}`}>
      <div className="col-xs"><div className="box">
        <div className="legislator-avatar" style={avatar_styles} />
      </div></div>
      <div className="col-xs"><div className="box">
        <div className="legislator-name-and-address">
          <div className="legislator-name">
            <Link to={legislatorPath(legislator)}>{title} {name.fullName}</Link>
          </div>
          <div className="legislator-subtitle">
            <span>{party}&ndash;{legal_residence}</span>
          </div>
        </div>
      </div></div>
      { !isSuperCompact &&
        <div className="col-xs"><div className="box legislator-actions">
          { isFull &&
            <a className="legislator-action" href={url} target="_blank" rel="noopener noreferrer">
              <img src={iconLink} alt="link" />
            </a>
          }
          <LegislatorAction className="legislator-action" href={`tel:${phone}`}>
            <img src={iconPhone} alt="phone" />
          </LegislatorAction>
          <a className="legislator-action" href={`mailto:${email}`} target="_blank" rel="noopener noreferrer">
            <img src={iconEmail} alt="email" />
          </a>
        </div></div>
      }
    </div>
  )
}
