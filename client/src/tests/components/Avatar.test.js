import { screen } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import Avatar from "components/Avatar"
import { customRender } from "tests/utils"


describe('<Avatar />', () => {
  
  test('should render correctly', () => {
    customRender(<Avatar />)
  })
  
  test('className should be generated correctly', () => {
    customRender(<Avatar className="first-avatar" />)

    expect(screen.getByRole('avatar')).toHaveClass('avatar first-avatar', { exact: true })
  })

  test('"src" prop should be added to "src" attr of img', () => {
    customRender(<Avatar src="http://google.com/" />)

    expect(screen.getByRole('avatar').src).toEqual("http://google.com/")
  })

  test('a default image should be shown if no "src" prop is passed', () => {
    customRender(<Avatar />)

    expect(screen.getByRole('avatar').src).toBeTruthy()
  })

  test('a function passed with "onClick" prop should be called once when clicking on an image', () => {
    const handleClick = jest.fn()

    customRender(<Avatar onClick={handleClick} />)
    
    userEvent.click(screen.getByRole('avatar'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
  
})
