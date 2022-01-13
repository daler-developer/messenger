import { Outlet } from "react-router-dom"


const MessengerPage = () => {
  return (
    <div className="messenger-page">
      <div className="messenger-page__body">

        <Outlet />

      </div>
    </div>
  )
}

export default MessengerPage
