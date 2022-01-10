import { useSelector } from "react-redux"
import { useLocation, Navigate, Route } from "react-router-dom"
import { selectCurrentUserId, selectIsTryingToLogin } from "redux/reducers/authReducer"
import { selectUserById } from "redux/reducers/usersReducer"
import FullScreenLoader from "./FullScreenLoader"


const AuthProtected = ({ children }) => {
  let location = useLocation()

  const currentUser = useSelector((state) => selectUserById(state, selectCurrentUserId(state)))
  const isTryingToLogin = useSelector((state) => selectIsTryingToLogin(state))

  if (!currentUser && isTryingToLogin) {
    return <FullScreenLoader isLoading={isTryingToLogin} />
  }

  if (!currentUser && !isTryingToLogin) {
    return <Navigate to="/auth?tab=login" state={{ from: location }} />
  }

  return children
}

export default AuthProtected
