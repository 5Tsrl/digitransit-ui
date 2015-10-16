React = require 'react'

{FormattedMessage} = require('react-intl')

class TicketInformation extends React.Component

  render: ->
    <div className="itinerary-ticket-information">
      <div className="itinerary-ticket-information-buy">
        <FormattedMessage id='buy-ticket'
                          defaultMessage='Buy a ticket' />
      </div>
      <div>
        <FormattedMessage id='required-ticket'
                          defaultMessage='Ticket required for the journey' />
      </div>
      <div className="itinerary-ticket-information-price">
        : €
      </div>
    </div>

module.exports = TicketInformation
