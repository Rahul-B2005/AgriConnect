import React from 'react';

export default function CropCard({ crop, action }) {
  const daysAgo = Math.floor((Date.now() - new Date(crop.harvestDate)) / (1000 * 60 * 60 * 24));
  const badge = daysAgo <= 0 ? 'Harvested today' : `${daysAgo} day${daysAgo > 1 ? 's' : ''} old`;

  return (
    <div className="produce-card">
      <div className="produce-media">{crop.imageEmoji}</div>
      <div className="produce-body">
        <span className="badge">{badge}</span>
        <div className="name">{crop.name}</div>
        <div className="loc">{crop.district}{crop.farmer?.name ? ` · ${crop.farmer.name}` : ''}</div>
        <div className="produce-foot">
          <span className="price">₹{crop.pricePerUnit}</span>
          <span className="unit">/ {crop.unit} · {crop.quantityAvailable} left</span>
        </div>
        {action && <div style={{ marginTop: 14 }}>{action}</div>}
      </div>
    </div>
  );
}
