import React from 'react';
import { swapEndpoints } from '../../action/EndpointActions';

import { intlShape } from 'react-intl';

import Icon from '../icon/icon';
import OneTabSearchModal from '../search/one-tab-search-modal';

class OriginDestinationBar extends React.Component {

  static contextTypes = {
    getStore: React.PropTypes.func.isRequired,
    executeAction: React.PropTypes.func.isRequired,
    intl: intlShape.isRequired,
  };

  constructor() {
    super();

    this.state = {
      origin: undefined,
      destination: undefined,
      tabOpen: false,
    };

    this.componentWillMount = this.componentWillMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.onEndpointChange = this.onEndpointChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openSearch = this.openSearch.bind(this);
  }

  componentWillMount() {
    this.onEndpointChange();
    this.context.getStore('EndpointStore').addChangeListener(this.onEndpointChange);
  }

  componentWillUnmount() {
    this.context.getStore('EndpointStore').removeChangeListener(this.onEndpointChange);
  }

  onEndpointChange() {
    this.setState({
      origin: this.context.getStore('EndpointStore').getOrigin(),
      destination: this.context.getStore('EndpointStore').getDestination(),
    });
  }

  closeModal() {
    this.setState({
      tabOpen: false,
    });
  }

  openSearch(tab) {
    this.setState({
      tabOpen: tab,
    });
  }

  render() {
    const ownPosition = this.context.intl.formatMessage({
      id: 'own-position',
      defaultMessage: 'Your current location',
    });

    let initialValue = '';

    if (this.state[this.state.tabOpen]) {
      initialValue = this.state[this.state.tabOpen].useCurrentPosition ?
        ownPosition :
        this.state[this.state.tabOpen].address;
    }

    return (
      <div className="origin-destination-bar">
        <div className="field-link from-link" onClick={() => this.openSearch('origin')}>
          <Icon img={'icon-icon_mapMarker-point'} className="itinerary-icon from" />
          <span className="dotted-link">
            {this.state.origin.useCurrentPosition ?
              ownPosition : this.state.origin.address}
          </span>
        </div>
        <div
          className="switch"
          onClick={() => this.context.executeAction(swapEndpoints)}
        >
          <span>
            <Icon img="icon-icon_direction-b" />
          </span>
        </div>
        <div className="field-link to-link" onClick={() => this.openSearch('destination')}>
          <Icon img={'icon-icon_mapMarker-point'} className="itinerary-icon to" />
          <span className="dotted-link">
            {this.state.destination.useCurrentPosition ?
              ownPosition : this.state.destination.address}
          </span>
        </div>
        <OneTabSearchModal
          modalIsOpen={this.state.tabOpen}
          closeModal={this.closeModal}
          initialValue={initialValue}
          endpoint={this.state[this.state.tabOpen]}
          target={this.state.tabOpen}
        />
      </div>);
  }
}

export default OriginDestinationBar;
