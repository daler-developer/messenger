import pt from 'prop-types'
import Loader from './Loader'


const FullScreenLoader = ({ }) => {
  return (
    <div className="full-screen-loader">
      <Loader color="black" size="lg" />
    </div>
  )
}

FullScreenLoader.propTypes = {
  className: pt.string
}

export default FullScreenLoader
