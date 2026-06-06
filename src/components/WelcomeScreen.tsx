interface Props {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full animate-fade-in">
        <div className="text-center mb-10">
          <img
            src="/app-icon.png"
            alt="IQ Test アプリアイコン"
            className="w-20 h-20 rounded-2xl mb-6 shadow-lg shadow-blue-500/30"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            知能指数テスト
          </h1>
          <p className="text-lg text-slate-300 max-w-lg mx-auto leading-relaxed">
            5つの認知領域を測定する、科学的アプローチに基づいた
            年代別の標準化IQテストです
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-8">
          <h2 className="text-white font-semibold text-lg mb-4">対応年代</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: '🌱', label: '小学生低学年', desc: '小学1〜3年生' },
              { icon: '📚', label: '小学生高学年', desc: '小学4〜6年生' },
              { icon: '🎒', label: '中学生', desc: '中学1〜3年生' },
              { icon: '🎓', label: '高校生', desc: '高校1〜3年生' },
              { icon: '🏫', label: '大学生', desc: '大学・専門学校' },
              { icon: '💼', label: '大人', desc: '社会人・一般' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 text-slate-200">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-sm text-slate-400">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-white font-semibold text-sm mb-3">測定する5つの領域</h3>
            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <span>🔷 図形推理</span>
              <span>🔢 数列推理</span>
              <span>💬 言語类比</span>
              <span>🧩 論理推理</span>
              <span>📐 空間認知</span>
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full py-4 px-8 bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold text-lg rounded-xl hover:from-blue-600 hover:to-violet-700 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          年代を選んでテストを始める
        </button>

        <p className="text-center text-slate-500 text-xs mt-6">
          ※ 本テストは娯楽・自己評価目的です。正式な心理検査の代替ではありません。
        </p>
      </div>
    </div>
  );
}
