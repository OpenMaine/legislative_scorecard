import React, { Component } from 'react';
import Popover from 'react-simple-popover';

export default class LegislatorAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  handleClick = (e) => {
    if (window.innerWidth > 450) {
      this.setState({open: !this.state.open});
      e.preventDefault();
      return false;
    }
    else {
      return true;
    }
  }

  handleClose = (e) => {
    this.setState({open: false});
  }

  handleInputFocus(e) {
    e.target.select()
    e.preventDefault()
    return false
  }

  render() {
    const {
      href,
    } = this.props;

    const text = href.replace('tel:', '');

    return (
        <div style={{position: 'relative'}}>
          <a
            className="legislator-action"
            href={href}
            ref="target"
            onClick={this.handleClick}
            >
            {this.props.children}
          </a>
          <Popover
            placement='bottom'
            container={this}
            target={this.refs.target}
            show={this.state.open}
            onHide={this.handleClose} >
            <div className="popover">
              <input value={text} readOnly className="popover-input full-width" onFocus={this.handleInputFocus} />
            </div>
          </Popover>
        </div>
    );
  }
}
