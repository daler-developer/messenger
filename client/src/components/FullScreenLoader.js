import classNames from 'classnames'
import pt from 'prop-types'
import Loader from './Loader'


const FullScreenLoader = ({ className }) => {
  return (
    <div className={classNames('full-screen-loader', className)} role="full-screen-loader">
      <Loader color="black" size="lg" />
    </div>
  )
}

FullScreenLoader.propTypes = {
  className: pt.string
}

export default FullScreenLoader
