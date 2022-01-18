import classNames from "classnames"
import pt from 'prop-types'
import userImg from 'assets/user.png'


const Avatar = ({ user, className, imgClassname, isOnline, displayName, onClick, ...rest }) => {
  return (
    <div className={classNames('avatar', { 'avatar--with-green-dot': isOnline }, className)} onClick={onClick}>

      <img 
        {...rest}
        src={user.avatarUrl || userImg}
        className={classNames('avatar__img', imgClassname)}
      />

    </div>
  )
}

Avatar.propTypes = {
  onClick: pt.func
}

export default Avatar
