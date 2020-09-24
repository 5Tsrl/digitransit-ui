import ceil from 'lodash/ceil';
import moment from 'moment';
import { parseFeedMQTT } from './gtfsRtParser';

const standardModes = ['bus', 'tram', 'ferry'];

const getMode = mode => {
  if (standardModes.includes(mode)) {
    return mode;
  }
  if (mode === 'train') {
    return 'rail';
  }
  if (mode === 'metro') {
    return 'subway';
  }
  // bus mode should be used as fallback if mode is not one of the standard modes
  return 'bus';
};

// getTopic
// Returns a MQTT topic to be subscribed to
// Input: options - route, direction, tripStartTime are used to generate the topic
function getTopic(options, settings) {
  // console.log('5t getTopic options', options, 'settings ', settings)
  const route = options.route ? options.gtfsId.replace(/gtt\:/, '').replace(/U$/,'') : '+'; // torno alla linea semplice es 16CS !!
  // const direction = options.direction
  //   ? parseInt(options.direction, 10) + 1
  //   : '+';
  // const geoHash = options.geoHash ? options.geoHash : ['+', '+', '+', '+'];
  // const tripId = options.tripId ? options.tripId : '+';
  // const headsign = options.headsign ? options.headsign : '+';
  // const tripStartTime = options.tripStartTime ? options.tripStartTime : '+';
  // const topic = settings.mqttTopicResolver(
  //   route,
  //   direction,
  //   tripStartTime,
  //   headsign,
  //   settings.agency,
  //   tripId,
  //   geoHash,
  //   );
  //   return topic;

    // 5t return `/hfp/v1/journey/ongoing/+/+/+/${route}/${direction}/+/${tripStartTime}/#`;
    // 5t al 19/04/2020 il topic è stato semplificato ed è così strutturato:
    // 5t /bt/matricola/linea/direzione/fermata
    // return `/+/+/${route}/${direction}/+/${tripStartTime}/#`;
    return `/${route}/#`;
}
// ad oggi, 21/2/2020 topic = "/tram/6002/10/1/DEST/1081/392/45;7/06/66/01",
export function parseMessage(topic, message, agency) {
  let parsedMessage;
  const [
    ,
    // mode,
    line,
    id, // matricola del mezzo, arriva anche nel message come veh...
    // dir,(spostato nel messaggio)
    // headsign, // eslint-disable-line no-unused-vars
    // nextStop, // è quello usato per posizionare il mezzo nella vista linearizzata es gtt:1680 (spostato nel messaggio)
    // startTime,
    ...rest // eslint-disable-line no-unused-vars
  ] = topic.split('/');

  // 5t const vehid = `${agency}_${id}`;
  const vehid = `${id}`;

  // 5t /bus/1072/5/2/31/1072
  if (message instanceof Uint8Array) { // mqtt
    // parsedMessage = JSON.parse(message); // .VP;
    const compat = JSON.parse(message)
    parsedMessage = {
      lat:    compat[0],
      long:   compat[1],
      hdg:    compat[2],
      spd:    compat[3],
      tripId: compat[4],
      dir: compat[5],
      nextStop: `gtt:${compat[6]}`,  //riaggiungo prefisso gtt: strippato lato server
    }
  } else {
    // 5t parsedMessage = message.VP;  //json via rest
    parsedMessage = message;
  }
  // console.log('startTime',startTime !== 'undefined' ? startTime : undefined )
// console.log('parsedMessage', parsedMessage)


  if (
    parsedMessage &&
    parsedMessage.lat &&
    parsedMessage.long &&
    (parsedMessage.seq === undefined || parsedMessage.seq === 1) // seq is used for hsl metro carriage sequence
  ) {

    return {
      id: vehid,
      // 5t route: `${agency}:${line}`,
      // route: `${agency}:${line}U`, // in gtfs le linee gtt hanno suffisso U E
      route: `gtt:${line}U`, // in otp le le linee hanno prefisso feedId e suffisso U E,
      // 5t direction: parseInt(dir, 10) - 1,
      direction: parseInt(parsedMessage.dir, 10),
      // tripStartTime: startTime !== 'undefined' ? startTime : undefined,  // deciso di non trasmetterlo più
      tripStartTime: undefined,
      // 5t operatingDay:
      //   parsedMessage.oday && parsedMessage.oday !== 'XXX'
      //     ? parsedMessage.oday
      //     : moment().format('YYYY-MM-DD'),
      operatingDay:  parsedMessage.oday ? parsedMessage.oday : moment().format('YYYYMMDD'),
      // 5t mode: modeTranslate[mode] ? modeTranslate[mode] : mode,
      mode: id > 5000 ? 'tram' :'bus', // non lo mando più, lo desumo dalla matricola
      next_stop: parsedMessage.nextStop,
      timestamp: moment().unix(), //parsedMessage.tsi, // assumo che la posizione sia generata nel momento della ricezione
      lat: parsedMessage.lat && ceil(parsedMessage.lat, 5),
      long: parsedMessage.long && ceil(parsedMessage.long, 5),
      heading: parsedMessage.hdg, // 0: nord, orario
      headsign: undefined, // in HSL data headsign from realtime data does not always match gtfs data
      tripId: parsedMessage.tripId ? `${agency}:${parsedMessage.tripId}U` : null, // 5t da noi il tripId (se arriva)arriva già dal feed mqtt, non need for FuzzyTrip... // in gtfs le trip gtt hanno suffisso U E
      speed: parsedMessage.spd,
      shortName: parsedMessage.shortName, // se presente, è usato nel pallozzo come nome linea
    };
  }
  return undefined;
}

export function changeTopics(settings, actionContext) {
  const { client, oldTopics } = settings;

  if (Array.isArray(oldTopics) && oldTopics.length > 0) {
    client.unsubscribe(oldTopics);
  }
  const topics = settings.options.map(option => getTopic(option, settings));
  // console.log('****settings.options', settings.options); // 5t
  console.log('topic changed', topics); // 5t
  // set new topic to store
  actionContext.dispatch('RealTimeClientNewTopics', topics);
  client.subscribe(topics);
}

export function startMqttClient(settings, actionContext) {
  const options = settings.options || [{}];
  const topics = options.map(option => getTopic(option, settings));
  const mode = options.length && options[0].mode ? options[0].mode : 'bus';

  return import(/* webpackChunkName: "mqtt" */ 'mqtt').then(mqtt => {
    // SE GTFSRT
    if (settings.gtfsrt) {
      return import(/* webpackChunkName: "gtfsrt" */ './gtfsrt').then(
        bindings => {
          const feedReader = bindings.FeedMessage.read;
          const credentials =
            settings.credentials !== undefined ? settings.credentials : {};
          const client = mqtt.default.connect(settings.mqtt, credentials);
          client.on('connect', () => client.subscribe(topics));
          // console.log('subscribed with topic', topics); // 5t

          client.on('message', (topic, messages) => {
            const parsedMessages = parseFeedMQTT(
              feedReader,
              messages,
              topic,
              settings.agency,
              mode,
            );
            parsedMessages.forEach(message => {
              actionContext.dispatch('RealTimeClientMessage', message);
            });
          });

          return { client, topics };
        },
      );
    }
    // SE MQTT
    const client = mqtt.default.connect(settings.mqtt);
    // console.log('subscribed with topic', topics); // 5t
    client.on('connect', () => client.subscribe(topics));
    client.on('message', (topic, message) =>
      actionContext.dispatch(
        'RealTimeClientMessage',
        parseMessage(topic, message, settings.agency),
      ),
    );
    return { client, topics };
  });
}
