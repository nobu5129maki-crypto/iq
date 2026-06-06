import { useInstallPrompt } from '../hooks/useInstallPrompt';

export function InstallPrompt() {
  const { canInstall, isInstalled, showIosHint, isIosDevice, install, dismissIosHint } =
    useInstallPrompt();

  if (isInstalled) {
    return (
      <p className="text-center text-emerald-400/80 text-xs mt-4">
        ✓ ホーム画面にインストール済みです
      </p>
    );
  }

  return (
    <>
      {canInstall && (
        <button
          type="button"
          onClick={install}
          className="w-full mt-4 py-3 px-6 bg-white/10 backdrop-blur-md border border-white/15 text-white font-medium rounded-xl hover:bg-white/15 transition-all flex items-center justify-center gap-2"
        >
          <span>📲</span>
          {isIosDevice ? 'ホーム画面に追加' : 'アプリをインストール'}
        </button>
      )}

      {showIosHint && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={dismissIosHint}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-slate-800 text-lg mb-3">ホーム画面に追加</h3>
            <ol className="text-sm text-slate-600 space-y-3 list-decimal list-inside">
              <li>
                画面下の <strong>共有ボタン</strong>
                <span className="inline-block mx-1 px-1.5 py-0.5 bg-slate-100 rounded text-xs">
                  □↑
                </span>
                をタップ
              </li>
              <li>
                <strong>「ホーム画面に追加」</strong>を選択
              </li>
              <li>
                右上の <strong>追加</strong> をタップ
              </li>
            </ol>
            <button
              type="button"
              onClick={dismissIosHint}
              className="w-full mt-5 py-3 bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold rounded-xl"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </>
  );
}
