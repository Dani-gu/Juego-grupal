
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

type ObstaculoProps = {
  x: number;
  velocidad: number;
  indice: number;
  referencias: { current: (Mesh | null)[] };
  detenido: boolean;
};

export default function Obstaculo({
  x,
  velocidad,
  indice,
  referencias,
  detenido
}: ObstaculoProps) {

  const obstaculo = useRef<Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (!obstaculo.current) return;

    if (!detenido) {
      const tiempo = clock.getElapsedTime();

      obstaculo.current.position.z =
        Math.sin(tiempo * velocidad + indice) * 3.5;

      obstaculo.current.rotation.y += delta * 1.5;
    }

    // Compartir posición con el jugador
    referencias.current[indice] = obstaculo.current;
  });

  return (
    <mesh
      ref={obstaculo}
      position={[x, 0.7, 0]}
    >
      <boxGeometry args={[1, 1.4, 1]} />

      <meshStandardMaterial color="red" />
    </mesh>
  );
}
