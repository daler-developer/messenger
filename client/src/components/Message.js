import classNames from 'classnames'
import pt from 'prop-types'
import { useSelector } from 'react-redux'
import { selectUserById } from 'redux/reducers/usersReducer'


const Message = ({ data, className }) => {

  return (
    <div className={classNames('message', className)}>
      {data.text}
    </div>
  )
}

Message.propTypes = {
  data: pt.object.isRequired,
  className: pt.string
}

export default Message
