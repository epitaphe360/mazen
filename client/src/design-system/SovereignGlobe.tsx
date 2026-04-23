import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Html, Sphere, Line } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

/* Convert lat/lng to 3D vector on a sphere of given radius */
function latLngToVec3(lat: number, lng: number, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

interface Deployment {
  name: string;
  lat: number;
  lng: number;
  color: string;
  flag?: string;
}

const DEPLOYMENTS: Deployment[] = [
  { name: "DRC",          lat: -4.0383, lng: 21.7587, color: "#3b82f6", flag: "🇨🇩" },
  { name: "Mali",         lat: 17.5707, lng: -3.9962, color: "#10b981", flag: "🇲🇱" },
  { name: "Sierra Leone", lat: 8.4606,  lng: -11.7799, color: "#f59e0b", flag: "🇸🇱" },
  { name: "Burundi",      lat: -3.3731, lng: 29.9189,  color: "#ef4444", flag: "🇧🇮" },
  // HQ markers (illustrative)
  { name: "Paris",        lat: 48.8566, lng: 2.3522,  color: "#dcbc6c", flag: "🇫🇷" },
];

function GlobeMesh() {
  const ref = useRef<THREE.Mesh>(null!);
  const wireRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.06;
    if (wireRef.current) wireRef.current.rotation.y += delta * 0.06;
  });

  return (
    <group>
      {/* Solid globe — deep navy */}
      <mesh ref={ref}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#0a1832"
          metalness={0.4}
          roughness={0.7}
          emissive="#173068"
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Wireframe overlay — gold */}
      <mesh ref={wireRef} scale={1.001}>
        <sphereGeometry args={[1, 24, 18]} />
        <meshBasicMaterial color="#bd8632" wireframe transparent opacity={0.18} />
      </mesh>
      {/* Atmosphere */}
      <mesh scale={1.08}>
        <sphereGeometry args={[1, 32, 32]} />
        <shaderMaterial
          transparent
          side={THREE.BackSide}
          uniforms={{}}
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.55 - dot(vNormal, vec3(0,0,1.0)), 2.4);
              gl_FragColor = vec4(0.74, 0.62, 0.32, 1.0) * intensity;
            }
          `}
        />
      </mesh>
    </group>
  );
}

function MarkerPulse({ position, color }: { position: THREE.Vector3; color: string }) {
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const t = (clock.elapsedTime * 0.6) % 1;
    ringRef.current.scale.setScalar(1 + t * 3);
    (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 1 - t;
  });

  return (
    <group position={position}>
      {/* Core dot */}
      <mesh>
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Animated halo */}
      <mesh ref={ringRef}>
        <sphereGeometry args={[0.018, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function Connections() {
  // Curve arcs between Paris and African deployments — the "supply lines"
  const paris = latLngToVec3(48.8566, 2.3522, 1.01);
  const targets = DEPLOYMENTS.filter((d) => d.name !== "Paris");

  return (
    <>
      {targets.map((t) => {
        const start = paris.clone();
        const end = latLngToVec3(t.lat, t.lng, 1.01);
        // Mid point lifted to create an arc above the surface
        const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(1.45);
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const points = curve.getPoints(40);
        return (
          <Line
            key={t.name}
            points={points}
            color={t.color}
            lineWidth={1}
            transparent
            opacity={0.55}
          />
        );
      })}
    </>
  );
}

function Markers() {
  const positions = useMemo(
    () => DEPLOYMENTS.map((d) => ({ ...d, vec: latLngToVec3(d.lat, d.lng, 1.02) })),
    []
  );
  return (
    <>
      {positions.map((d) => (
        <MarkerPulse key={d.name} position={d.vec} color={d.color} />
      ))}
    </>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 3, 5]} intensity={1.4} color="#dcbc6c" />
      <directionalLight position={[-5, -2, -3]} intensity={0.6} color="#85a3d3" />
      <Stars radius={50} depth={40} count={1600} factor={2} fade speed={0.4} />
      <GlobeMesh />
      <Markers />
      <Connections />
    </>
  );
}

interface Props {
  className?: string;
  interactive?: boolean;
  height?: string | number;
}

/**
 * SovereignGlobe — 3D globe with deployment markers + animated supply arcs.
 * Designed for the Home hero section.
 */
export default function SovereignGlobe({
  className = "",
  interactive = true,
  height = "100%",
}: Props) {
  return (
    <div className={className} style={{ width: "100%", height }}>
      <Canvas
        camera={{ position: [0, 0.4, 3.2], fov: 36 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene />
          {interactive && (
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              autoRotate
              autoRotateSpeed={0.6}
              rotateSpeed={0.6}
              minPolarAngle={Math.PI / 2.6}
              maxPolarAngle={Math.PI / 1.6}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
