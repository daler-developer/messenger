import classNames from "classnames"
import pt from 'prop-types'


const Avatar = ({ user, className, imgClassname, isOnline, displayName, onClick, ...rest }) => {
  return (
    <div className={classNames('avatar', { 'avatar--with-green-dot': isOnline }, className)} onClick={onClick}>

      <img 
        {...rest}
        src={user.avatarUrl || 'https://scontent.ftas1-1.fna.fbcdn.net/v/t1.30497-1/143086968_2856368904622192_1959732218791162458_n.png?_nc_cat=1&ccb=1-5&_nc_sid=7206a8&_nc_ohc=d5JXCdeo3tYAX9LSHjH&_nc_ht=scontent.ftas1-1.fna&oh=00_AT-t29T75UpmjHCxJ3lMS-NKhdRwrxRIQDhI3y0xvhXC7Q&oe=6204B6F8'}
        className={classNames('avatar__img', imgClassname)}
      />

    </div>
  )
}

Avatar.propTypes = {
  onClick: pt.func
}

export default Avatar
