
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

import Jugador from "./components/Jugador";
import Marcador from "./components/Marcador";
import Obstaculo from "./components/Obstaculo";
import Escenario from "./components/Escenario";

import "./App.css";

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

      <Canvas camera={{ position: [0, 15, 18], fov: 50 }}>
        <ambientLight intensity={1.5} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={2}
        />

        <Escenario />

        <Jugador
          obstaculos={obstaculos}
          onChoque={chocar}
          onVictoria={ganar}
          reinicio={reinicio}
          terminado={terminado}
        />

        <Obstaculo
          x={-3}
          velocidad={1.5}
          indice={0}
          referencias={obstaculos}
          detenido={terminado}
        />

        <Obstaculo
          x={0}
          velocidad={2}
          indice={1}
          referencias={obstaculos}
          detenido={terminado}
        />

        <Obstaculo
          x={3}
          velocidad={2.5}
          indice={2}
          referencias={obstaculos}
          detenido={terminado}
        />

        <OrbitControls
          enablePan={false}
          minDistance={10}
          maxDistance={35}
        />
      </Canvas>
    </div>
  );
}
