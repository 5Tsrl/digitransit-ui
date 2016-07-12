import config from '../../config';
import React from 'react';
import ComponentUsageExample from '../documentation/ComponentUsageExample';
const isBrowser = typeof window !== 'undefined' && window !== null;

let Marker;
let Popup;
let L;

/* eslint-disable global-require */
// TODO When server side rendering is re-enabled,
//      these need to be loaded only when isBrowser is true.
//      Perhaps still using the require from webpack?
if (isBrowser) {
  Marker = require('react-leaflet/lib/Marker');
  Popup = require('./Popup');
  L = require('leaflet');
}
/* eslint-enable global-require */


export default class GenericMarker extends React.Component {
  static description = (
    <div>
      <p>A base class for markers.</p>
      <ComponentUsageExample description="">
        <GenericMarker
          position={{ lat: 60.1626075196532, lon: 24.939603788199364 }}
          mode="citybike"
          icons={{ smallIconSvg: 'smallIcon in svg', iconSvg: 'icon in svg' }}
          iconSizes={{ smallIconSvg: [8, 8], iconSvg: [20, 20] }}
          map="leaflet map object"
          id="marker id here"
        />
      </ComponentUsageExample>
    </div>
  );

  static displayName = 'GenericMarker';

  static contextTypes = {
    map: React.PropTypes.object.isRequired,
  };

  static propTypes = {
    position: React.PropTypes.object.isRequired,
    mode: React.PropTypes.string.isRequired,
    icons: React.PropTypes.object.isRequired,
    iconSizes: React.PropTypes.object.isRequired,
    id: React.PropTypes.string,
    renderName: React.PropTypes.bool,
    selected: React.PropTypes.bool,
    name: React.PropTypes.string,
    thin: React.PropTypes.bool,
    children: React.PropTypes.node,
  };

  componentDidMount() {
    this.context.map.on('zoomend', this.onMapMove);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.id !== this.props.id;
  }

  componentWillUnmount() {
    this.context.map.off('zoomend', this.onMapMove);
  }

  onMapMove = () => this.forceUpdate();

  getIcon = (mode, selected, zoom) => L.divIcon({
    html: (() => {
      if (zoom <= config.stopsSmallMaxZoom) {
        return this.props.icons.smallIconSvg;
      } else if (selected) {
        return this.props.icons.selectedIconSvg;
      }
      return this.props.icons.iconSvg;
    })(),

    iconSize: (() => {
      if (zoom <= config.stopsSmallMaxZoom) {
        return this.props.iconSizes.smallIconSvg;
      } else if (selected) {
        return this.props.iconSizes.selectedIconSvg;
      }
      return this.props.iconSizes.iconSvg;
    })(),

    className: `${mode} cursor-pointer`,
  });


  getMarker = () => (
    <Marker
      position={{ lat: this.props.position.lat, lng: this.props.position.lon }}
      icon={this.getIcon(
        this.props.mode + (this.props.thin ? ' thin' : ''),
        this.props.selected,
        this.context.map.getZoom())
      }
    >
      <Popup
        offset={config.map.genericMarker.popup.offset}
        closeButton={false}
        maxWidth={config.map.genericMarker.popup.maxWidth}
        minWidth={config.map.genericMarker.popup.minWidth}
        className="popup"
      >
        {this.props.children}
      </Popup>
    </Marker>
  );

  getNameMarker() {
    if (
      !this.props.renderName ||
      this.context.map.getZoom() < config.map.genericMarker.nameMarkerMinZoom
    ) {
      return false;
    }

    return (
      <Marker
        key={`${this.props.name}_text`}
        position={{ lat: this.props.position.lat, lng: this.props.position.lon }}
        interactive={false}
        icon={L.divIcon({
          html: `<div>${this.props.name}</div>`,
          className: 'popup',
          iconSize: [150, 0],
          iconAnchor: [-8, 7],
        })}
      />
    );
  }

  render() {
    if (!isBrowser) {
      return '';
    }

    return (
      <div>
        {this.getMarker()}
        {this.getNameMarker()}
      </div>
    );
  }
}
