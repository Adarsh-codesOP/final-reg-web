// components/Background.jsx
'use client';

import PrismaticBurst from './PrismaticBurst';

export default function Background() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, width: '100%', height: '100%' }}>
      <PrismaticBurst
        animationType="rotate3d"
        intensity={2}
        speed={0.5}
        distort={1.0}
        paused={false}
        offset={{ x: 0, y: 0 }}
        hoverDampness={0.25}
        rayCount={24}
        mixBlendMode="lighten"
        colors={['#ff007a', '#4d3dff', '#ffffff']}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
