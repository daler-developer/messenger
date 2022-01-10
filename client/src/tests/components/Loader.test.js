import { screen } from "@testing-library/react"
import Loader from "components/Loader"
import { customRender } from "tests/utils"


describe('<Loader />', () => {
  
  test('should render correclty', () => {
    customRender(<Loader />)
  })
  
  test('"className" should be added to root element', () => {
    customRender(<Loader className="first-loader" />)

    expect(screen.getByRole('loader')).toHaveClass('first-loader')
  })
  
  test('"loader--color--*" class should be generated correclty', () => {
    customRender(<Loader color="grey" />)

    expect(screen.getByRole('loader')).toHaveClass('loader--color--grey')
  })

  test('"loader--size--*" class should be generated correclty', () => {
    customRender(<Loader size="md" />)
    
    expect(screen.getByRole('loader')).toHaveClass('loader--size--md')
  })

})
