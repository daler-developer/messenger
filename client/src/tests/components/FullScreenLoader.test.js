import { screen } from "@testing-library/react"
import FullScreenLoader from "components/FullScreenLoader"
import { customRender } from "tests/utils"


describe('<FullScreenLoader />', () => {
  
  test('should render correclly', () => {
    customRender(<FullScreenLoader />)
  })

  test('className should be generated correclty', () => {
    customRender(<FullScreenLoader className="first-loader" />)

    expect(screen.getByRole('full-screen-loader')).toHaveClass('full-screen-loader first-loader', { exact: true })
  })
  
  test('loader should be rendered', () => {
    customRender(<FullScreenLoader />)

    expect(screen.getByRole('loader')).toBeInTheDocument()
  })
  
})
