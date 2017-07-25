import PropTypes from 'prop-types';
import React from 'react';
import { QueryRenderer, graphql } from 'react-relay/compat';
import connectToStores from 'fluxible-addons-react/connectToStores';
import FavouriteRouteListContainer from './FavouriteRouteListContainer';
import FavouriteLocationsContainer from './FavouriteLocationsContainer';
import NextDeparturesListHeader from './NextDeparturesListHeader';
import NoFavouritesPanel from './NoFavouritesPanel';
import Loading from './Loading';
import getRelayEnvironment from '../util/getRelayEnvironment';

const FavouriteRoutes = ({ routes, currentTime, relayEnvironment }) => {
  if (routes.length > 0) {
    return (
      <QueryRenderer
        cacheConfig={{ force: true, poll: 30 * 1000 }}
        query={graphql.experimental`
          query FavouritesPanelQuery($ids: [String!], $currentTime: Long!) {
            routes(ids: $ids) {
              ...FavouriteRouteListContainer_routes
                @arguments(currentTime: $currentTime)
            }
          }
        `}
        variables={{ ids: routes, currentTime }}
        environment={relayEnvironment}
        render={({ props }) =>
          props
            ? <FavouriteRouteListContainer
                {...props}
                currentTime={currentTime}
              />
            : <Loading />}
      />
    );
  }
  return <NoFavouritesPanel />;
};

FavouriteRoutes.propTypes = {
  routes: PropTypes.array.isRequired,
  currentTime: PropTypes.number.isRequired,
  relayEnvironment: PropTypes.object.isRequired,
};

const FavouriteRoutesWithRelayEnvironment = getRelayEnvironment(
  FavouriteRoutes,
);

const FavouritesPanel = ({ routes, currentTime }) =>
  <div className="frontpage-panel">
    <FavouriteLocationsContainer />
    <NextDeparturesListHeader />
    <div className="scrollable momentum-scroll favourites">
      <FavouriteRoutesWithRelayEnvironment
        routes={routes}
        currentTime={currentTime}
      />
    </div>
  </div>;

FavouritesPanel.propTypes = {
  routes: PropTypes.array.isRequired,
  currentTime: PropTypes.number.isRequired,
};

export default connectToStores(
  FavouritesPanel,
  ['FavouriteRoutesStore', 'TimeStore'],
  context => ({
    routes: context.getStore('FavouriteRoutesStore').getRoutes(),
    currentTime: context.getStore('TimeStore').getCurrentTime().unix(),
  }),
);
