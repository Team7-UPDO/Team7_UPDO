import type { Meta, StoryObj } from '@storybook/react';

import { ProgressBar } from '../ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/ui/ProgressBar',
  component: ProgressBar,
  parameters: { layout: 'centered' },
  argTypes: {
    current: {
      control: { type: 'number' },
    },
    max: {
      control: { type: 'number' },
    },
    min: {
      control: { type: 'number' },
    },
    height: {
      control: { type: 'text' },
    },
  },
  args: {
    current: 7,
    min: 12,
    max: 20,
    height: '6px',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <table style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
      <thead>
        <tr>
          <th style={{ padding: '8px' }}>Width</th>
          <th style={{ padding: '8px' }}>ProgressBar</th>
        </tr>
      </thead>
      <tbody>
        {['126px', '191px', '294px', '302px', '549px'].map(width => (
          <tr key={width}>
            <td style={{ padding: '8px' }}>{width}</td>
            <td style={{ padding: '8px', width }}>
              <div style={{ width }}>
                <ProgressBar {...args} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};
