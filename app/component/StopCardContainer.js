import PropTypes from 'prop-types';
import React from 'react';
import { graphql } from 'relay-runtime';
import { createContainer as createFragmentContainer } from 'react-relay/lib/ReactRelayFragmentContainer';
import connectToStores from 'fluxible-addons-react/connectToStores';

import StopCardHeaderContainer from './StopCardHeaderContainer';
import DepartureListContainer from './DepartureListContainer';
import StopCard from './StopCard';

const StopCardContainer = connectToStores(
  StopCard,
  ['FavouriteStopsStore'],
  (context, props) => ({
    isTerminal: props.isTerminal,
    children: (
      <DepartureListContainer
        rowClasses="no-padding no-margin"
        stoptimes={props.stop.stoptimes}
        limit={props.limit}
        isTerminal={props.isTerminal}
        currentTime={props.currentTime}
      />
    ),
  }),
);

StopCardContainer.contextTypes = {
  executeAction: PropTypes.func.isRequired,
  getStore: PropTypes.func.isRequired,
};

export default createFragmentContainer(StopCardContainer, {
  stop: graphql.experimental`
    fragment StopCardContainer_stop on Stop
      @argumentDefinitions(
        startTime: { type: "Long" }
        timeRange: { type: "Int" }
        numberOfDepartures: { type: "Int", defaultValue: 5 }
      ) {
      gtfsId
      stoptimes: stoptimesWithoutPatterns(
        startTime: $startTime
        timeRange: $timeRange
        numberOfDepartures: $numberOfDepartures
      ) {
        ...DepartureListContainer_stoptimes
      }
      ...StopCardHeaderContainer_stop
    }
  `,
});
