import { screen } from '@testing-library/react'
import Icon from 'components/Icon'
import { customRender } from 'tests/utils'


describe('<Icon />', () => {
  
  test('should render correctly', () => {
    customRender(<Icon variant="outlined">person</Icon>)
  })

  test('should have correct className', () => {
    const wrapper = customRender(<Icon className="first-icon" variant="outlined">person</Icon>)

    expect(screen.getByRole('icon')).toHaveClass('first-icon icon material-icons-outlined', { exact: true })

    wrapper.rerender(<Icon variant="filled">person</Icon>)

    expect(screen.getByRole('icon')).toHaveClass('icon material-icons', { exact: true })
  })
  
  test('"children" prop should be present inside icon', () => {
    customRender(<Icon variant="outlined">person</Icon>)

    expect(screen.getByRole('icon')).toHaveTextContent('person')
  })
  

})

