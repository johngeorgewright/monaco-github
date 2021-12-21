import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import Hello from '../Hello'

test('hello world', () => {
  const component = render(<Hello />)
  expect(component.container).toMatchInlineSnapshot(`
    <div>
      <h1
        class="MuiTypography-root MuiTypography-h3 MuiTypography-gutterBottom css-1mktp8m-MuiTypography-root"
      >
        @johngeorgewright/ts-react
      </h1>
      <button
        class="MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButtonBase-root  css-sghohy-MuiButtonBase-root-MuiButton-root"
        tabindex="0"
        type="button"
      >
        Morning
         World
        <span
          class="MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root"
        />
      </button>
    </div>
  `)
})

test('clicking the button', () => {
  const component = render(<Hello />)
  let button = component.getByText('Morning World')
  fireEvent.click(button)
  button = component.getByText('Afternoon World')
  fireEvent.click(button)
  button = component.getByText('Evening World')
  fireEvent.click(button)
  component.getByText('Morning World')
})
