<?php
require __DIR__ . '/auth.php';
iq_session_start();

if (empty($_SESSION['iq_csrf']) || !is_string($_SESSION['iq_csrf'])) {
    $_SESSION['iq_csrf'] = bin2hex(random_bytes(16));
}

$error = '';
$postedId = '';
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $postedId = isset($_POST['login_id']) ? trim((string) $_POST['login_id']) : '';
    $postedPassword = isset($_POST['password']) ? (string) $_POST['password'] : '';
    $postedToken = isset($_POST['csrf']) ? (string) $_POST['csrf'] : '';
    $tokenOk = is_string($_SESSION['iq_csrf']) && hash_equals($_SESSION['iq_csrf'], $postedToken);
    if ($tokenOk && iq_check_login($postedId, $postedPassword)) {
        session_regenerate_id(true);
        $_SESSION['iq_user'] = $postedId;
        $_SESSION['iq_csrf'] = bin2hex(random_bytes(16));
        $home = iq_cookie_path();
        if ($home !== '/') {
            $home .= '/';
        }
        header('Location: ' . $home, true, 303);
        header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
        exit;
    }
    $error = 'IDまたはパスワードが違います';
}

if (iq_logged_in()) {
    $app = __DIR__ . '/index.html';
    if (!is_file($app)) {
        http_response_code(500);
        header('Content-Type: text/plain; charset=UTF-8');
        echo "画面を読み込めません\n";
        exit;
    }
    $html = file_get_contents($app);
    if (!is_string($html)) {
        http_response_code(500);
        header('Content-Type: text/plain; charset=UTF-8');
        echo "画面を読み込めません\n";
        exit;
    }
    $save = <<<'HTML'
<script>(function(){try{var i=sessionStorage.getItem("iq_pending_id");var p=sessionStorage.getItem("iq_pending_password");if(i&&p){localStorage.setItem("iq_login_id",i);localStorage.setItem("iq_login_password",p);sessionStorage.removeItem("iq_pending_id");sessionStorage.removeItem("iq_pending_password");}}catch(e){}})();</script>
<script>if("serviceWorker"in navigator){navigator.serviceWorker.register("./sw.js",{scope:"./"}).catch(function(){});}</script>
HTML;
    $html = preg_replace('/<\\/head>/', $save . '</head>', $html, 1);
    header('Content-Type: text/html; charset=UTF-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    header('Expires: 0');
    header('X-Content-Type-Options: nosniff');
    echo $html;
    exit;
}

header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');
header('X-Content-Type-Options: nosniff');
http_response_code(200);
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="theme-color" content="#1e293b">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="知能指数テスト">
    <meta name="description" content="5つの認知領域を測定する年代別の標準化IQテスト">
    <link rel="manifest" href="./manifest.webmanifest">
    <link rel="icon" type="image/png" sizes="192x192" href="./icons/icon-192.png">
    <link rel="apple-touch-icon" href="./icons/icon-192.png">
    <title>ログイン｜知能指数テスト</title>
    <script>
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("./sw.js", { scope: "./" }).catch(function () {});
        }
    </script>
    <style>
        * { box-sizing: border-box; }
        html, body {
            margin: 0;
            min-height: 100%;
            font-family: "Segoe UI", "Hiragino Sans", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
            color: #f8fafc;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
        }
        body { min-height: 100vh; }
        main { max-width: 430px; margin: 0 auto; padding: 36px 16px 48px; }
        header { text-align: center; }
        .mark {
            width: 80px;
            height: 80px;
            border-radius: 18px;
            box-shadow: 0 10px 30px rgba(59, 130, 246, 0.35);
        }
        h1 { margin: 16px 0 0; font-size: 1.8rem; letter-spacing: 0.02em; }
        .lead { margin: 8px 0 0; color: #cbd5e1; line-height: 1.7; }
        form {
            margin-top: 22px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 20px;
            padding: 20px;
            backdrop-filter: blur(8px);
        }
        label { display: block; font-size: 0.85rem; font-weight: 700; color: #93c5fd; margin-bottom: 6px; }
        .field { margin-bottom: 14px; }
        input {
            width: 100%;
            border: 1px solid rgba(255, 255, 255, 0.16);
            background: rgba(15, 23, 42, 0.7);
            border-radius: 12px;
            padding: 12px 14px;
            font: inherit;
            color: inherit;
        }
        .password-row { display: flex; gap: 8px; }
        .password-row input { min-width: 0; }
        button, .toggle { font: inherit; cursor: pointer; }
        .toggle {
            flex: 0 0 auto;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: rgba(255, 255, 255, 0.08);
            color: #e2e8f0;
            padding: 0 14px;
            font-weight: 700;
        }
        .submit {
            width: 100%;
            border: none;
            border-radius: 15px;
            background: linear-gradient(90deg, #3b82f6, #7c3aed);
            color: #f8fafc;
            font-weight: 800;
            padding: 14px;
        }
        .error {
            margin: 0 0 14px;
            padding: 10px 12px;
            border-radius: 12px;
            background: rgba(239, 68, 68, 0.16);
            color: #fecaca;
            font-size: 0.95rem;
            font-weight: 700;
        }
        [hidden] { display: none !important; }
    </style>
</head>
<body>
    <main>
        <header>
            <img class="mark" src="./icons/icon-192.png" alt="" width="80" height="80">
            <h1>知能指数テスト</h1>
            <p class="lead">入るには ID とパスワードが必要です</p>
        </header>
        <form method="post" action="" autocomplete="off">
            <input type="hidden" name="csrf" value="<?php echo htmlspecialchars($_SESSION['iq_csrf'], ENT_QUOTES, 'UTF-8'); ?>">
            <p id="loginError" class="error" role="alert"<?php echo $error === '' ? ' hidden' : ''; ?>><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></p>
            <div class="field">
                <label for="login_id">ID</label>
                <input id="login_id" name="login_id" type="text" inputmode="text" autocomplete="username" required maxlength="64" value="<?php echo htmlspecialchars($postedId, ENT_QUOTES, 'UTF-8'); ?>">
            </div>
            <div class="field">
                <label for="password">パスワード</label>
                <div class="password-row">
                    <input id="password" name="password" type="password" autocomplete="current-password" required maxlength="128">
                    <button type="button" class="toggle" id="togglePassword" aria-controls="password" aria-pressed="false">表示</button>
                </div>
            </div>
            <button type="submit" class="submit">入る</button>
        </form>
    </main>
    <script>
        var idKey = "iq_login_id";
        var passwordKey = "iq_login_password";
        var form = document.querySelector("form");
        var idInput = document.getElementById("login_id");
        var passwordInput = document.getElementById("password");
        var errorBox = document.getElementById("loginError");

        document.getElementById("togglePassword").addEventListener("click", function () {
            var showing = passwordInput.type === "text";
            passwordInput.type = showing ? "password" : "text";
            this.textContent = showing ? "表示" : "隠す";
            this.setAttribute("aria-pressed", showing ? "false" : "true");
        });

        form.addEventListener("submit", function () {
            try {
                sessionStorage.setItem("iq_pending_id", idInput.value.trim());
                sessionStorage.setItem("iq_pending_password", passwordInput.value);
            } catch (err) {}
        });

        try {
            var failed = errorBox && !errorBox.hasAttribute("hidden") && errorBox.textContent;
            if (failed) {
                localStorage.removeItem(passwordKey);
                sessionStorage.removeItem("iq_pending_id");
                sessionStorage.removeItem("iq_pending_password");
            }
            var savedId = localStorage.getItem(idKey) || "";
            var savedPassword = localStorage.getItem(passwordKey) || "";
            if (!failed && savedId && savedPassword) {
                idInput.value = savedId;
                passwordInput.value = savedPassword;
                try {
                    sessionStorage.setItem("iq_pending_id", savedId);
                    sessionStorage.setItem("iq_pending_password", savedPassword);
                } catch (err) {}
                form.submit();
            } else if (savedId && !idInput.value) {
                idInput.value = savedId;
            }
        } catch (err) {}
    </script>
</body>
</html>
