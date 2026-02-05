import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Icon from '../Icon/Icon';
import { IconName } from '../Icon/Icon';

const meta = {
  title: 'components/ui/Icon',
  component: Icon,
  parameters: { layout: 'padded' },
  argTypes: {
    size: { control: { type: 'number', min: 16, max: 60, step: 2 } },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

// cursor로 코드 확인하기

// 16 20 24 32 40 45 48 64

const icons = [
  { name: 'alarm' },
  { name: 'arrow', size: 16 },
  { name: 'arrow_dropdown', direction: 'up' },
  { name: 'arrow_dropdown', direction: 'down' },
  { name: 'calendar', size: 20 },
  { name: 'calendar' },
  { name: 'check', size: 20 },
  { name: 'check' },
  { name: 'crown', size: 32 },
  { name: 'delete' },
  { name: 'edit', size: 20 },
  { name: 'edit' },
  { name: 'edit_btn', size: 40 },
  { name: 'filter', size: 20 },
  { name: 'heart', fill: 'full' },
  { name: 'heart', fill: 'lined' },
  { name: 'logout', size: 20 },
  { name: 'logout' },
  { name: 'person', size: 16 },
  { name: 'plus', size: 32 },
  { name: 'visibility_off', size: 20 },
  { name: 'visibility_off' },
  { name: 'visibility_on', size: 20 },
  { name: 'visibility_on' },
];
const icons_category = [
  { name: 'category_tab1', size: 32 },
  { name: 'category_tab1', size: 45 },
  { name: 'category_tab1', size: 64 },
  { name: 'category_tab2', size: 32 },
  { name: 'category_tab2', size: 45 },
  { name: 'category_tab2', size: 64 },
  { name: 'save_filled', size: 40 },
  { name: 'save_filled', size: 48 },
  { name: 'save_filled', size: 60 },
  { name: 'save_outline', size: 40 },
  { name: 'save_outline', size: 48 },
  { name: 'save_outline', size: 60 },
  { name: 'save', size: 48 },
];

import type { CSSProperties } from 'react';
const cellStyle: CSSProperties = { padding: '8px', textAlign: 'center', verticalAlign: 'middle' };
const cellIconStyle: CSSProperties = {
  padding: '8px',
  textAlign: 'center',
  verticalAlign: 'middle',
  lineHeight: 0,
};

export const Board: Story = {
  args: { name: 'alarm' },
  render: args => {
    return (
      <table style={{ borderCollapse: 'collapse', textAlign: 'center' }}>
        <thead>
          <tr>
            <th style={cellStyle}>Icon</th>
            <th style={cellStyle}>Name</th>
            <th style={cellStyle}>Size</th>
            <th style={cellStyle}>Direction</th>
            <th style={cellStyle}>fill</th>
          </tr>
        </thead>
        <tbody>
          {icons.map(icon => (
            <tr key={`${icon.name}-${icon.size}`}>
              <td style={cellIconStyle}>
                <Icon
                  {...args}
                  name={icon.name as IconName}
                  size={icon.size ?? 24}
                  direction={icon.direction as 'down' | 'up' | undefined}
                  fill={icon.fill as 'full' | 'lined'}
                  preserveAspectRatio="xMidYMid meet"
                />
              </td>
              <td style={cellStyle}>{icon.name}</td>
              <td style={cellStyle}>{icon.size ?? 24}</td>
              <td style={cellStyle}>{icon.direction as 'down' | 'up'}</td>
              <td style={cellStyle}>{icon.fill as 'full' | 'lined'}</td>
            </tr>
          ))}
          {icons_category.map(icon => (
            <tr key={`${icon.name}-${icon.size}`}>
              <td style={cellIconStyle}>
                <Icon
                  {...args}
                  name={icon.name as IconName}
                  size={icon.size ?? 24}
                  preserveAspectRatio="xMidYMid meet"
                />
              </td>
              <td style={cellStyle}>{icon.name}</td>
              <td style={cellStyle}>{icon.size ?? 24}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};
