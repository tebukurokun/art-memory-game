interface MatchToastProps {
  author: string;
}

export const MatchToast: React.FC<MatchToastProps> = ({ author }) => {
  return (
    <div className="animate-banner-fade mb-6 w-full max-w-lg rounded border border-emerald-700/25 bg-emerald-50 px-4 py-2 text-center text-emerald-950 shadow-[0_12px_28px_rgba(6,78,59,0.10)]">
      <p className="text-base">
        <span className="font-bold">{author}</span> の作品を見つけました！
      </p>
    </div>
  );
};
