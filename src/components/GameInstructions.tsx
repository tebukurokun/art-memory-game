export const GameInstructions: React.FC = () => {
  return (
    <div className="mt-8 p-4 bg-yellow-100 rounded-lg shadow max-w-6xl w-full">
      <h2 className="text-xl font-bold mb-2">遊び方</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>カードをクリックして、同じ作者の絵画のペアを見つけてください</li>
        <li>
          各カードは絵画の縦横比を維持し、最大サイズ内に収まるよう調整されています
        </li>
        <li>正解すると、作品のタイトルと画家名が表示されます</li>
        <li>表示された絵画をクリックすると拡大表示できます</li>
        <li>マッチしたペアは表示されたままになります</li>
        <li>すべてのペアを見つけたらゲーム終了です</li>
        <li>なるべく少ないターン数でクリアを目指しましょう！</li>
      </ul>
    </div>
  );
};
