import classNames from "classnames"
import pt from 'prop-types'


const Loader = ({ className, size, color }) => {
  return (
    <div
      className={classNames(
        'loader', 
        `loader--size--${size || 'md'}`, 
        `loader--color--${color || 'grey'}`, 
        className
      )}
    />
  )
}

Loader.propTypes = {
  color: pt.oneOf(['black', 'grey', 'white', 'blue'])
}

export default Loader
