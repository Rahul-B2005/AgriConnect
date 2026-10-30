import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const ROWS = 24;
const PLANTS_PER_ROW = 22;
const COUNT = ROWS * PLANTS_PER_ROW;

function Field({ wind = 8 }) {
  const ref = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(() => Array.from({ length: COUNT }, (_, i) => ({
    row: Math.floor(i / PLANTS_PER_ROW),
    col: i % PLANTS_PER_ROW,
    phase: Math.random() * Math.PI * 2,
    height: 0.7 + Math.random() * 0.65,
    lean: (Math.random() - 0.5) * 0.06,
  })), []);
  const geo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.022, 0.055, 1, 5);
    g.translate(0, 0.5, 0);
    return g;
  }, []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#4d8b3d', roughness: 0.92, metalness: 0.0,
  }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const windPower = Math.min(Math.max(wind, 0), 45) / 45;
    seeds.forEach((s, i) => {
      const x = (s.col - (PLANTS_PER_ROW - 1) / 2) * 0.42 + (s.row % 2) * 0.18;
      const z = 2.4 - s.row * 0.42;
      const wave = Math.sin(t * (1.25 + windPower * 1.5) + s.phase + z * 0.55) * (0.055 + windPower * 0.12);
      dummy.position.set(x, -0.05, z);
      dummy.rotation.set(0, 0, wave + s.lean);
      dummy.scale.set(1, s.height, 1);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={ref} args={[geo, material, COUNT]} castShadow receiveShadow />;
}

function Furrows() {
  const mesh = useRef();
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    mesh.current.position.z = ((clock.getElapsedTime() * 0.08) % 0.7) - 0.35;
  });
  return (
    <group ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.16, 0]}>
      <planeGeometry args={[18, 15, 1, 1]} />
      <meshStandardMaterial color="#6f4d2f" roughness={1} />
    </group>
  );
}

function Mountain({ position, scale }) {
  return (
    <mesh position={position} scale={scale} rotation={[0, Math.PI * 0.25, 0]}>
      <coneGeometry args={[1, 1, 6]} />
      <meshStandardMaterial color="#476653" roughness={1} flatShading />
    </mesh>
  );
}

function Clouds() {
  const group = useRef();
  useFrame(({ clock }) => {
    if (group.current) group.current.position.x = Math.sin(clock.getElapsedTime() * 0.015) * 0.5;
  });
  return (
    <group ref={group} position={[0, 3.2, -4]}>
      {[[-3,0,0,1.5],[0,.15,0,1.1],[3,0,0,1.7]].map(([x,y,z,s],i)=>(
        <mesh key={i} position={[x,y,z]} scale={s}>
          <sphereGeometry args={[1, 20, 12]} />
          <meshStandardMaterial color="#fff" transparent opacity={0.82} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function Birds() {
  const ref = useRef();
  const points = useMemo(() => Array.from({length: 9}, (_,i)=>({x:-4+i, y:2.6+(i%3)*.25, z:-2.8, p:i})), []);
  useFrame(({clock}) => {
    const t=clock.getElapsedTime();
    points.forEach((b,i)=>{
      const wing=Math.sin(t*3+b.p)*0.15;
      const o=ref.current.children[i];
      if(o){o.position.x=b.x+Math.sin(t*.12+b.p)*.6;o.position.y=b.y+Math.sin(t*.7+b.p)*.08;o.rotation.z=wing;}
    });
  });
  return <group ref={ref}>{points.map((b,i)=><mesh key={i} position={[b.x,b.y,b.z]} scale={[.18,.025,.04]}><sphereGeometry args={[1,8,6]}/><meshBasicMaterial color="#20392c"/></mesh>)}</group>;
}

function CameraRig() {
  const { camera } = useThree();
  useFrame(({ pointer }) => {
    camera.position.x += (pointer.x * 0.65 - camera.position.x) * 0.025;
    camera.position.y += ((1.65 - pointer.y * 0.12) - camera.position.y) * 0.025;
    camera.lookAt(0, 0.45, -0.9);
  });
  return null;
}

function Rain({ active }) {
  const ref=useRef();
  const dummy=useMemo(()=>new THREE.Object3D(),[]);
  const drops=useMemo(()=>Array.from({length:220},()=>({x:(Math.random()-.5)*13,z:(Math.random()-.5)*9,y:Math.random()*6,s:5+Math.random()*4})),[]);
  const geo=useMemo(()=>new THREE.CylinderGeometry(.006,.006,.28,3),[]);
  useFrame((_,dt)=>{
    if(!active||!ref.current)return;
    drops.forEach((d,i)=>{d.y-=d.s*dt;if(d.y<-.4)d.y=5.5;dummy.position.set(d.x,d.y,d.z);dummy.rotation.x=.12;dummy.updateMatrix();ref.current.setMatrixAt(i,dummy.matrix)});
    ref.current.instanceMatrix.needsUpdate=true;
  });
  if(!active)return null;
  return <instancedMesh ref={ref} args={[geo,undefined,drops.length]}><meshBasicMaterial color="#d7efff" transparent opacity={.38}/></instancedMesh>;
}

export default function CropField3D({ windSpeedKmh=8, rainy=false }) {
  return <Canvas
    dpr={[1,1.5]} shadows
    gl={{alpha:true,antialias:true,powerPreference:'high-performance'}}
    camera={{position:[0,1.65,6.5],fov:44}}
    style={{position:'absolute',inset:0}}
  >
    <Sky distance={450000} sunPosition={[4,5,2]} turbidity={7} rayleigh={2.2} mieCoefficient={0.006} mieDirectionalG={0.8} />
    <fog attach="fog" args={[rainy ? '#71847d' : '#9ebda1', 5, 13]} />
    <ambientLight intensity={rainy ? .48 : .72} color="#eef4df" />
    <directionalLight castShadow position={[-4,6,3]} intensity={rainy ? .75 : 1.8} color="#ffe4a7" shadow-mapSize={[1024,1024]} />
    <pointLight position={[2,2,1]} intensity={.7} color="#d8ef9a" />
    <Mountain position={[-4,-.05,-5]} scale={[3,2.2,2]} />
    <Mountain position={[0,.1,-6]} scale={[4,2.8,2.5]} />
    <Mountain position={[5,0,-5]} scale={[3.5,2.1,2]} />
    <Furrows />
    <Field wind={windSpeedKmh} />
    <Clouds />
    <Birds />
    <Sparkles count={rainy?20:80} scale={[12,4,8]} size={1.8} speed={.18} color="#fff2bd" opacity={rainy?.12:.32} />
    <Rain active={rainy} />
    <CameraRig />
  </Canvas>;
}
