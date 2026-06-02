export interface HTMLContentParams {
  courseTitle: string;
  courseCategory: string;
  instructorName: string;
}

export function getCoursePlayerHTML({
  courseTitle,
  courseCategory,
  instructorName,
}: HTMLContentParams): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LMS Course Content Player</title>
  <style>
    :root {
      --primary: #6366f1;
      --primary-dark: #4f46e5;
      --bg: #0f172a;
      --card: #1e293b;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --border: #334155;
      --success: #10b981;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    body {
      background-color: var(--bg);
      color: var(--text);
      padding: 16px;
      line-height: 1.5;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
    }

    /* Video/Lesson Player Mock */
    .player-container {
      width: 100%;
      aspect-ratio: 16 / 9;
      background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
      border-radius: 12px;
      border: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      overflow: hidden;
      margin-bottom: 20px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
    }

    .play-btn {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background-color: var(--primary);
      border: none;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      font-size: 24px;
      transition: all 0.2s ease;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
    }

    .play-btn:hover {
      transform: scale(1.1);
      background-color: var(--primary-dark);
    }

    .player-overlay-text {
      margin-top: 12px;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-muted);
    }

    /* Course Meta */
    .course-header {
      margin-bottom: 24px;
    }

    .badge {
      display: inline-block;
      padding: 4px 8px;
      background-color: rgba(99, 102, 241, 0.15);
      color: var(--primary);
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 8px;
      letter-spacing: 0.05em;
    }

    .course-title {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .instructor {
      font-size: 13px;
      color: var(--text-muted);
    }

    /* Action Card */
    .action-card {
      background-color: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 24px;
    }

    .complete-btn {
      width: 100%;
      padding: 14px;
      background-color: var(--primary);
      border: none;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      font-size: 15px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .complete-btn:active {
      background-color: var(--primary-dark);
    }

    /* Connection / Handshake debug panel */
    .debug-panel {
      background-color: #020617;
      border: 1px dashed #475569;
      border-radius: 10px;
      padding: 16px;
      font-family: Courier, monospace;
      font-size: 12px;
    }

    .debug-title {
      font-weight: bold;
      color: var(--primary);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .debug-status {
      display: inline-block;
      padding: 2px 6px;
      background-color: rgba(16, 185, 129, 0.15);
      color: var(--success);
      border-radius: 4px;
      font-size: 10px;
    }

    .debug-row {
      margin-bottom: 6px;
      color: #cbd5e1;
      word-break: break-all;
    }

    .debug-label {
      color: var(--text-muted);
    }

    .debug-val {
      color: #38bdf8;
    }
  </style>
</head>
<body>

  <div class="container">
    <!-- Player -->
    <div class="player-container">
      <button class="play-btn" id="playBtn">&#9658;</button>
      <p class="player-overlay-text" id="statusText">Press play to start interactive lesson</p>
    </div>

    <!-- Details -->
    <div class="course-header">
      <span class="badge">${courseCategory}</span>
      <h1 class="course-title">${courseTitle}</h1>
      <p class="instructor">Instructor: ${instructorName}</p>
    </div>

    <!-- Complete Lesson -->
    <div class="action-card">
      <button class="complete-btn" id="completeBtn">Complete Lesson & Return</button>
    </div>

    <!-- Handshake Debug Panel -->
    <div class="debug-panel">
      <div class="debug-title">
        <span>SECURITY HANDSHAKE</span>
        <span class="debug-status">CONNECTED</span>
      </div>
      <div class="debug-row">
        <span class="debug-label">X-LMS-Course-Id:</span> 
        <span class="debug-val" id="headerCourseId">loading...</span>
      </div>
      <div class="debug-row">
        <span class="debug-label">X-LMS-User-Role:</span> 
        <span class="debug-val" id="headerUserRole">loading...</span>
      </div>
      <div class="debug-row">
        <span class="debug-label">X-LMS-User-Token:</span> 
        <span class="debug-val" id="headerUserToken">loading...</span>
      </div>
    </div>
  </div>

  <script>
    // Listen for custom injected headers
    function updateHeaders(headers) {
      if (headers) {
        document.getElementById('headerCourseId').innerText = headers['X-LMS-Course-Id'] || 'N/A';
        document.getElementById('headerUserRole').innerText = headers['X-LMS-User-Role'] || 'N/A';
        document.getElementById('headerUserToken').innerText = headers['X-LMS-User-Token'] ? (headers['X-LMS-User-Token'].substring(0, 20) + '...') : 'N/A';
      }
    }

    // Set fallback or wait for injected script
    window.onHeadersReceived = function(headers) {
      updateHeaders(headers);
    };

    if (window.LMS_HEADERS) {
      updateHeaders(window.LMS_HEADERS);
    }

    // Interactive button actions
    const playBtn = document.getElementById('playBtn');
    const statusText = document.getElementById('statusText');
    let isPlaying = false;

    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        playBtn.innerHTML = '&#10074;&#10074;';
        statusText.innerText = 'Interactive lesson in progress...';
        // Send status back to native app
        sendToNative({ type: 'STATUS', message: 'started' });
      } else {
        playBtn.innerHTML = '&#9658;';
        statusText.innerText = 'Interactive lesson paused';
        sendToNative({ type: 'STATUS', message: 'paused' });
      }
    });

    const completeBtn = document.getElementById('completeBtn');
    completeBtn.addEventListener('click', () => {
      sendToNative({ type: 'COMPLETE', message: 'lesson_completed' });
    });

    function sendToNative(data) {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      } else {
        console.log('PostMessage to native:', data);
      }
    }
  </script>
</body>
</html>
  `;
}
