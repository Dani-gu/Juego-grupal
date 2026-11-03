
type MarcadorProps = {
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
}: MarcadorProps) {

  return (
    <div className="marcador">

      <h2>🦅 MISIÓN CÓNDOR</h2>

      <p>💀 Muertes: {muertes}</p>
      <p>❤️ Vidas: {vidas}</p>

      {victoria && (
        <p className="victoria">¡VICTORIA!</p>
      )}

      {vidas === 0 && !victoria && (
        <p className="derrota">GAME OVER</p>
      )}

      <p>Controles: WASD / Flechas</p>

      <button onClick={reiniciar}>
        Reiniciar juego
      </button>

    </div>
  );
}
