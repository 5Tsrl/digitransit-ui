import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import { PREFIX_ROUTES } from '../util/path';
import RouteNumber from './RouteNumber';
import Icon from './Icon';
import IconWithCaution from './IconWithCaution';


export default function RouteHeader(props) {
  const mode = props.route ? props.route.mode.toLowerCase() : 'bus';

  const trip = props.trip ? (
    <span className="route-header-trip">
      {/* 5t {props.trip.substring(0, 2)}:{props.trip.substring(2, 4)} → */}
      matricola {props.trip}
    </span>
  ) : (
    ''
  );

  let wcIcon
  if (props.accessible === 'POSSIBLE' )
    wcIcon= <Icon key='wc' className='wheelchair' img="icon-icon_wheelchair" />
  else if (props.accessible === 'NOT_POSSIBLE')
    wcIcon= <IconWithCaution key='wc' className='wheelchair' img="icon-icon_wheelchair" />

  const accessibleIcon = props.accessible ?
    (<span className="route-header-accessible-trip">
        {wcIcon}
    </span>) : '';

  const routeLineText = ` ${props.route && props.route.shortName || ''}`;

  // DT-3331: added query string sort=no to Link's to
  const routeLine =
    props.trip && props.pattern ? (
      <Link
        to={`/${PREFIX_ROUTES}/${props.route.gtfsId}/stops/${
          props.pattern.code
        }?sort=no`}
      >
        {routeLineText}
      </Link>
    ) : (
      routeLineText
    );

  return (
    <div className={cx('route-header', props.className)}>
      <h1 className={mode}>
        <RouteNumber mode={mode} text={routeLine} gtfsId={'-'/*5t non usato props.route.gtfsId*/} />
        {trip}
        {accessibleIcon}
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
  accessible: PropTypes.string,
};
