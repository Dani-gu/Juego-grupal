
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { Mesh } from "three";

type JugadorProps = {
  obstaculos: { current: (Mesh | null)[] };
  onChoque: () => void;
  onVictoria: () => void;
  reinicio: number;
  terminado: boolean;
};

const INICIO: [number, number, number] = [-8, 0.6, 0];

export default function Jugador({
  obstaculos,
  onChoque,
  onVictoria,
  reinicio,
  terminado
}: JugadorProps) {

  const jugador = useRef<Mesh>(null);
  const teclas = useRef<Record<string, boolean>>({});
  const bloqueo = useRef(false);

  useEffect(() => {
    const presionar = (e: KeyboardEvent) => {
      const tecla = e.key.toLowerCase();

      if (["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(tecla)) {
        e.preventDefault();
      }

      teclas.current[tecla] = true;
    };

    const soltar = (e: KeyboardEvent) => {
      teclas.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", presionar);
    window.addEventListener("keyup", soltar);

    return () => {
      window.removeEventListener("keydown", presionar);
      window.removeEventListener("keyup", soltar);
    };
  }, []);

  useEffect(() => {
    if (jugador.current) {
      jugador.current.position.set(...INICIO);
    }

    bloqueo.current = false;
    teclas.current = {};
  }, [reinicio]);

  useFrame((state, delta) => {
    if (!jugador.current || terminado || bloqueo.current) return;

    const velocidad = 5 * Math.min(delta, 0.05);
    const p = jugador.current.position;
    const t = teclas.current;

    if (t["w"] || t["arrowup"]) p.z -= velocidad;
    if (t["s"] || t["arrowdown"]) p.z += velocidad;
    if (t["a"] || t["arrowleft"]) p.x -= velocidad;
    if (t["d"] || t["arrowright"]) p.x += velocidad;

    // Límites de la pista
    p.x = Math.max(-9.5, Math.min(9.5, p.x));
    p.z = Math.max(-4.5, Math.min(4.5, p.z));

    // Detección de colisiones
    for (const obstaculo of obstaculos.current) {
      if (!obstaculo) continue;

      const distancia = p.distanceTo(obstaculo.position);

      if (distancia < 1.05) {
        bloqueo.current = true;
        onChoque();
        return;
      }
    }

    // Llegada a la meta B
    if (p.x >= 7.5 && Math.abs(p.z) < 1) {
      bloqueo.current = true;
      onVictoria();
    }
  });

  return (
    <mesh ref={jugador} position={INICIO}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}
