import { useSelector } from "react-redux"
import { useLocation, Navigate, Route } from "react-router-dom"
import { selectCurrentUser } from "redux/reducers/authReducer"


const AuthProtected = ({ children }) => {
  let location = useLocation()

  const currentUser = useSelector((state) => selectCurrentUser(state))

  if (!currentUser) {
    return null
    // return <Navigate to="/auth?tab=login" state={{ from: location }} />
  }

  return children
}

export default AuthProtected
