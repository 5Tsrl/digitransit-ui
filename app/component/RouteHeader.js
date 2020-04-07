import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import RouteNumber from './RouteNumber';

export default function RouteHeader(props) {
  const mode = props.route.mode.toLowerCase();

  const trip = props.trip ? (
    <span className="route-header-trip">
      {props.trip.substring(0, 2)}:{props.trip.substring(2, 4)} →
    </span>
  ) : (
    ''
  );

  const routeLineText = ` ${props.route.shortName || ''}`;

  return (
    <div className={cx('route-header', props.className)}>
      <h1 className={mode}>
        <RouteNumber
          mode={mode}
          text={routeLineText}
          gtfsId={props.route.gtfsId}
          isLink={props.trip && props.pattern !== undefined}
          patternCode={props.pattern.code}
        />
        {trip}
      </h1>
    </div>
  );
}

RouteHeader.propTypes = {
  route: PropTypes.shape({
    gtfsId: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    shortName: PropTypes.string,
  }).isRequired,
  trip: PropTypes.string,
  pattern: PropTypes.shape({ code: PropTypes.string.isRequired }),
  className: PropTypes.string,
};
