import classNames from 'classnames'
import pt from 'prop-types'


const LoadingButton = ({ isLoading, className, restProps, classes, children, type, onClick }) => {
  return (
    <button {...restProps?.root} type={type || 'button'} className={classNames('loading-button', classes?.root, className)} disabled={isLoading} onClick={onClick}>
      {isLoading ? (
        <div
          className={classNames('loading-button__spinner', classes?.spinner)}
          {...restProps?.spinner}
        />
      ) : (
        <span className="loading-button__text">
          {children}
        </span>
      )}
    </button>
  )
}

LoadingButton.propTypes = {
  isLoading: pt.bool.isRequired,
  className: pt.string,
  restProps: pt.object,
  classes: pt.object,
  children: pt.any.isRequired,
  type: pt.oneOf(['button', 'submit']),
  onClick: pt.func
}

export default LoadingButton
