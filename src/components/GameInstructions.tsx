export const GameInstructions: React.FC = () => {
  return (
    <div className="mt-8 w-full max-w-6xl border-t border-stone-300/80 pt-5 text-stone-700">
      <h2 className="mb-3 text-base font-bold text-stone-950">遊び方</h2>
      <ul className="grid gap-2 text-sm leading-6 md:grid-cols-2">
        <li>カードをクリックして、同じ作者の絵画のペアを見つけてください</li>
        <li>各カードは絵画の縦横比を維持して表示されます。</li>
        <li>すべてのペアを見つけたらゲーム終了です</li>
        <li>なるべく少ないターン数でクリアを目指しましょう！</li>
      </ul>
    </div>
  );
};
