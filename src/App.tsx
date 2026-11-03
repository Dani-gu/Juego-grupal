
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { useRef, useState } from "react";
import type { Mesh } from "three";

import Jugador from "./components/Jugador";
import Obstaculo from "./components/Obstaculo";
import Marcador from "./components/Marcador";

import "./App.css";

function Zona({
  x,
  color,
  letra
}: {
  x: number;
  color: string;
  letra: string;
}) {
  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[1, 1, 0.1, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>

      <Text position={[0, 1.5, 0]} fontSize={0.8} color="white">
        {letra}
      </Text>
    </group>
  );
}

function App() {
  const [muertes, setMuertes] = useState(0);
  const [vidas, setVidas] = useState(3);
  const [victoria, setVictoria] = useState(false);
  const [reinicio, setReinicio] = useState(0);

  const obstaculos = useRef<(Mesh | null)[]>([]);

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

        {/* Pista */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[22, 10]} />
          <meshStandardMaterial color="#355e3b" />
        </mesh>

        {/* Inicio y meta */}
        <Zona x={-8} color="limegreen" letra="A" />
        <Zona x={8} color="dodgerblue" letra="B" />

        {/* Jugador */}
        <Jugador
          obstaculos={obstaculos}
          onChoque={chocar}
          onVictoria={ganar}
          reinicio={reinicio}
          terminado={terminado}
        />

        {/* Obstáculos */}
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

export default App;
