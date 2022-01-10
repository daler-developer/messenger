import classNames from 'classnames'
import pt from 'prop-types'
import { useMemo } from 'react'
import Loader from './Loader'


const LoadingButton = ({ disabled, isLoading, className, restProps, classes, children, type, onClick, loaderProps }) => {

  const isDisabled = useMemo(() => {
    if (isLoading) {
      return true
    } else if (!isLoading && disabled) {
      return true
    }
    return false
  }, [disabled, isLoading])

  return (
    <button 
      {...restProps?.root} 
      type={type || 'button'} 
      className={classNames('loading-button', classes?.root, className)} 
      disabled={isDisabled} 
      onClick={onClick}
    >
      {isLoading ? (
        <Loader size="sm" color="white" {...loaderProps} />
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
  onClick: pt.func,
  loaderProps: pt.object,
  disabled: pt.bool
}

export default LoadingButton
