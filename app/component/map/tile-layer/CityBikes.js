import { VectorTile } from '@mapbox/vector-tile';
import Protobuf from 'pbf';
import Relay from 'react-relay/classic';
import pick from 'lodash/pick';

import { isBrowser } from '../../../util/browser';
import {
  drawAvailabilityValue,
  drawColoredBadge, // 5t
  drawIcon,
  drawRoundIcon,
  drawCitybikeNotInUseIcon,
  getMapIconScale,
} from '../../../util/mapIconUtils';

import {
  BIKESTATION_ON,
  BIKESTATION_OFF,
  BIKESTATION_CLOSED,
  getCityBikeNetworkConfig,
  getCityBikeNetworkIcon,
  getCityBikeNetworkId,
  getCitybikeNetworks,
} from '../../../util/citybikes';

const timeOfLastFetch = {};

class CityBikes {
  constructor(tile, config) {
    this.tile = tile;
    this.config = config;

    this.scaleratio = (isBrowser && window.devicePixelRatio) || 1;
    this.citybikeImageSize =
      20 * this.scaleratio * getMapIconScale(this.tile.coords.z);
    this.availabilityImageSize =
      14 * this.scaleratio * getMapIconScale(this.tile.coords.z);

    this.promise = this.fetchWithAction(this.fetchAndDrawStatus);
  }

  fetchWithAction = actionFn =>
    fetch(
      `${this.config.URL.CITYBIKE_MAP}` +
        `${this.tile.coords.z + (this.tile.props.zoomOffset || 0)}/` +
        `${this.tile.coords.x}/${this.tile.coords.y}.pbf`,
    ).then(res => {
      if (res.status !== 200) {
        return undefined;
      }
      // 5t  serve per filtrare solo le network abilitate nel SelectMapLayerDialog
      const choosenNetworks = getCitybikeNetworks(null/* router.location */, this.config)

      return res.arrayBuffer().then(
        buf => {
          const vt = new VectorTile(new Protobuf(buf));

          this.features = [];

          if (vt.layers.stations != null) {
            for (
              let i = 0, ref = vt.layers.stations.length - 1;
              i <= ref;
              i++
            ) {
              const feature = vt.layers.stations.feature(i);
              // console.log(feature.properties.networks)
              // 5t qui devo filtrare solo le network abilitate SelectMapLayerDialog
              if(!choosenNetworks.includes(feature.properties.networks)){ continue; }
              [[feature.geom]] = feature.loadGeometry();
              this.features.push(pick(feature, ['geom', 'properties']));
            }
          }
          this.features.forEach(actionFn);
        },
        err => console.log(err), // eslint-disable-line no-console
      );
    });

  // 5t disegno solo, senza più chiamare graphql (ho già tutte le info dal mapserver)
  drawStatus = ({ geom, properties: { id } }) => {
    console.log('geom', geom)
    console.log('properties', properties)
    if (
      this.tile.coords.z <= this.config.cityBike.cityBikeSmallIconZoom
    ) {
      let mode;
      if (result.state !== BIKESTATION_ON) {
        mode = 'citybike-off';
      } else {
        mode = 'citybike';
      }
      return drawRoundIcon(this.tile, geom, mode);
    }
    const cityBikeNetworkConfig = getCityBikeNetworkConfig(
      getCityBikeNetworkId(result.networks),
      this.config,
    );
    const iconName = getCityBikeNetworkIcon(cityBikeNetworkConfig);
    // console.log('iconName', iconName);
    const { brandColor, brandTextColor } = cityBikeNetworkConfig;

    if (
      result.state === BIKESTATION_CLOSED ||
      result.state === BIKESTATION_OFF
    ) {
      return drawIcon(
        iconName,
        this.tile,
        geom,
        this.citybikeImageSize,
      ).then(() =>
        drawCitybikeNotInUseIcon(
          this.tile,
          geom,
          this.citybikeImageSize,
          this.availabilityImageSize,
          this.scaleratio,
        ),
      );
    }

    if (result.state === BIKESTATION_ON) {
      // console.log('---BIKESTATION_ON result:', result)
      if (!result.isFloatingBike) { // è una stazione tobike
        return drawIcon(
          iconName,
          this.tile,
          geom,
          this.citybikeImageSize,
        ).then(() => {
          drawAvailabilityValue(
            this.tile,
            geom,
            result.bikesAvailable,
            this.citybikeImageSize,
            this.availabilityImageSize,
            this.scaleratio,
          );
        });
      } else if (result.networks.includes('mobike')) {//è una stazione mobike, disegno solo bici senza badge
        return drawIcon(
          iconName,
          this.tile,
          geom,
          this.citybikeImageSize,
        )
      }
      // console.log(result.networks)
      // rimangono solo più i monopattini, badge colore-lettera
      return drawIcon(
        iconName,
        this.tile,
        geom,
        this.citybikeImageSize,
      ).then(() => {
        drawColoredBadge(
          this.tile,
          geom,
          result.networks[0].charAt(0).toUpperCase(),
          this.citybikeImageSize,
          this.availabilityImageSize,
          this.scaleratio,
          brandColor,
          brandTextColor,
        );
      });
    }


  };

