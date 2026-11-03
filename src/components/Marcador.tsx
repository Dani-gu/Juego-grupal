
type Props = {
  muertes: number;
  vidas: number;
  victoria: boolean;
  reiniciar: () => void;
};

export default function Marcador({
  muertes,
  vidas,
  victoria,
  reiniciar
}: Props) {
  return (
    <div className="marcador">
      <h2>🦅 MISIÓN CÓNDOR</h2>
      <p>💀 Muertes: {muertes}</p>
      <p>❤️ Vidas: {vidas}</p>
      <p>🎮 Movimiento: WASD o flechas</p>

      {victoria && (
        <h2 className="victoria">¡VICTORIA!</h2>
      )}

      {vidas === 0 && !victoria && (
        <h2 className="derrota">GAME OVER</h2>
      )}

      <button onClick={reiniciar}>
        Reiniciar juego
      </button>
    </div>
  );
}
