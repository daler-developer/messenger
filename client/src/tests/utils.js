import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from 'redux/store'


const Wrapper = ({ children }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  )
}

export const customRender = (ui, options) => {
  return render(ui, {wrapper: Wrapper, ...options})
}
