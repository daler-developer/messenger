import classNames from "classnames"


const Avatar = ({ src, className, ...rest }) => {
  return (
    <img 
      {...rest}
      src={src}
      className={classNames('avatar', className)}
    />
  )
}

export default Avatar
