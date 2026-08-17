import React from 'react';
import Svg, { Path, Circle, Rect, Ellipse } from 'react-native-svg';

export type IconName =
  | 'check' | 'x' | 'bell' | 'calendar' | 'flame' | 'stretch' | 'play'
  | 'chevronLeft' | 'home' | 'clipboard' | 'user' | 'userPlus' | 'search'
  | 'trash' | 'info' | 'warn' | 'clock' | 'pin';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function Icon({ name, size = 18, color = '#f4f6fb', strokeWidth = 1.7 }: Props) {
  const s = { stroke: color, strokeWidth, fill: 'none' as const };
  switch (name) {
    case 'check':
      return <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M5 12.5l4.5 4.5L19 7" {...s} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
    case 'x':
      return <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M6 6l12 12M18 6L6 18" {...s} strokeWidth={2.4} strokeLinecap="round" /></Svg>;
    case 'bell':
      return <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M6 10a6 6 0 0112 0c0 4.2 1.4 5.6 2 6.4H4c.6-.8 2-2.2 2-6.4z" {...s} strokeLinejoin="round" />
        <Path d="M10 19.5a2 2 0 004 0" {...s} strokeLinecap="round" />
      </Svg>;
    case 'calendar':
      return <Svg width={size} height={size} viewBox="0 0 24 24">
        <Rect x="4" y="6" width="16" height="14" rx="2.4" {...s} />
        <Path d="M4 10.5h16M8 4v4M16 4v4" {...s} strokeLinecap="round" />
      </Svg>;
    case 'flame':
      return <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M12 3c1 2.3-.6 3.4-1.6 4.6C9 9.3 8 11 8 13.2A4 4 0 0012 17a4 4 0 004-4c0-1.3-.6-2.1-1.3-2.9-.2 1.4-.9 2-1.6 2 .5-2.6-.4-4.2-1.1-6.1z" {...s} strokeLinejoin="round" /></Svg>;
    case 'stretch':
      return <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx="12" cy="4.6" r="1.8" fill={color} />
        <Path d="M12 8v6M12 8L6 11M12 8l6 3M12 14l-4 6M12 14l4 6" {...s} strokeLinecap="round" />
      </Svg>;
    case 'play':
      return <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M8 5.5v13l11-6.5z" fill={color} /></Svg>;
    case 'chevronLeft':
      return <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M15 5l-7 7 7 7" {...s} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
    case 'home':
      return <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M4 11l8-6 8 6v8a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 19z" {...s} strokeLinejoin="round" /></Svg>;
    case 'clipboard':
      return <Svg width={size} height={size} viewBox="0 0 24 24">
        <Rect x="5" y="5" width="14" height="16" rx="2" {...s} />
        <Path d="M9 5V4a1 1 0 011-1h4a1 1 0 011 1v1M8 11h8M8 15h5" {...s} strokeLinecap="round" />
      </Svg>;
    case 'user':
      return <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx="12" cy="8.2" r="3.4" {...s} />
        <Path d="M5 20c1-3.6 4-5.4 7-5.4s6 1.8 7 5.4" {...s} strokeLinecap="round" />
      </Svg>;
    case 'userPlus':
      return <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx="10" cy="8" r="3.4" {...s} />
        <Path d="M3.5 20c.9-3.4 3.6-5.2 6.5-5.2s5.6 1.8 6.5 5.2" {...s} strokeLinecap="round" />
        <Path d="M18 8v5M15.5 10.5h5" {...s} strokeLinecap="round" />
      </Svg>;
    case 'search':
      return <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx="11" cy="11" r="6.5" {...s} />
        <Path d="M20 20l-4.8-4.8" {...s} strokeLinecap="round" />
      </Svg>;
    case 'trash':
      return <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M5 7h14M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-8 0l1 13a1.5 1.5 0 001.5 1.4h5a1.5 1.5 0 001.5-1.4l1-13" {...s} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
    case 'info':
      return <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx="12" cy="12" r="8.5" {...s} />
        <Path d="M12 11v5.2M12 8v.1" {...s} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>;
    case 'warn':
      return <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M12 4l9 16H3z" {...s} strokeLinejoin="round" />
        <Path d="M12 10v4.4M12 17.2v.1" {...s} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>;
    case 'clock':
      return <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx="12" cy="12" r="8.5" {...s} />
        <Path d="M12 7.5V12l3.2 2" {...s} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>;
    case 'pin':
      return <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M12 21s7-6.1 7-11.5A7 7 0 005 9.5C5 14.9 12 21 12 21z" {...s} strokeLinejoin="round" />
        <Circle cx="12" cy="9.5" r="2.3" {...s} />
      </Svg>;
    default:
      return null;
  }
}

export function AtlasMark({ size = 28, color = '#9cc3ff' }: { size?: number; color?: string }) {
  const s = { stroke: color, strokeWidth: 1.5, fill: 'none' as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Ellipse cx="24" cy="24" rx="6.5" ry="5" {...s} strokeWidth={1.6} />
      <Path
        d="M17.5 20.5c-5-1-9-.2-11.5 2.2 3 1.6 7 1.6 10.3.2M30.5 20.5c5-1 9-.2 11.5 2.2-3 1.6-7 1.6-10.3.2M18.5 28.5c-3.4 3-4.6 6.6-3.6 10 3-1.4 5.4-4.4 6.3-7.6M29.5 28.5c3.4 3 4.6 6.6 3.6 10-3-1.4-5.4-4.4-6.3-7.6"
        {...s}
        strokeLinecap="round"
      />
      <Path d="M24 19v10" {...s} strokeLinecap="round" />
    </Svg>
  );
}
