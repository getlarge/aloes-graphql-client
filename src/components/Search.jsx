import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import Device from './Device';
import { AUTH_TOKEN, USER_ID } from '../constants';

export const DEVICE_SEARCH = gql`
  query searchDevices($userId: String!, 
    $apiKey: String!,
    $filter: String!) {
    viewerApiKey(
      apiKey: $apiKey
    ) {
      findUserById(
        userId: $userId
        deviceFilter: { where: {name: { regexp: $filter } }, limit: 30 }
      ) {
        firstName
        email
        devices {
          id
          name
          devEui
          type
          status
          createdAt
          sensors {
            id
            name
            type
            nativeNodeId
            nativeSensorId
            lastSignal
          }
        }
      }
      devicesCount(where : { ownerId: $userId}) {
        count
      }
    }
  }
`;

class Search extends Component {
  state = {
    devices: [],
    filter: ''
  };

  render() {
    return (
      <div>
        <div>
          Search
          <input
            type='text'
            onChange={e => this.setState({ filter: e.target.value })}
          />
          <button onClick={() => this._executeSearch()}>OK</button>
        </div>
        {this.state.devices.map((device, index) => (
          <Device key={device.id} device={device} index={index} />
        ))}
      </div>
    )
  }

  _executeSearch = async () => {
    const { filter } = this.state;
    const apiKey = localStorage.getItem(AUTH_TOKEN);
    const userId = localStorage.getItem(USER_ID);
    const result = await this.props.client.query({
      query: DEVICE_SEARCH,
      variables: { apiKey, filter, userId},
    });
    console.log('SEARCH RESULT:', result.data)
    const devices = result.data.viewerApiKey.findUserById.devices;
    this.setState({ devices });
  }
}

export default withApollo(Search);