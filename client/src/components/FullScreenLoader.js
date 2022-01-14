import pt from 'prop-types'


const FullScreenLoader = ({ }) => {
  return (
    <div className="full-screen-loader">
      <div className="full-screen-loader__loader" />
    </div>
  )
}

FullScreenLoader.propTypes = {
  className: pt.string
}

export default FullScreenLoader
