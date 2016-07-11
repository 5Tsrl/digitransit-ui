import React from 'react';
import Icon from '../icon/icon';
import ComponentUsageExample from '../documentation/ComponentUsageExample';
import cx from 'classnames';

const Favourite = ({ addFavourite, favourite }) => (
  <span className="cursor-pointer favourite-icon" onClick={addFavourite}>
    <Icon className={cx('favourite', { selected: favourite })} img="icon-icon_star" />
  </span>);

Favourite.propTypes = {
  addFavourite: React.PropTypes.func.isRequired,
  favourite: React.PropTypes.bool,
};

Favourite.description = (
  <div>
    <p>
      {`This component shows whether an entity is a favourite
        and allows the user to toggle the favourite status on/off.`}
    </p>
    <ComponentUsageExample description="entity is favourite">
      <Favourite addFavourite={() => {}} favourite />
    </ComponentUsageExample>
    <ComponentUsageExample description="entity is not favourite">
      <Favourite addFavourite={() => {}} />
    </ComponentUsageExample>
  </div>);

export default Favourite;
