import classNames from "classnames"


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

export default Loader