  fetchAndDrawStatus = ({ geom, properties }) => {
    const {id} = properties
    // console.log('properties', properties )

    const cityBikeNetworkConfig = getCityBikeNetworkConfig(
      getCityBikeNetworkId(properties.networks),
      this.config,
    )

    const iconName = getCityBikeNetworkIcon(cityBikeNetworkConfig);
    // console.log('iconName', iconName);
    const {brandColor, brandTextColor} = cityBikeNetworkConfig;

    if(false && 'bird,bit,dott,helbiz,hive,lime'.includes(properties.networks)){

               // console.log(result.networks)
            // rimangono solo più i monopattini, badge colore-lettera
            return drawIcon(
              iconName,
              this.tile,
              geom,
              this.citybikeImageSize,
            ).then(() => {
              drawColoredBadge(
                this.tile,
                geom,
                // result.networks[0].charAt(0).toUpperCase(),
                properties.networks.charAt(0).toUpperCase(),
                this.citybikeImageSize,
                this.availabilityImageSize,
                this.scaleratio,
                brandColor,
                brandTextColor,
              );
            });


    }



    const query = Relay.createQuery(
      Relay.QL`
    query Test($id: String!){
      bikeRentalStation(id: $id) {
        bikesAvailable
        spacesAvailable
        networks
        state
        isFloatingBike
        isCarStation
      }
    }`,
      { id },
    );

    const lastFetch = timeOfLastFetch[id];
    const currentTime = new Date().getTime();

    const callback = readyState => {
      if (readyState.done) {
        timeOfLastFetch[id] = new Date().getTime();
        const result = Relay.Store.readQuery(query)[0];
        // console.log('z:', this.tile.coords.z)
        if (result) {
          if (result.networks.includes('bluetorino')) {
            // console.log('- bluetorino')
          }
          if (
            this.tile.coords.z <= this.config.cityBike.cityBikeSmallIconZoom
          ) {
            let mode;
            if (result.state !== BIKESTATION_ON) {
              mode = 'citybike-off';
            } else {
              mode = 'citybike';
            }
            return drawRoundIcon(this.tile, geom, mode);
          }
          const cityBikeNetworkConfig = getCityBikeNetworkConfig(
            getCityBikeNetworkId(result.networks),
            this.config,
          );
          const iconName = getCityBikeNetworkIcon(cityBikeNetworkConfig);

          const {brandColor, brandTextColor} = cityBikeNetworkConfig;

          if (
            result.state === BIKESTATION_CLOSED ||
            result.state === BIKESTATION_OFF
          ) {
            return drawIcon(
              iconName,
              this.tile,
              geom,
              this.citybikeImageSize,
            ).then(() =>
              drawCitybikeNotInUseIcon(
                this.tile,
                geom,
                this.citybikeImageSize,
                this.availabilityImageSize,
                this.scaleratio,
              ),
            );
          }

          if (result.state === BIKESTATION_ON) {
            // console.log('---BIKESTATION_ON result:', result)
            if (!result.isFloatingBike && !result.networks.includes('helbizebike')) { // è una stazione tobike
              return drawIcon(
                iconName,
                this.tile,
                geom,
                this.citybikeImageSize,
              ).then(() => {
                drawAvailabilityValue(
                  this.tile,
                  geom,
                  result.bikesAvailable,
                  this.citybikeImageSize,
                  this.availabilityImageSize,
                  this.scaleratio,
                );
              });
            } else if (result.networks.includes('mobike') || result.networks.includes('helbizebike') ){//è una stazione mobike, disegno solo bici senza badge
              return drawIcon(
                iconName,
                this.tile,
                geom,
                this.citybikeImageSize,
              )
            }
            // console.log(result.networks)
            // rimangono solo più i monopattini, badge colore-lettera
            return drawIcon(
              iconName,
              this.tile,
              geom,
              this.citybikeImageSize,
            ).then(() => {
              drawColoredBadge(
                this.tile,
                geom,
                result.networks[0].charAt(0).toUpperCase(),
                this.citybikeImageSize,
                this.availabilityImageSize,
                this.scaleratio,
                brandColor,
                brandTextColor,
              );
            });
          }
        }
      }
      return this;
    };

    if (lastFetch && currentTime - lastFetch <= 30000) {
      Relay.Store.primeCache(
        {
          query,
        },
        callback,
      );
    } else {
      Relay.Store.forceFetch(
        {
          query,
        },
        callback,
      );
    }
  };

  onTimeChange = () => {
    if (this.tile.coords.z > this.config.cityBike.cityBikeSmallIconZoom) {
      this.fetchWithAction(this.fetchAndDrawStatus);
    }
  };

  static getName = () => 'citybike';
}

export default CityBikes;
