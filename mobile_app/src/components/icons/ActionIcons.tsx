import React from 'react';
import { renderSelectionActionIcon } from './action/SelectionActionIcons';
import { renderControlActionIcon } from './action/ControlActionIcons';
import { renderSystemAuthActionIcon } from './action/SystemAuthActionIcons';

export interface IconRenderContext {
  size: number;
  color: string;
  strokeWidth: number;
  filled: boolean;
  containerStyle: {
    width: number;
    height: number;
    alignItems: 'center';
    justifyContent: 'center';
  };
}

export function renderActionIcon(name: string, ctx: IconRenderContext): React.ReactNode | null {
  return (
    renderSelectionActionIcon(name, ctx) ??
    renderControlActionIcon(name, ctx) ??
    renderSystemAuthActionIcon(name, ctx) ??
    null
  );
}
