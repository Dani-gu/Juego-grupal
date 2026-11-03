
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  obstaculos: React.RefObject<(THREE.Mesh | null)[]>;
  onChoque: () => void;
  onVictoria: () => void;
  reinicio: number;
  terminado: boolean;
};

export default function Jugador({
  obstaculos,
  onChoque,
  onVictoria,
  reinicio,
  terminado
}: Props) {
  const jugador = useRef<THREE.Mesh>(null);
  const teclas = useRef<Record<string, boolean>>({});
  const bloqueo = useRef(false);

  useEffect(() => {
    const bajar = (e: KeyboardEvent) => {
      const tecla = e.key.toLowerCase();
      if (tecla.startsWith("arrow")) e.preventDefault();
      teclas.current[tecla] = true;
    };

    const subir = (e: KeyboardEvent) => {
      teclas.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", bajar);
    window.addEventListener("keyup", subir);

    return () => {
      window.removeEventListener("keydown", bajar);
      window.removeEventListener("keyup", subir);
    };
  }, []);

  useEffect(() => {
    jugador.current?.position.set(-8, 0.6, 0);
    bloqueo.current = false;
    teclas.current = {};
  }, [reinicio]);

  useFrame((_, delta) => {
    if (!jugador.current || terminado || bloqueo.current) return;

    const p = jugador.current.position;
    const t = teclas.current;
    const v = 5 * Math.min(delta, 0.05);

    if (t["w"] || t["arrowup"]) p.z -= v;
    if (t["s"] || t["arrowdown"]) p.z += v;
    if (t["a"] || t["arrowleft"]) p.x -= v;
    if (t["d"] || t["arrowright"]) p.x += v;

    p.x = THREE.MathUtils.clamp(p.x, -9.5, 9.5);
    p.z = THREE.MathUtils.clamp(p.z, -4.5, 4.5);

    for (const obstaculo of obstaculos.current) {
      if (!obstaculo) continue;

      if (p.distanceTo(obstaculo.position) < 1.05) {
        bloqueo.current = true;
        onChoque();
        return;
      }
    }

    if (p.x >= 7.5 && Math.abs(p.z) < 1) {
      bloqueo.current = true;
      onVictoria();
    }
  });

  return (
    <mesh ref={jugador} position={[-8, 0.6, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}
