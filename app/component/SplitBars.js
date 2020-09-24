import PropTypes from 'prop-types';
import React from 'react';
import ComponentUsageExample from './ComponentUsageExample';

const SplitBars = ({ children }) => {
  let splits = [];
  children.forEach((child, index) => {
    splits.push(<div className="split-bar" key={'sb'+index}>{child}</div>);
    splits.push(<div className="split-bar--bar"  key={'sbb'+index}/>);
  });
  splits = splits.splice(0, splits.length - 1);
  return <div className="split-bars">{splits}</div>;
};

SplitBars.displayName = 'SplitBars';

SplitBars.propTypes = {
  children: PropTypes.node.isRequired,
};

SplitBars.description = () => (
  <div>
    <p>Splits its children with a vertical bar.</p>
    <ComponentUsageExample>
      <SplitBars>
        <span>1</span>
        <span>2</span>
        <span>3</span>
      </SplitBars>
    </ComponentUsageExample>
  </div>
);

export default SplitBars;
