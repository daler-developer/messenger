import classNames from 'classnames'
import { useRef } from 'react'
import useOnClickOutside from 'hooks/useOnClickOutside'
import pt from 'prop-types'



const PopupMenu = ({ children, isHidden, className, onClose }) => {
  const rootRef = useRef(null)

  useOnClickOutside(rootRef, () => {
    onClose()
  }, [!isHidden])

  return (
    <div 
      className={classNames('popup-menu', { 'popup-menu--hidden': isHidden }, className)}
      ref={rootRef}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  )
}

PopupMenu.propTypes = {
  isHidden: pt.bool.isRequired,
  children: pt.any.isRequired,
  className: pt.string,
  onClose: pt.func
}

export default PopupMenu
