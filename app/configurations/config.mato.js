const CONFIG = 'mato'
const OTP_URL = process.env.OTP_URL || 'https://mapi.5t.torino.it'
const API_URL = process.env.API_URL || 'https://mapi.5t.torino.it'
const MAP_URL = process.env.MAP_URL || 'https://a-liberty.5t.torino.it'
const PIWIK_ADDRESS = process.env.PIWIK_ADDRESS || 'https://piwik.5t.torino.it'
const PIWIK_ID = process.env.PIWIK_ID || '1'
const PORT = process.env.PORT || 8081
const APP_DESCRIPTION = 'Muoversi a Torino - Il servizio di infomobilità della Città di Torino.'
const APP_TITLE = 'Muoversi a Torino'
const WSS_MQTT_URL = process.env.WSS_MQTT_URL || 'wss://mapi.5t.torino.it/scre'

export default {
  PIWIK_ADDRESS,
  PIWIK_ID,
  PORT,
  CONFIG,

  URL: {
    OTP: `${API_URL}/routing/v1/routers/mato/`, // approxymato...
    // OTP: `${OTP_URL}/otp/routers/mato/`, // diretto otp

    MAP: `${MAP_URL}/map/v1/turin-map/`, // passando da approxymato...
    CITYBIKE_MAP: `${API_URL}/map/v1/turin-bikerental-map/`,

    // // PARK_AND_RIDE_MAP: `${MAP_URL}/map/v1/hsl-parkandride-map/`,
    // // TICKET_SALES_MAP: `${MAP_URL}/map/v1/hsl-ticket-sales-map/`,
    // ALERTS: `${API_URL}/realtime/service-alerts/v1`,
    ALERTS: ``,
    FONT: 'https://fonts.googleapis.com/css?family=Lato:300,400,900%7CPT+Sans+Narrow:400,700',
    PELIAS: `${API_URL}/geocoding/v1/suggest`,
    PELIAS_REVERSE_GEOCODER: `${API_URL}/geocoding/v1/reverse`,
  },

  contactName: {
    it: '5T',
    default: '5T srl',
    sv:'',
    fi:'',
  },

  title: APP_TITLE,

  // Default labels for manifest creation
  name: 'Muoversi a Torino', // nf
  shortName: 'Mato',

  // Navbar logo
  logo: 'mato/mato-logo.png',
  logoMobile: 'mato/mato-logo-mobile.png', // tentativo...
  textLogo: false, // title text instead of logo img

  availableLanguages: ['it', 'en', 'fr'],
  defaultLanguage: 'it',
  timezoneData:  'Europe/Rome|CET CEST|-10 -20|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2arB0 Lz0 1cN0 1db0 1410 1on0 Wp0 1qL0 17d0 1cL0 M3B0 5M20 WM0 1fA0 1cM0 16M0 1iM0 16m0 1de0 1lc0 14m0 1lc0 WO0 1qM0 GTW0 On0 1C10 LA0 1C00 LA0 1EM0 LA0 1C00 LA0 1zc0 Oo0 1C00 Oo0 1C00 LA0 1zc0 Oo0 1C00 LA0 1C00 LA0 1zc0 Oo0 1C00 Oo0 1zc0 Oo0 1fC0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|39e5',

  mainMenu: {
    // Whether to show the left menu toggle button at all
    show: true,
    showDisruptions: false,
    showInquiry: false,
    // showLoginCreateAccount: true,
    showOffCanvasList: true,
  },

  favicon: `./sass/themes/${CONFIG}/favicon.png`,
  sprites: `assets/svg-sprite.${CONFIG}.svg`,
  feedIds: ['gtt'],

  realTime: {
    /* sources per feed Id */
    gtt: {
      mqtt: WSS_MQTT_URL,
      routeSelector: function selectRoute(routePageProps) {
        const route = routePageProps.route.gtfsId.split(':');
        return route[1].slice(0, -1); // 5t tolgo la U
      },
      active: true,
    },
  },

  /*
   * by default search endpoints from all but gtfs sources, correct gtfs source
   * figured based on feedIds config variable
   */
  searchSources: [],

  search: {
    suggestions: {
      useTransportIcons: false,
    },
    usePeliasStops: false,
    mapPeliasModality: false,
    peliasMapping: { },
    peliasLayer: null,
    peliasLocalization: null,
  },

  preferredAgency: 'gtt',
  defaultMapCenter: {
    lat: 45.07140,
    lon: 7.68574,
  },

  map: {
    useRetinaTiles: true,
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    maxZoom: 21, // 18,  // 21 è il max a cui viene servita la turin-bikerental-map
    controls: {
      zoom: {
        // available controls positions: 'topleft', 'topright', 'bottomleft, 'bottomright'
        position: 'bottomleft',
      },
      scale: {
        position: 'bottomright',
      },
    },
    genericMarker: {
      // Do not render name markers at zoom levels below this value
      nameMarkerMinZoom: 18,

      popup: {
        offset: [106, 16],
        maxWidth: 250,
        minWidth: 250,
      },
    },

    line: {
      halo: {
        weight: 7,
        thinWeight: 4,
      },

      leg: {
        weight: 5,
        thinWeight: 2,
      },

      passiveColor: '#758993',
    },

    useModeIconsInNonTileLayer: false,
  },
  nearbyRoutes: { // configurazione nearyou
    radius: 500,
    results: 49,
    timeRange: 3600,
    bucketSize: 1000, // non letto da nessuna parte
  },

  maxWalkDistance: 3000,
  maxBikingDistance: 50000,
  /* parkAndRide: {
    showParkAndRide: true,
    parkAndRideMinZoom: 14,
  },

  ticketSales: {
    showTicketSales: true,
    ticketSalesMinZoom: 16,
  }, */

  cityBike: {
    showStationId: true, // visualizza cod staz su CityBikeCard
    showCityBikes: true, // visualizza in selectMapLayerDialog

    useUrl: {
      it: 'http://www.tobike.it',
      en: 'http://www.tobike.it',
      fr: 'http://www.tobike.it',
      fi:'',
      sv:''
    },

    infoUrl: {
      it: 'http://www.tobike.it/frmCose.aspx',
      en: 'http://www.tobike.it/frmCose.aspx',
      fr: 'http://www.tobike.it/frmCose.aspx',
      fi: '',
      sv: '',
    },

    cityBikeMinZoom: 17,
    cityBikeSmallIconZoom: 16,
    // When should bikeshare availability be rendered in orange rather than green
    fewAvailableCount: 3,

    networks: {
      tobike: {
        type: 'citybike',
        icon: 'tobike',
        name: {
          it: '[TO]BIKE',
          en: '[TO]BIKE',
        },
        url: {
          it: 'http://www.tobike.it',
          en: 'http://www.tobike.it',
        },
      },
      helbizebike: {
        type: 'citybike',
        icon: 'ebike',
        name: {
          it: 'Helbiz e-bike',
          en: 'Helbiz e-bike',
        },
        url: {
          it: 'https://helbiz.com/go',
          en: 'https://helbiz.com/go',
        },
        brandColor: '#ff0000',
        brandTextColor: '#fff',
      },
      /* mobike: {
        type: 'citybike',
        icon: 'citybike-withoutBox',
        name: {
          it: 'Mobike',
          en: 'Mobike',
        },
        url: {
          it: 'http://mobike.com',
          en: 'http://mobike.com',
        },
        brandColor: '#ff4611',
      }, */
      bird: {
        type: 'scooter',
        icon: 'scooter',
        name: {
          it: 'Bird',
          en: 'Bird',
        },
        url: {
          it: 'https://www.bird.co',
          en: 'https://www.bird.co',
        },
        brandColor: '#fefefe',
      },
      bit: {
        type: 'scooter',
        icon: 'scooter',
        name: {
          it: 'Bit Mobility',
          en: 'Bit Mobility',
        },
        url: {
          it: 'https://www.bitmobility.it/app-monopattino-elettrico-torino',
          en: 'https://www.bitmobility.it/app-monopattino-elettrico-torino',
        },
        brandColor: '#003BCC',
        brandTextColor: '#fff',
      },
      dott: {
        type: 'scooter',
        icon: 'scooter',
        name: {
          it: 'Dott',
          en: 'Dott',
        },
        url: {
          it: 'https://ridedott.com/',
          en: 'https://ridedott.com/',
        },
        rental_uri: 'https://v.ridedott.com/######?platform=android&client_id=muoversiatorino',
        brandColor: '#9bf3db',
      },
      helbiz: {
        type: 'scooter',
        icon: 'scooter',
        name: {
          it: 'Helbiz',
          en: 'Helbiz',
        },
        url: {
          it: 'https://helbiz.com/go',
          en: 'https://helbiz.com/go',
        },
        brandColor: '#212529',
        brandTextColor: '#fff',
      },
      lime: {
        type: 'scooter',
        icon: 'scooter',
        name: {
          it: 'Lime',
          en: 'Lime',
        },
        url: {
          it: 'https://www.li.me',
          en: 'https://www.li.me',
        },
        brandColor: '#00dd00',
      },

      // car-sharing
      bluetorino: {
        type: 'car',
        icon: 'bluetorino',
        name: {
          it: 'Bluetorino',
          en: 'Bluetorino',
        },
        url: {
          it: 'https://www.bluetorino.eu/',
          en: 'https://www.bluetorino.eu/',
        },
        brandColor: '#00dd00',
      },

    },
  },

  // Lowest level for stops and terminals are rendered
  stopsMinZoom: 14,
  // Highest level when stops and terminals are still rendered as small markers
  stopsSmallMaxZoom: 14,
  // Highest level when terminals are still rendered instead of individual stops
  terminalStopsMaxZoom: 18,
  terminalStopsMinZoom: 12,
  terminalNamesZoom: 16,
  stopsIconSize: {
    small: 8,
    selected: 28,
    default: 18,
  },

  appBarLink: {  name: 'Città di Torino', href: 'http://www.comune.torino.it'},

  colors: {
    // _primary: '#2795e7',
    primary: '#fcfcfc', // usato come background splash_screen (uguale a barra header mato)
  },

  disruption: {
    showInfoButton: false,
  },

  agency: {
    show: true,
  },

  socialMedia: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,

    image: {
      url: '/img/mato-social-share.png',
      width: 512,
      height: 512,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@5tlive',
    },
  },

  meta: {
    description: APP_DESCRIPTION,
    keywords: 'Torino, muoversi, calcolo percorso, linee, bus, tram, metro, trasporti pubblici, mobilità,fermate, orari, mappa, trasporti',
  },

  transportModes: {
    // bicycle: {   //questa key arriva alla variabile graphql filterByModes, dove vorrebbe BICYCLE
    citybike: {
      availableForSelection: true,
      defaultValue: false,
    },

    airplane: {
      availableForSelection: false,
      defaultValue: false,
    },

    ferry: {
      availableForSelection: false,
      defaultValue: false,
    },
  },

  streetModes: {
    walk: {
      availableForSelection: true,
      defaultValue: true,
      icon: 'walk',
    },

    bicycle: {
      availableForSelection: true,
      defaultValue: false,
      icon: 'bicycle-withoutBox',
    },

    car: {
      availableForSelection: true,
      defaultValue: false,
      icon: 'car-withoutBox',
    },

    car_park: {
      availableForSelection: false,
      defaultValue: false,
      icon: 'car_park-withoutBox',
    },
  },

  customizeSearch: {
    walkReluctance: {
      available: true,
    },

    walkBoardCost: {
      available: true,
    },

    transferMargin: {
      available: false,
    },

    walkingSpeed: {
      available: false,
    },
    // 5t false
    ticketOptions: {
      available: false,
    },

    accessibility: {
      available: true,
    },
  },

  ticketOptions: [{
    displayName: 'Tariffazione a zone',
    value: '0',
  }],

  areaPolygon: [
    [7.0, 45.5],
    [8.0, 45.5],
    [8.0, 44.8],
    [7.0, 44.8],
    [7.0, 45.5],
  ],

  footer: {
    content: [
      { name: 'about-this-service',  nameEn: 'About service', href: 'http://www.muoversiatorino.it/it/servizio',icon: 'icon-icon_info'  },
      { name: 'faq', nameEn: 'Faq',  href: 'http://www.muoversiatorino.it/it/faq', icon: 'icon-icon_info' },
      { name: 'disclaimer', nameEn: 'Disclaimer', href: 'http://www.muoversiatorino.it/it/disclaimer', icon: 'icon-icon_caution'},
      ],
    powered: [
      { label: 'powered by 5T' , href: 'http://www.5t.torino.it',icon: 'icon-icon_5t'  },
    ],
  },

  defaultEndpoint: {
    address: 'Piazza Castello, Torino',
    lat: 45.07140,
    lon: 7.68574,
  },

  defaultOrigins: [
    // { icon: 'icon-icon_place_bpl', label: 'Vai alla mappa', lat: 45.07140, lon: 7.68574 },
    { icon: 'icon-icon_rail', label: 'Torino Porta Susa', lat: 45.07193, lon: 7.66646 },
    { icon: 'icon-icon_rail', label: 'Torino Porta Nuova', lat: 45.0609, lon: 7.6775 },
    { icon: 'icon-icon_airplane', label: 'Aeroporto Torino Caselle', lat: 45.1920, lon: 7.6427 },
  ],

  shouldShowIntro: false,

  // redirectReittiopasParams: true,

  staticMessages: [{
    id: 2,

    content: {
      it:
      [
          // { type: 'heading', content: 'Nuovo calcolo percorsi!'},
          { type: 'text', content: 'Utilizziamo i cookie per migliorare il servizio. Se prosegui acconsenti all\'utilizzo dei cookie.'},
          { type: 'a', content: 'Maggiori info', href: 'https://www.muoversiatorino.it/it/cookie-policy/' },
      ],
      en:
      [
          { type: 'text', content: 'We use cookies to improve our services. By using this site, you agree to its use of cookies. Read more: ' },
          { type: 'a', content: 'Disclaimer', href: 'https://www.muoversiatorino.it/en/cookie-policy/' },
      ],

      fr:
      [
         { type: 'text', content: 'Bienvenue dans le nouveau planificateur de voyage de Torino. Essayez les nouvelles fonctionnalités et envoyez-nous vos commentaires. Nous mettons à jour régulièrement le service.' },
         { type: 'a', content: 'Disclaimer', href: 'https://www.muoversiatorino.it/en/cookie-policy/' },
     ],

    },
  }],
  themeMap: {
    mato: 'mato',
  },
  piwikMap: [
    { id: '10', expr: '' },
    { id: '11', expr: '' },
    { id: '12', expr: '' },
    { id: '13', expr: '' },
    { id: '5', expr: '' },
    { id: '4', expr: '' },
    { id: '7', expr: '' },
    { id: '6', expr: '' },
    { id: '7', expr: '' },
    { id: '6', expr: '' },
  ],

  /* mapLayers: {
    citybike: false,
    parkAndRide: true,
    stop: {
      bus: true,
      ferry: true,
      rail: true,
      subway: true,
      tram: false, // 5t non lo legge
      funicular: true, // 5t non lo legge
    },
    terminal: {
      bus: true,
      rail: true,
      subway: true,
    },
    ticketSales: {
      salesPoint: true,
      servicePoint: true,
      ticketMachine: true,
    },
  }, */

  mapLayers: {
    tooltip: {
      it: 'Novità: bus e veicoli in sharing su mappa!',
      en: 'New: bus and sharing mobility on the map!',
    },
  },

  showAllBusses: true,
  showVehiclesOnStopPage: false,
};
