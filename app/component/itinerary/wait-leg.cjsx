React            = require 'react'
RouteNumber      = require '../departure/route-number'
moment           = require 'moment'
Icon             = require '../icon/icon'
intl             = require 'react-intl'
FormattedMessage = intl.FormattedMessage

class WaitLeg extends React.Component

  render: ->
    <div key={@props.index} style={{width: "100%"}} className="row itinerary-row">
      <div className="small-2 columns itinerary-time-column">
        <div className="itinerary-time-column-time">
          {moment(@props.leg.startTime).format('HH:mm')}
        </div>
        <RouteNumber mode={@props.leg.mode.toLowerCase()} vertical={true}/>
      </div>
      <div onClick={@props.focusAction} className={"small-10 columns itinerary-instruction-column " + @props.leg.mode.toLowerCase()}>
        <div className='itinerary-leg-first-row'>
          <FormattedMessage
            id='wait-message'
            values={{
              stopPlace: <b>{@props.leg.to.name}</b>
              estimatedTime: <b>{moment.duration(@props.leg.duration, 'seconds').humanize()}</b>}}
            defaultMessage='Wait for {estimatedTime} at {stopPlace}' />
          <Icon img={'icon-icon_search-plus'} className={'itinerary-search-icon'}/>
        </div>
      </div>
    </div>


module.exports = WaitLeg