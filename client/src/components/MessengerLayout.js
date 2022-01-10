import { Outlet } from "react-router-dom"

const MessengerLayout = () => { 
  return (
    <div className="messenger-layout">
      <div className="messenger-layout__body">
        <Outlet />
      </div>
    </div>
  )
}

export default MessengerLayout
