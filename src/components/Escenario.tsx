import { Text } from "@react-three/drei";

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
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[1, 1, 0.12, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>

      <Text
        position={[0, 1.5, 0]}
        fontSize={0.8}
        color="white"
      >
        {letra}
      </Text>
    </group>
  );
}

export default function Escenario() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 10]} />
        <meshStandardMaterial color="#355e3b" />
      </mesh>

      <Zona x={-8} color="limegreen" letra="A" />
      <Zona x={8} color="dodgerblue" letra="B" />
    </>
  );
}