import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Device from './Device';
import { AUTH_TOKEN, LINKS_PER_PAGE, USER_ID } from '../constants';

export const USER_RELATIONS = gql`
  query findUserByIdAndRelations($userId: String!, 
    $apiKey: String!,
    $deviceLimit: Int, 
    $deviceSkip: Int, 
    $sensorLimit: Int, 
    $sensorSkip: Int) {
    viewerApiKey(
      apiKey: $apiKey
    ) {
      findUserById(
        userId: $userId
        deviceFilter: { limit: $deviceLimit, skip: $deviceSkip }
        sensorFilter: { limit: $sensorLimit, skip: $sensorSkip }
        measurementFilter: { limit: 10, where: { rp: "0s" } }
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

class DeviceList extends Component {
	render() {
    return (
      <Query query={USER_RELATIONS} variables={this._getQueryVariables()}>
        {({ loading, error, data }) => {
          if (loading) return <div>Fetching</div>
          if (error) {
            console.log('GRAPHQL ERR:',error)
            return <div>Error</div>
          }

          // const linksToRender = data.feed.links;
          const devicesToRender = this._getDevicesToRender(data);
          const isNewPage = this.props.location.pathname.includes('new');
          const pageIndex = this.props.match.params.page
            ? (this.props.match.params.page - 1) * LINKS_PER_PAGE
            : 0;


          return (
            <Fragment>
              {devicesToRender.map((device, index) => <Device 
                key={device.id} 
                device={device} 
                index={index + pageIndex}
                
              />)}
              {isNewPage && (
              <div className="flex ml4 mv3 gray">
                <div className="pointer mr2" onClick={this._previousPage}>
                  Previous
                </div>
                <div className="pointer" onClick={() => this._nextPage(data)}>
                  Next
                </div>
              </div>
            )}
            </Fragment>
          )
        }}
      </Query>
    )
  }

  _getQueryVariables = () => {
    const isNewPage = this.props.location.pathname.includes('new');
    const page = parseInt(this.props.match.params.page, 10);
    // const userId = this.props.userId;
    const apiKey = localStorage.getItem(AUTH_TOKEN);
    const userId = localStorage.getItem(USER_ID);

    const deviceSkip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
    const deviceLimit = isNewPage ? LINKS_PER_PAGE : 100;
    const sensorSkip = 0;
    const sensorLimit = 4;
    // const orderBy = isNewPage ? 'createdAt_DESC' : null;
    console.log('QUERY VARS', userId, apiKey, deviceLimit, deviceSkip);
    return { userId, apiKey, deviceLimit, deviceSkip, sensorLimit, sensorSkip };
  }

  _getDevicesToRender = data => {
    const isNewPage = this.props.location.pathname.includes('new');
    console.log('DEVICES', data)
    if (isNewPage) {
      return data.viewerApiKey.findUserById.devices;
    }
    // const rankedLinks = data.feed.links.slice();
    // rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length);
    // return rankedLinks;
    return data.viewerApiKey.findUserById.devices;
  }

  _nextPage = data => {
    const page = parseInt(this.props.match.params.page, 10);
    if (page <= data.viewerApiKey.devicesCount.count / LINKS_PER_PAGE) {
      const nextPage = page + 1;
      this.props.history.push(`/new/${nextPage}`);
    }
  }

  _previousPage = () => {
    const page = parseInt(this.props.match.params.page, 10);
    if (page > 1) {
      const previousPage = page - 1;
      this.props.history.push(`/new/${previousPage}`);
    }
  }

}

export default DeviceList;