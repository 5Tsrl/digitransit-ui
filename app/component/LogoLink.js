import React from 'react';
import PropTypes from 'prop-types';
import ComponentUsageExample from './ComponentUsageExample';
import Icon from './Icon';

const LogoLink = ({href, className }) => (
  <a onClick={e => e.stopPropagation()}  href={href} ><div className={className}></div></a>
);

LogoLink.propTypes = {
  href: PropTypes.string,
  className: PropTypes.string,
};

LogoLink.defaultProps = {
  className: '',
};

LogoLink.displayName = 'LogoLink';

LogoLink.description = () => (
  <div>
    <p>
      Logo with external Link
    </p>
    <ComponentUsageExample description="with text only">
      <span style={{ background: '#007ac9', padding: '10px 10px 10px 10px' }}>
        <LogoLink className="external-top-bar"  href="http://www.5t.torino.it" />
      </span>
    </ComponentUsageExample>
  </div>);

export default LogoLink;
