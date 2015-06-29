React            = require 'react'
cloneWithProps   = require 'react/lib/cloneWithProps'
MasonryComponent = require '../util/masonry-component'

class StopCardList extends React.Component
  reloadMasonry: =>
    @refs['stop-cards-masonry'].performLayout()

  renderChildrenWithReloadMasonry: =>
    React.Children.map @props.children, (child) =>
      cloneWithProps child,
        reloadMasonry: @reloadMasonry

  render: =>
    <div className="stop-cards">
      <div className="row">
        <MasonryComponent ref="stop-cards-masonry">
          {@renderChildrenWithReloadMasonry()}
        </MasonryComponent>
      </div>
      <div className="row">
        <div className="small-10 small-offset-1 medium-6 medium-offset-3 columns">
          <button className="show-more" onTouchTap=@props.addStops>
            Näytä Lisää
          </button>
        </div>
      </div>
    </div>

module.exports = StopCardList
