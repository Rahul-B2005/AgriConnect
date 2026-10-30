
import React,{useEffect,useState} from 'react';
import api from '../api/axios';

export default function Orders(){
 const [orders,setOrders]=useState([]); const [loading,setLoading]=useState(true);
 useEffect(()=>{api.get('/orders/mine').then(({data})=>setOrders(data)).finally(()=>setLoading(false))},[]);
 return <main><div className="wrap page-hero"><h1>My orders</h1><p>Keep track of everything you have ordered and see the latest delivery status.</p></div>
 <section className="section" style={{paddingTop:8}}><div className="wrap">
 {loading?<div className="empty">Loading your orders…</div>:orders.length===0?<div className="empty"><div className="empty-icon">📦</div><h3>No orders yet</h3><p className="dim">Explore the marketplace and place your first order.</p></div>:
 <div style={{display:'grid',gap:12}}>{orders.map(o=><div className="order-row" key={o._id}>
  <div className="order-meta"><div className="order-title">{o.crop?.imageEmoji} {o.crop?.name} × {o.quantity}</div><div className="order-sub">From {o.farmer?.name}, {o.farmer?.district} · ₹{o.totalPrice}</div><div className="order-sub">Delivery: {o.deliveryAddress}</div></div>
  <span className={`status status-${o.status}`}>{o.status.replace(/_/g,' ')}</span>
 </div>)}</div>}
 </div></section></main>
}
