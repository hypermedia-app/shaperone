import { Button } from './Button'
import { template } from './template'

export default {
  title: 'Example/Button',
  argTypes: {
    backgroundColor: { control: 'color' },
    onClick: { action: 'onClick' },
  },
}

const Template = template(Button)

export const Primary = Template.bind({})
Primary.args = {
  primary: true,
  label: 'Button',
}

export const Secondary = Template.bind({})
Secondary.args = {
  label: 'Button',
}

export const Large = Template.bind({})
Large.args = {
  size: 'large',
  label: 'Button',
}

export const Small = Template.bind({})
Small.args = {
  size: 'small',
  label: 'Button',
}
