import * as React from 'react';
// @ts-ignore
import simpleIcons from 'simple-icons';

import { Avatar } from '@material-ui/core';
import { Link } from '@material-ui/icons';

interface Props {
  type: string;
}

export default ({ type }: Props) => {
  const icon = simpleIcons[type];

  return icon ? (
    <i
      dangerouslySetInnerHTML={{ __html: icon.svg }}
      style={{
        width: '40px',
        height: '40px',
        fill: `#${icon.hex}`,
      }}
    />
  ) : (
    <Avatar>
      <Link />
    </Avatar>
  );
};
