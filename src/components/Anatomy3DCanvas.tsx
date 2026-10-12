import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

type BodyLayer = 'organs' | 'skeletal' | 'muscular' | 'nervous' | 'skin';

interface HotspotProps {
  position: [number, number, number];
  label: string;
  symptom: string;
  onClick: (label: string, symptom: string) => void;
}

// 3D Interactive Hotspot Marker
function Hotspot({ position, label, symptom, onClick }: HotspotProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <mesh
        onClick={() => onClick(label, symptom)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? '#f43f5e' : '#38bdf8'}
          emissive={hovered ? '#f43f5e' : '#0284c7'}
          emissiveIntensity={2}
        />
      </mesh>

      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-slate-900/90 text-white text-[10px] px-2 py-1 rounded border border-cyan-400 shadow-lg whitespace-nowrap backdrop-blur-md">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

// ================= DOWNLOADED GLB SKELETON MODEL =================
// Place your file at: public/models/skeleton.glb
// Change the path below if you named it differently or put it in a subfolder.
const SKELETON_MODEL_PATH = '/models/skeleton.glb';

function SkeletonGLTFModel({
  onSelectPart,
}: {
  onSelectPart: (part: string, symptom: string) => void;
}) {
  const { scene } = useGLTF(SKELETON_MODEL_PATH);
  const groupRef = useRef<THREE.Group>(null);

  // Give the imported model the same glowing cyan "scan" look as the rest of the UI
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshStandardMaterial({
          color: '#22d3ee',
          emissive: '#0891b2',
          emissiveIntensity: 0.4,
          metalness: 0.3,
          roughness: 0.4,
          wireframe: false,
        });
      }
    });
  }, [scene]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  // NOTE: adjust position/scale to match your specific downloaded model's
  // origin & size — most free skeleton GLBs are scaled very differently.
  return (
    <group ref={groupRef} position={[0, -1.6, 0]} scale={1.4}>
      <primitive object={scene} />

      {/* Hotspots positioned to roughly match a standing skeleton — tweak Y values
          after you see your model rendered, since exact bone height varies */}
      <Hotspot position={[0, 2.6, 0.25]} label="Skull" symptom="Headache & Skull Pain" onClick={onSelectPart} />
      <Hotspot position={[0, 1.9, 0.2]} label="Ribcage" symptom="Chest / Rib Pain" onClick={onSelectPart} />
      <Hotspot position={[0, 1.2, 0.15]} label="Spine" symptom="Backache and Spinal Stiffness" onClick={onSelectPart} />
      <Hotspot position={[0.3, 0.3, 0.15]} label="Knee Joint" symptom="Severe Knee Joint Pain" onClick={onSelectPart} />
    </group>
  );
}

// Preload so switching to the skeletal layer doesn't show a blank frame first time
useGLTF.preload(SKELETON_MODEL_PATH);

// ================= PROCEDURAL FALLBACK MODEL (organs / muscular / nervous / skin) =================
function HumanBodyModel({ onSelectPart }: { onSelectPart: (part: string, symptom: string) => void }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      <mesh position={[0, 2.4, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshPhysicalMaterial color="#0284c7" wireframe emissive="#0369a1" emissiveIntensity={0.5} />
      </mesh>

      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.45, 0.3, 1.2, 16]} />
        <meshPhysicalMaterial color="#38bdf8" transmission={0.6} opacity={0.8} transparent roughness={0.1} ior={1.5} />
      </mesh>

      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.4, 8]} />
        <meshStandardMaterial color="#22d3ee" emissive="#0891b2" />
      </mesh>

      <mesh position={[0.1, 1.5, 0.1]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#f43f5e" emissive="#e11d48" emissiveIntensity={3} />
      </mesh>

      <mesh position={[-0.6, 1.5, 0]} rotation={[0, 0, 0.2]}>
        <capsuleGeometry args={[0.1, 0.9, 8, 16]} />
        <meshStandardMaterial color="#1e293b" wireframe />
      </mesh>
      <mesh position={[0.6, 1.5, 0]} rotation={[0, 0, -0.2]}>
        <capsuleGeometry args={[0.1, 0.9, 8, 16]} />
        <meshStandardMaterial color="#1e293b" wireframe />
      </mesh>

      <mesh position={[-0.25, 0.3, 0]}>
        <capsuleGeometry args={[0.12, 1.2, 8, 16]} />
        <meshStandardMaterial color="#0f172a" wireframe />
      </mesh>
      <mesh position={[0.25, 0.3, 0]}>
        <capsuleGeometry args={[0.12, 1.2, 8, 16]} />
        <meshStandardMaterial color="#0f172a" wireframe />
      </mesh>

      <Hotspot position={[0, 2.5, 0.3]} label="Head / Brain" symptom="Severe Headache & Dizziness" onClick={onSelectPart} />
      <Hotspot position={[0.1, 1.5, 0.25]} label="Chest / Heart" symptom="Chest Pain & Shortness of Breath" onClick={onSelectPart} />
      <Hotspot position={[0, 1.1, 0.25]} label="Stomach" symptom="Abdominal Cramps & Nausea" onClick={onSelectPart} />
      <Hotspot position={[0.25, 0.1, 0.2]} label="Knee Joint" symptom="Joint Pain & Stiffness" onClick={onSelectPart} />
    </group>
  );
}

// Simple loading placeholder shown while the GLB downloads
function ModelLoadingFallback() {
  return (
    <Html center>
      <div className="text-cyan-300 text-[11px] font-mono bg-slate-900/80 px-3 py-1.5 rounded-md border border-cyan-500/30">
        Loading skeleton model...
      </div>
    </Html>
  );
}

export default function Anatomy3DCanvas({
  activeLayer = 'organs',
  onSelectPart,
}: {
  activeLayer?: BodyLayer;
  onSelectPart: (part: string, symptom: string) => void;
}) {
  return (
    <div className="w-full h-[360px] relative bg-slate-950/80 rounded-xl border border-blue-500/30 overflow-hidden">
      <div className="absolute top-3 left-3 z-10 pointer-events-none">
        <span className="text-[10px] text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-500/30 font-mono">
          🖱️ Drag to rotate 360° | Scroll to zoom
        </span>
      </div>

      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#38bdf8" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#f43f5e" />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <Suspense fallback={<ModelLoadingFallback />}>
            {activeLayer === 'skeletal' ? (
              <SkeletonGLTFModel onSelectPart={onSelectPart} />
            ) : (
              <HumanBodyModel onSelectPart={onSelectPart} />
            )}
          </Suspense>
        </Float>

        <ContactShadows position={[0, -1.8, 0]} opacity={0.6} scale={5} blur={2} far={4} color="#0284c7" />
        <OrbitControls enablePan={true} enableZoom={true} minDistance={2.5} maxDistance={7} />
      </Canvas>
    </div>
  );
}