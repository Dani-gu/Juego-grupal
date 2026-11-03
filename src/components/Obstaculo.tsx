import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  x: number;
  velocidad: number;
  indice: number;
  referencias: React.RefObject<(THREE.Mesh | null)[]>;
  detenido: boolean;
};

const COLORES = [
  "#ef4444", // 0: Rojo
  "#f97316", // 1: Naranja
  "#eab308", // 2: Amarillo
  "#22c55e", // 3: Verde
  "#3b82f6", // 4: Azul
  "#a855f7", // 5: Morado
];

export default function Obstaculo({
  x,
  velocidad,
  indice,
  referencias,
  detenido,
}: Props) {
  const obstaculo = useRef<THREE.Mesh>(null);
  const tiempo = useRef(0);

  // Registra la referencia una sola vez al montar el componente
  useEffect(() => {
    if (referencias.current) {
      referencias.current[indice] = obstaculo.current;
    }
    return () => {
      if (referencias.current) {
        referencias.current[indice] = null;
      }
    };
  }, [indice, referencias]);

  useFrame((_, delta) => {
    const mesh = obstaculo.current;
    if (!mesh || detenido) return;

    tiempo.current += delta * velocidad;
    const t = tiempo.current + indice;

    // Selecciona uno de los 6 movimientos según el índice (0 a 5)
    switch (indice % 6) {
      case 0:
        // 1. Péndulo horizontal en Z (movimiento original mejorado)
        mesh.position.z = Math.sin(t) * 3.5;
        mesh.rotation.y += delta * 2;
        break;

      case 1:
        // 2. Rebote vertical en Y (aplastador)
        mesh.position.y = 0.7 + Math.abs(Math.sin(t * 1.5)) * 2.5;
        mesh.rotation.x += delta * 3;
        break;

      case 2:
        // 3. Movimiento circular en X y Z
        mesh.position.x = x + Math.cos(t) * 1.5;
        mesh.position.z = Math.sin(t) * 2.5;
        mesh.rotation.y -= delta * 3;
        break;

      case 3:
        // 4. Figura de 8 (infinito vertical en Z e Y)
        mesh.position.z = Math.sin(t) * 3.5;
        mesh.position.y = 1.6 + Math.sin(t * 2) * 0.9;
        mesh.rotation.z += delta * 2;
        break;

      case 4:
        // 5. Zigzag diagonal combinando avance en X y Z
        mesh.position.x = x + Math.sin(t * 1.2) * 1.8;
        mesh.position.z = Math.cos(t * 2.4) * 2.5;
        mesh.rotation.y += delta * 4;
        break;

      case 5:
        // 6. Pulso de escala + desplazamiento en Z
        mesh.position.z = Math.cos(t) * 3.5;
        const escala = 1 + Math.sin(t * 3) * 0.4;
        mesh.scale.set(escala, escala, escala);
        mesh.rotation.x += delta * 2;
        mesh.rotation.y += delta * 2;
        break;
    }
  });

  const colorObstaculo = COLORES[indice % COLORES.length];

  return (
    <mesh ref={obstaculo} position={[x, 0.7, 0]} castShadow receiveShadow>
      <boxGeometry args={[1, 1.4, 1]} />
      <meshStandardMaterial
        color={colorObstaculo}
        roughness={0.3}
        metalness={0.2}
      />
    </mesh>
  );
}