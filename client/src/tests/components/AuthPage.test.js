import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AuthPage from 'components/AuthPage'
import { customRender } from '../utils'



describe.skip('<AuthPage />', () => {
  
  test('should render correctly', () => {
    customRender(<AuthPage />)
  })

  test('"tab" param should be "login" by default', () => {
    customRender(<AuthPage />)

    const params = new URLSearchParams(window.location.search)

    expect(params.get('tab')).toBe('login')
  })

  test('display name filed should not be shown when in login tab', () => {
    customRender(<AuthPage />)

    expect(screen.queryByPlaceholderText('Display name')).not.toBeInTheDocument()
  })
  
  test('"tab" param should be "register" when clicked on register', () => {
    customRender(<AuthPage />)

    userEvent.click(screen.getByRole('register-link'))

    const params = new URLSearchParams(window.location.search)
    
    expect(params.get('tab')).toBe('register')
  })

  test('fields should have correct value when typing', () => {
    customRender(<AuthPage />)

    userEvent.type(screen.getByPlaceholderText('Username'), 'daler')
    userEvent.type(screen.getByPlaceholderText('Display name'), 'Daler Saidov')
    userEvent.type(screen.getByPlaceholderText('Password'), 'blablabla')

    expect(screen.getByPlaceholderText('Username')).toHaveValue('daler')
    expect(screen.getByPlaceholderText('Display name')).toHaveValue('Daler Saidov')
    expect(screen.getByPlaceholderText('Password')).toHaveValue('blablabla')
  })
  
})
