import classNames from 'classnames'
import pt from 'prop-types'
import Icon from './Icon'


const PopupMenuBtn = ({ children, icon, className, onClick }) => {
  return (
    <button type="button" className={classNames('popup-menu-btn', className)} onClick={onClick}>

      <Icon className="popup-menu-btn__icon">{icon}</Icon>

      <span className="">
        {children}
      </span>

    </button>
  )
}

PopupMenuBtn.propTypes = {
  children: pt.string.isRequired,
  icon: pt.string.isRequired,
  classname: pt.string,
  onClick: pt.func.isRequired
}

export default PopupMenuBtn
