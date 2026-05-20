interface MatchToastProps {
  author: string;
}

export const MatchToast: React.FC<MatchToastProps> = ({ author }) => {
  return (
    <div className="mb-6 py-2 px-4 bg-green-100 text-green-800 rounded-lg shadow-md max-w-lg w-full text-center animate-banner-fade">
      <p className="text-base">
        <span className="font-bold">{author}</span> の作品を見つけました！
      </p>
    </div>
  );
};
