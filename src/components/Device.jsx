import React, { Component } from 'react';
import { AUTH_TOKEN } from '../constants';
import { timeDifferenceForDate } from '../utils';

class Device extends Component {
	render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    return (
      <div className="flex mt2 items-start">
        <div className="flex items-center">
          <span className="gray">{this.props.index + 1}.</span>
        </div>
        <div className="ml1">
          <div>
            {this.props.device.description} ({this.props.device.name})
          </div>
          <div className="f6 lh-copy gray">
            {this.props.device.sensors.length} sensors | by{' '}
            {timeDifferenceForDate(this.props.device.createdAt)}
          </div>
        </div>
      </div>
    )
  }
}

export default Device;