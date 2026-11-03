import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const CARRILES_OBSTACULOS = [-5, -3, -1, 1, 3, 5];

function IslaHexagonal({
  x,
  color,
  letra,
  etiqueta,
}: {
  x: number;
  color: string;
  letra: string;
  etiqueta: string;
}) {
  const portalRef = useRef<THREE.Mesh>(null);
  const textoRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (portalRef.current) {
      portalRef.current.rotation.z -= delta * 1.5;
    }
    if (textoRef.current) {
      textoRef.current.position.y = 1.9 + Math.sin(t * 2.5 + x) * 0.15;
    }
  });

  return (
    <group position={[x, 0, 0]}>
      {/* Base rocosa/metálica hexagonal invertida (forma de isla flotante) */}
      <mesh position={[0, -0.65, 0]} receiveShadow>
        <cylinderGeometry args={[4.2, 1.8, 1.3, 6]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Superficie hexagonal superior al nivel y = 0 */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[4.3, 4.2, 0.1, 6]} />
        <meshStandardMaterial color="#312e81" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Borde hexagonal neón */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.9, 4.15, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Plataforma central de llegada/salida */}
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <cylinderGeometry args={[1.1, 1.25, 0.12, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Aro giratorio hexagonal alrededor de la base */}
      <mesh
        ref={portalRef}
        position={[0, 0.14, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[1.35, 1.55, 6]} />
        <meshStandardMaterial
          color="white"
          emissive={color}
          emissiveIntensity={1.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Texto flotante */}
      <group ref={textoRef} position={[0, 1.9, 0]}>
        <Text
          fontSize={0.9}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.06}
          outlineColor="#090d16"
        >
          {letra}
        </Text>
        <Text
          position={[0, -0.55, 0]}
          fontSize={0.25}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#090d16"
        >
          {etiqueta}
        </Text>
      </group>
    </group>
  );
}

export default function Escenario() {
  const nucleoRef = useRef<THREE.Mesh>(null);
  const cristalesRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (nucleoRef.current) {
      nucleoRef.current.rotation.z += delta * 0.4;
      const pulso = 1 + Math.sin(t * 2) * 0.05;
      nucleoRef.current.scale.set(pulso, pulso, 1);
    }
    if (cristalesRef.current) {
      cristalesRef.current.children.forEach((cristal, i) => {
        cristal.position.y = Math.sin(t * 1.8 + i) * 0.4;
        cristal.rotation.y += delta;
        cristal.rotation.x += delta * 0.5;
      });
    }
  });

  return (
    <group>
      {/* Abismo de energía circular debajo del puente */}
      <mesh
        ref={nucleoRef}
        position={[0, -2.2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[2, 14, 32]} />
        <meshStandardMaterial
          color="#4c1d95"
          emissive="#7c3aed"
          emissiveIntensity={0.35}
          wireframe
        />
      </mesh>

      {/* Pasarela central suspendida que conecta la Isla A con la Isla B */}
      <mesh position={[0, -0.18, 0]} receiveShadow>
        <boxGeometry args={[12.5, 0.36, 8.6]} />
        <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Piso octogonal/estilizado de la pasarela central */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 8.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Rieles de neón laterales del puente (Norte y Sur) */}
      <mesh position={[0, 0.12, -4.2]}>
        <boxGeometry args={[12, 0.18, 0.18]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.9}
        />
      </mesh>
      <mesh position={[0, 0.12, 4.2]}>
        <boxGeometry args={[12, 0.18, 0.18]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.9}
        />
      </mesh>

      {/* 6 Costillas y pilares laterales en cada carril de obstáculo */}
      {CARRILES_OBSTACULOS.map((xPos, idx) => (
        <group key={idx} position={[xPos, 0, 0]}>
          {/* Franja luminosa en el suelo para marcar el paso del obstáculo */}
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.22, 8.1]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={0.6}
            />
          </mesh>

          {/* Soportes inclinados en los bordes Norte y Sur del puente */}
          <mesh position={[0, 0.35, -4.35]} rotation={[0.3, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.14, 0.9, 6]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.35, 4.35]} rotation={[-0.3, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.14, 0.9, 6]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Cristales flotantes decorativos alrededor del puente */}
      <group ref={cristalesRef}>
        {[
          [-6, -6],
          [0, -6.5],
          [6, -6],
          [-6, 6],
          [0, 6.5],
          [6, 6],
        ].map(([cx, cz], i) => (
          <mesh key={i} position={[cx, 0, cz]}>
            <octahedronGeometry args={[0.45, 0]} />
            <meshStandardMaterial
              color="#a855f7"
              emissive="#9333ea"
              emissiveIntensity={0.8}
              roughness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* Islas Hexagonales en los extremos (Zonas A y B) */}
      <IslaHexagonal x={-8} color="#22c55e" letra="A" etiqueta="ORIGEN" />
      <IslaHexagonal x={8} color="#3b82f6" letra="B" etiqueta="PORTAL" />
    </group>
  );
}