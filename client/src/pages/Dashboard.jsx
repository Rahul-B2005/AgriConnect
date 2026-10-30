
import React,{useEffect,useState} from 'react';
import api from '../api/axios';

const EMOJIS=['🌾','🥬','🟡','🍅','🥜','🎋','🌽','🥭'];
export default function Dashboard(){
 const [crops,setCrops]=useState([]),[orders,setOrders]=useState([]),[error,setError]=useState('');
 const [form,setForm]=useState({name:'',category:'',pricePerUnit:'',unit:'kg',quantityAvailable:'',district:'',harvestDate:'',imageEmoji:'🌾'});
 const load=async()=>{const [c,o]=await Promise.all([api.get('/crops/mine'),api.get('/orders/incoming')]);setCrops(c.data);setOrders(o.data)};
 useEffect(()=>{load()},[]);
 const submit=async e=>{e.preventDefault();setError('');try{await api.post('/crops',form);setForm({...form,name:'',pricePerUnit:'',quantityAvailable:'',harvestDate:''});load()}catch(err){setError(err.response?.data?.message||'Could not create listing')}};
 const removeCrop=async id=>{await api.delete(`/crops/${id}`);load()};
 const setStatus=async(id,status)=>{await api.put(`/orders/${id}/status`,{status});load()};
 return <main><div className="wrap page-hero"><h1>Dashboard</h1><p>Publish your harvest, manage active listings and keep incoming orders moving.</p></div>
 <section className="section" style={{paddingTop:10}}><div className="wrap">
  <div className="stat-grid"><div className="stat"><small>Active listings</small><strong>{crops.length}</strong></div><div className="stat"><small>Incoming orders</small><strong>{orders.length}</strong></div><div className="stat"><small>Marketplace</small><strong>Live</strong></div></div>
  <div className="dashboard-grid">
   <div className="panel"><h2 style={{fontSize:26,marginBottom:5}}>Publish a harvest</h2><p className="form-subtitle">Give buyers the key details they need to order directly.</p>
    <form className="form-grid" onSubmit={submit}>
     <div><label className="form-label">Crop name</label><input className="input" placeholder="e.g. Paddy" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
     <div><label className="form-label">Category</label><input className="input" placeholder="Grain, Vegetable…" required value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/></div>
     <div><label className="form-label">Price / unit (₹)</label><input className="input" type="number" required value={form.pricePerUnit} onChange={e=>setForm({...form,pricePerUnit:e.target.value})}/></div>
     <div><label className="form-label">Unit</label><input className="input" placeholder="kg, bag, quintal" required value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})}/></div>
     <div><label className="form-label">Quantity available</label><input className="input" type="number" required value={form.quantityAvailable} onChange={e=>setForm({...form,quantityAvailable:e.target.value})}/></div>
     <div><label className="form-label">District</label><input className="input" placeholder="District" required value={form.district} onChange={e=>setForm({...form,district:e.target.value})}/></div>
     <div><label className="form-label">Harvest date</label><input className="input" type="date" required value={form.harvestDate} onChange={e=>setForm({...form,harvestDate:e.target.value})}/></div>
     <div><label className="form-label">Crop icon</label><select className="input" value={form.imageEmoji} onChange={e=>setForm({...form,imageEmoji:e.target.value})}>{EMOJIS.map(x=><option key={x}>{x}</option>)}</select></div>
     {error&&<div className="error full">{error}</div>}<button className="btn full">Publish listing</button>
    </form>
   </div>
   <div className="panel"><h3 style={{fontSize:20}}>Better listings sell faster</h3><div style={{display:'grid',gap:12,marginTop:18}}>{['Use a clear crop name and category','Keep price and quantity accurate','Add the actual harvest date','Update incoming orders promptly'].map((x,i)=><div key={x} style={{display:'flex',gap:10,alignItems:'flex-start',fontSize:13,color:'var(--muted)'}}><span style={{width:24,height:24,borderRadius:8,display:'grid',placeItems:'center',background:'var(--surface-2)',border:'1px solid var(--line)',color:'var(--rust)',fontWeight:700}}>{i+1}</span>{x}</div>)}</div></div>
  </div>

  <div className="section-head" style={{marginTop:55,marginBottom:20}}><h2 style={{fontSize:30}}>{crops.length} active listings</h2></div>
  {crops.length===0?<div className="empty"><div className="empty-icon">🌾</div><h3>Your listings will appear here</h3><p className="dim">Publish your first harvest above.</p></div>:<div className="listings" style={{marginBottom:55}}>{crops.map(c=><div className="produce-card" key={c._id}><div className="produce-media">{c.imageEmoji}</div><div className="produce-body"><span className="badge">{c.status}</span><div className="name">{c.name}</div><div className="loc">{c.district} · {c.quantityAvailable} {c.unit} left</div><div className="produce-foot"><span className="price">₹{c.pricePerUnit}</span><span className="unit">/ {c.unit}</span></div><button className="btn btn-danger" style={{marginTop:14,width:'100%',padding:'9px 12px',fontSize:12}} onClick={()=>removeCrop(c._id)}>Remove listing</button></div></div>)}</div>}

  <div className="section-head" style={{marginBottom:20}}><h2 style={{fontSize:30}}>{orders.length} orders</h2></div>
  {orders.length===0?<div className="empty"><div className="empty-icon">📦</div><p className="dim">No incoming orders yet.</p></div>:<div style={{display:'grid',gap:11}}>{orders.map(o=><div className="order-row" key={o._id}><div className="order-meta"><div className="order-title">{o.crop?.imageEmoji} {o.crop?.name} × {o.quantity}</div><div className="order-sub">Buyer: {o.buyer?.name} · ₹{o.totalPrice}</div></div><select className="input" style={{width:190}} value={o.status} onChange={e=>setStatus(o._id,e.target.value)}><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="out_for_delivery">Out for delivery</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></div>)}</div>}
 </div></section></main>
}
