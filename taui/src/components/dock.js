// @flow
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import {PureComponent} from 'react'

import type {PointFeature} from '../types'

type Props = {
  geocode: (string, Function) => void,
  neighborhoods: Array<PointFeature>,
  reverseGeocode: (string, Function) => void,
  showSpinner: boolean
}

/**
 * Sidebar content.
 */
export default class Dock extends PureComponent<Props> {
  props: Props

  constructor (props) {
    super(props)

    this.state = {
      componentError: props.componentError,
      neighborhoods: props.neighborhoods,
      neighborhoodRoutes: props.neighborhoodRoutes
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.neighborhoods &&
      (!this.state.neighborhoods || !this.state.neighborhoods.length)) {
      const neighborhoods = [Object.assign({}, nextProps.neighborhoods)]
      this.setState({neighborhoods: neighborhoods})
    }

    if (nextProps.neighborhoodRoutes && nextProps.neighborhoodRoutes.length) {
      console.log('got neighborhood routes')
      console.log(nextProps.neighborhoodRoutes)
      this.setState({neighborhoodRoutes: [Object.assign({}, nextProps.neighborhoodRoutes)]})
    }
  }

  render () {
    const {children, showSpinner} = this.props
    const {componentError} = this.state

    return <div className='Taui-Dock'>
      <div className='Taui-Dock-content'>
        <div className='title'>
          {showSpinner
            ? <Icon type='spinner' className='fa-spin' />
            : <Icon type='map' />}
          {' '}
          {message('Title')}
        </div>
        {componentError &&
          <div>
            <h1>Error</h1>
            <p>componentError.info}</p>
          </div>}
        {children}
      </div>
    </div>
  }
}
