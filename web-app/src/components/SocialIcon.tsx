import * as React from 'react';
// @ts-ignore
import simpleIcons from 'simple-icons';

import { Avatar, SvgIcon } from '@material-ui/core';
import { Link } from '@material-ui/icons';

interface Props {
  type: string;
  circled?: boolean;
}

export default ({ type, circled }: Props) => {
  const icon = simpleIcons[type];

  return icon ? (
    !!circled ? (
      <Avatar style={{ backgroundColor: `#${icon.hex}` }}>
        <i
          dangerouslySetInnerHTML={{ __html: icon.svg }}
          style={{
            width: '24px',
            height: '24px',
            fill: 'white',
          }}
        />
      </Avatar>
    ) : (
      <i
        dangerouslySetInnerHTML={{ __html: icon.svg }}
        style={{
          width: '40px',
          height: '40px',
          fill: `#${icon.hex}`,
        }}
      />
    )
  ) : (
    <Avatar>
      <Link />
    </Avatar>
  );
};
