import React, { PropTypes } from 'react';
import TransitLeg from './TransitLeg';
import { FormattedMessage } from 'react-intl';

const AirplaneLeg = ({ leg, focusAction, index }) => (
  <TransitLeg
    mode="AIRPLANE"
    leg={leg}
    focusAction={focusAction}
    index={index}
  >
    <FormattedMessage
      id="airplane-with-route-number"
      values={{
        routeNumber: leg.route && leg.route.shortName,
      }}
      defaultMessage="Flight {routeNumber}"
    />
  </TransitLeg>
);

AirplaneLeg.propTypes = {
  leg: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  focusAction: PropTypes.func.isRequired,
};

export default AirplaneLeg;
