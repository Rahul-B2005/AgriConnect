import React from 'react';

const TICKS = [
  { mkt: 'Vellore', name: 'Paddy', price: '₹1,240 / bag', dir: 'up' },
  { mkt: 'Erode', name: 'Turmeric', price: '₹14,800 / qtl', dir: 'up' },
  { mkt: 'Salem', name: 'Sugarcane', price: '₹3,200 / tonne', dir: 'flat' },
  { mkt: 'Tiruvannamalai', name: 'Groundnut', price: '₹6,150 / qtl', dir: 'down' },
  { mkt: 'Coimbatore', name: 'Maize', price: '₹2,080 / qtl', dir: 'up' },
  { mkt: 'Ranipet', name: 'Tomato', price: '₹22 / kg', dir: 'down' },
];

const arrow = (d) => (d === 'up' ? '▲' : d === 'down' ? '▼' : '—');

export default function PriceTicker() {
  const doubled = [...TICKS, ...TICKS];
  return (
    <div className="ticker-band">
      <div className="ticker-track mono">
        {doubled.map((t, i) => (
          <span className="tick" key={i}>
            <span className="mkt">{t.mkt}</span> {t.name}{' '}
            <span className={`price ${t.dir}`}>{t.price} {arrow(t.dir)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
