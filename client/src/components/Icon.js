import classNames from "classnames"
import pt from 'prop-types'


const Icon = ({ className, variant, children }) => {

  const getTypeClassName = (type) => {
    switch (type) {
      case 'outlined':
        return 'material-icons-outlined'
      case 'filled':
        return 'material-icons-filled'
    }
  }

  return (
    <span className={classNames('icon', getTypeClassName(variant || 'outlined'), className)} role="icon">
      {children}
    </span>
  )
}

Icon.propTypes = {
  className: pt.string,
  variant: pt.oneOf(['outlined', 'filled']),
  children: pt.string.isRequired
}

export default Icon
