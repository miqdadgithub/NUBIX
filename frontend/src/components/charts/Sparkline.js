import React, { useMemo } from 'react';

const Sparkline = ({ data = [], width = 80, height = 24, stroke = '#CD9613' }) => {
  const path = useMemo(() => {
    if (!data.length) return '';
    const min = Math.min(...data);
    const max = Math.max(...data);
    const scaleX = (i) => (i / (data.length - 1)) * width;
    const scaleY = (v) => {
      if (max === min) return height / 2;
      return height - ((v - min) / (max - min)) * height;
    };
    return data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i).toFixed(2)} ${scaleY(v).toFixed(2)}`).join(' ');
  }, [data, width, height]);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <path d={path} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export default Sparkline;