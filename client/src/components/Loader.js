import classNames from "classnames"

const Loader = ({ className, dotClassName }) => {
  return (
    <div className={classNames('loader', className)}>
      <div className={dotClassName}></div>
      <div className={dotClassName}></div>
      <div className={dotClassName}></div>
      <div className={dotClassName}></div>
      <div className={dotClassName}></div>
      <div className={dotClassName}></div>
      <div className={dotClassName}></div>
      <div className={dotClassName}></div>
    </div>
  )
}

export default Loader
