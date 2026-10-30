
import React,{useEffect,useState} from 'react';
import api from '../api/axios';
import CropCard from '../components/CropCard';
import {useAuth} from '../context/AuthContext';

export default function Marketplace(){
  const {user}=useAuth(); const [crops,setCrops]=useState([]); const [search,setSearch]=useState('');
  const [loading,setLoading]=useState(true); const [orderState,setOrderState]=useState({}); const [message,setMessage]=useState('');
  const load=async()=>{setLoading(true);try{const {data}=await api.get('/crops',{params:search?{search}:{}});setCrops(data)}finally{setLoading(false)}};
  useEffect(()=>{load()},[]);
  const placeOrder=async id=>{
    if(!user){setMessage('Please sign in as a buyer to place an order.');return}
    const state=orderState[id]||{},qty=Number(state.qty||1),address=state.address||'';
    if(!address){setMessage('Add a delivery address before placing the order.');return}
    try{await api.post('/orders',{cropId:id,quantity:qty,deliveryAddress:address});setMessage('Order placed successfully!');setOrderState(s=>({...s,[id]:{}}));load()}
    catch(err){setMessage(err.response?.data?.message||'Order failed.')}
  };
  return <main>
    <div className="wrap page-hero"><h1>Marketplace</h1><p>Discover harvests listed directly by farmers. Search by crop or district and order what you need.</p></div>
    <section className="section" style={{paddingTop:10}}><div className="wrap">
      <div className="toolbar"><form className="search-box" onSubmit={e=>{e.preventDefault();load()}}><input className="input" placeholder="Search crop or district…" value={search} onChange={e=>setSearch(e.target.value)}/><button className="btn" type="submit">Search</button></form><span className="dim" style={{fontSize:13}}>{crops.length} listings available</span></div>
      {message&&<div className="error" style={{marginBottom:18,background:message.includes('success')?'#eaf7e4':'#fff5e6',color:message.includes('success')?'#3e7b36':'#8b641b'}}>{message}</div>}
      {loading?<div className="empty"><div className="empty-icon">🌱</div>Loading fresh listings…</div>:crops.length===0?<div className="empty"><div className="empty-icon">🌾</div><h3>No matching harvests</h3><p className="dim">Try another crop or district.</p></div>:
      <div className="listings">{crops.map(crop=><CropCard key={crop._id} crop={crop} action={user?.role==='buyer'?<div style={{display:'grid',gap:8}}>
        <input className="input" type="number" min="1" max={crop.quantityAvailable} placeholder="Quantity" value={orderState[crop._id]?.qty||''} onChange={e=>setOrderState(s=>({...s,[crop._id]:{...s[crop._id],qty:e.target.value}}))}/>
        <input className="input" placeholder="Delivery address" value={orderState[crop._id]?.address||''} onChange={e=>setOrderState(s=>({...s,[crop._id]:{...s[crop._id],address:e.target.value}}))}/>
        <button className="btn" onClick={()=>placeOrder(crop._id)}>Place order</button>
      </div>:null}/>)}</div>}
    </div></section>
  </main>
}
