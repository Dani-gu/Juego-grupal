import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import Jugador from "./components/Jugador";
import Marcador from "./components/Marcador";
import Obstaculo from "./components/Obstaculo";
import Escenario from "./components/Escenario";

import "./App.css";

const LISTA_OBSTACULOS = [
  { x: -5.0, velocidad: 1.5 },
  { x: -3.0, velocidad: 1.8 },
  { x: -1.0, velocidad: 2.0 },
  { x: 1.0,  velocidad: 1.7 },
  { x: 3.0,  velocidad: 2.2 },
  { x: 5.0,  velocidad: 2.5 },
];

// Componente interno para controlar la cámara dinámicamente
function CamaraDinamica({
  terminado,
  victoria,
  muertes,
}: {
  terminado: boolean;
  victoria: boolean;
  muertes: number;
}) {
  const shake = useRef(0);
  const objetivoPos = useRef(new THREE.Vector3(0, 13, 16));
  const focoMirada = useRef(new THREE.Vector3(0, 0, 0));

  // Activar temblor de cámara (Screen Shake) cada vez que hay un choque
  useEffect(() => {
    if (muertes > 0) {
      shake.current = 0.9;
    }
  }, [muertes]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (terminado) {
      // Modo Cinemático: gira alrededor del escenario al ganar o perder
      const radio = victoria ? 14 : 19;
      const altura = victoria ? 9 : 14;
      objetivoPos.current.set(
        Math.sin(t * 0.6) * radio,
        altura,
        Math.cos(t * 0.6) * radio
      );
      focoMirada.current.lerp(new THREE.Vector3(0, 0.5, 0), delta * 3);
    } else {
      // Modo Juego: cámara activa con paneo y respiración suave
      objetivoPos.current.set(
        Math.sin(t * 0.5) * 2.5,          // Desplazamiento lateral suave en X
        12.5 + Math.sin(t * 1.2) * 0.6,   // Flotación vertical en Y
        15.5 + Math.cos(t * 0.7) * 1.2    // Acercamiento/alejamiento sutil en Z
      );
      focoMirada.current.lerp(
        new THREE.Vector3(Math.sin(t * 0.5) * 1.2, 0, 0),
        delta * 4
      );
    }

    // Interpolación suave hacia la posición objetivo
    state.camera.position.lerp(objetivoPos.current, delta * 3.5);

    // Aplicar temblor si acabamos de chocar
    if (shake.current > 0.01) {
      state.camera.position.x += (Math.random() - 0.5) * shake.current;
      state.camera.position.y += (Math.random() - 0.5) * shake.current;
      shake.current = THREE.MathUtils.lerp(shake.current, 0, delta * 8);
    }

    state.camera.lookAt(focoMirada.current);
  });

  return null;
}

export default function App() {
  const [muertes, setMuertes] = useState(0);
  const [vidas, setVidas] = useState(3);
  const [victoria, setVictoria] = useState(false);
  const [reinicio, setReinicio] = useState(0);

  const obstaculos = useRef<(THREE.Mesh | null)[]>([]);

  const terminado = victoria || vidas === 0;

  const chocar = () => {
    setMuertes((m) => m + 1);
    setVidas((v) => Math.max(0, v - 1));
    setReinicio((r) => r + 1);
  };

  const ganar = () => {
    setVictoria(true);
  };

  const reiniciarJuego = () => {
    setMuertes(0);
    setVidas(3);
    setVictoria(false);
    setReinicio((r) => r + 1);
  };

  return (
    <div className="juego">
      <Marcador
        muertes={muertes}
        vidas={vidas}
        victoria={victoria}
        reiniciar={reiniciarJuego}
      />

      <Canvas camera={{ position: [0, 13, 16], fov: 50 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={2} />

        {/* Controlador de cámara dinámica */}
        <CamaraDinamica
          terminado={terminado}
          victoria={victoria}
          muertes={muertes}
        />

        <Escenario />

        <Jugador
          obstaculos={obstaculos}
          onChoque={chocar}
          onVictoria={ganar}
          reinicio={reinicio}
          terminado={terminado}
        />

        {LISTA_OBSTACULOS.map((obs, index) => (
          <Obstaculo
            key={index}
            x={obs.x}
            velocidad={obs.velocidad}
            indice={index}
            referencias={obstaculos}
            detenido={terminado}
          />
        ))}

        <OrbitControls
          enablePan={false}
          enableDamping
          dampingFactor={0.05}
          minDistance={8}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2.2} // Evita que la cámara baje por debajo del suelo
        />
      </Canvas>
    </div>
  );
}