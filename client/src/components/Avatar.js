import classNames from "classnames"
import pt from 'prop-types'
import userImg from 'assets/user.png'


const Avatar = ({ className, onClick, src, ...rest }) => {
  return (
    <img
      role="avatar"
      className={classNames('avatar', className)} 
      src={src || userImg}
      onClick={onClick}
      {...rest}
    />
  )
}

Avatar.propTypes = {
  onClick: pt.func,
  src: pt.string,
  className: pt.string
}

export default Avatar
