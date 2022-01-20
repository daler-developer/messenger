import classNames from "classnames"
import pt from 'prop-types'
import userImg from 'assets/user.png'


const Avatar = ({ className, onClick, src, ...rest }) => {
  return (
    <img 
      className={classNames('avatar', className)} 
      src={src || userImg}
      onClick={onClick}
      {...rest}
    />
  )
}

Avatar.propTypes = {
  onClick: pt.func,
  avatarUrl: pt.string,
  src: pt.string
}

export default Avatar
