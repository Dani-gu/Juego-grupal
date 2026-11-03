import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type Props = {
  x: number;
  velocidad: number;
  indice: number;
  referencias: React.RefObject<(THREE.Mesh | null)[]>;
  detenido: boolean;
};

export default function Obstaculo({
  x,
  velocidad,
  indice,
  referencias,
  detenido
}: Props) {
  const obstaculo = useRef<THREE.Mesh>(null);
  const tiempo = useRef(0);

  useFrame((_, delta) => {
    if (!obstaculo.current) return;

    referencias.current[indice] = obstaculo.current;

    if (detenido) return;

    tiempo.current += delta;

    obstaculo.current.position.z =
      Math.sin(tiempo.current * velocidad + indice) * 3.5;

    obstaculo.current.rotation.y += delta;
  });

  return (
    <mesh ref={obstaculo} position={[x, 0.7, 0]}>
      <boxGeometry args={[1, 1.4, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}