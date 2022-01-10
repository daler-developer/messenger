import classNames from "classnames"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { selectAlert, uiActions } from "redux/reducers/uiReducer"


export default () => {

  const dispatch = useDispatch()

  const alert = useSelector((state) => selectAlert(state))

  useEffect(() => {
    if (!alert.isHidden) {
      setTimeout(() => {
        dispatch(uiActions.closeAlert())
      }, 2000)
    }
  }, [alert.isHidden])


  return (
    <div
      role="alert-box"
      className={classNames('alert', {
        'alert--hidden': alert.isHidden,
        'alert--success': alert?.type === 'success',
        'alert--error': alert?.type === 'error' 
      })}
    >
      {alert?.text}
    </div>
  )
}
