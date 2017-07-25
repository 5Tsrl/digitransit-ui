import PropTypes from 'prop-types';
import React from 'react';
import { QueryRenderer, graphql } from 'react-relay/compat';

import CityBikeMarker from './CityBikeMarker';
import ComponentUsageExample from '../../ComponentUsageExample';
import getRelayEnvironment from '../../../util/getRelayEnvironment';

class CityBikeMarkerContainer extends React.Component {
  static description = (
    <div>
      <p>
        Renders all citybike stations if zoom is over 14. Requires map to be
        found in props.
      </p>
      <ComponentUsageExample description="">
        <CityBikeMarkerContainer />
      </ComponentUsageExample>
    </div>
  );

  static propTypes = {
    relayEnvironment: PropTypes.object.isRequired,
  };

  static contextTypes = {
    map: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.context.map.on('zoomend', this.onMapZoom);
  }

  componentWillUnmount() {
    this.context.map.off('zoomend', this.onMapZoom);
  }

  onMapZoom = () => this.forceUpdate();

  render() {
    if (
      this.context.map.getZoom() < this.context.config.cityBike.cityBikeMinZoom
    ) {
      return false;
    }
    return (
      <QueryRenderer
        environment={this.props.relayEnvironment}
        query={graphql`
          query CityBikeMarkerContainerQuery {
            viewer {
              stations: bikeRentalStations {
                lat
                lon
                stationId
              }
            }
          }
        `}
        render={({ props }) =>
          <div>
            {props &&
              Array.isArray(props.viewer.stations) &&
              props.viewer.stations.map(station =>
                <CityBikeMarker station={station} key={station.stationId} />,
              )}
          </div>}
      />
    );
  }
}

export default getRelayEnvironment(CityBikeMarkerContainer);
