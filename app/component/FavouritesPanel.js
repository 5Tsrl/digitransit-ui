import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import connectToStores from 'fluxible-addons-react/connectToStores';
import FavouriteRouteListContainer from './FavouriteRouteListContainer';
import FavouriteLocationsContainer from './FavouriteLocationsContainer';
import NextDeparturesListHeader from './NextDeparturesListHeader';
import NoFavouritesPanel from './NoFavouritesPanel';
import Loading from './Loading';
import PanelOrSelectLocation from './PanelOrSelectLocation';
import { dtLocationShape } from '../util/shapes';
import { TAB_FAVOURITES } from '../util/path';

class FavouriteRouteListContainerRoute extends Relay.Route {
  static queries = {
    routes: (Component, variables) => Relay.QL`
      query {
        routes (ids:$ids) {
          ${Component.getFragment('routes', {
            ids: variables.ids,
          })}
    }}`,
  };
  static paramDefinitions = {
    ids: { required: true },
  };
  static routeName = 'FavouriteRouteRowRoute';
}

const FavouriteRoutes = ({ routes, origin }) => {
  if (routes.length > 0) {
    return (
      <Relay.RootContainer
        Component={FavouriteRouteListContainer}
        forceFetch
        route={
          new FavouriteRouteListContainerRoute({
            ids: routes,
            origin,
          })
        }
        renderLoading={Loading}
      />
    );
  }
  return <NoFavouritesPanel />;
};

FavouriteRoutes.propTypes = {
  routes: PropTypes.array.isRequired,
  origin: dtLocationShape.isRequired,
};

const FavouritesPanel = ({ origin, routes }) => (
  <div className="frontpage-panel">
    <FavouriteLocationsContainer origin={origin} />
    <NextDeparturesListHeader />
    <div className="scrollable momentum-scroll favourites">
      <FavouriteRoutes routes={routes} origin={origin} />
    </div>
  </div>
);

FavouritesPanel.propTypes = {
  routes: PropTypes.array.isRequired,
  origin: dtLocationShape.isRequired, // eslint-disable-line react/no-typos
};

export default connectToStores(
  ctx => (
    <PanelOrSelectLocation
      panel={FavouritesPanel}
      panelctx={{ ...ctx, tab: TAB_FAVOURITES }}
    />
  ),
  ['FavouriteRoutesStore'],
  context => ({
    routes: context.getStore('FavouriteRoutesStore').getRoutes(),
  }),
);
