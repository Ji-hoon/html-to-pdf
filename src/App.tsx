import React, { useState, useRef, useCallback } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@600;700;800&family=Noto+Sans+KR:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f4f3f0;
    --surface: #fafaf8;
    --border: #e2e0da;
    --border-strong: #c8c5bc;
    --text: #1a1916;
    --text-2: #6b6860;
    --text-3: #a8a59e;
    --accent: #2a5c45;
    --accent-light: #e8f2ec;
    --accent-border: #b8d4c4;
    --red: #c0392b;
    --red-light: #fdf0ee;
  }

  body {
    background: var(--bg);
    font-family: 'Noto Sans KR', sans-serif;
    font-weight: 300;
    color: var(--text);
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* ── TOP BAR ── */
  .topbar {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 0 32px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .logo-mark {
    width: 28px;
    height: 28px;
    background: var(--text);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-mark svg { width: 14px; height: 14px; }

  .logo-text {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text);
  }

  .logo-sub {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--text-3);
    letter-spacing: 0.05em;
  }

  .topbar-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 16px;
    border-radius: 7px;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    border: none;
    outline: none;
    white-space: nowrap;
  }

  .btn svg { width: 14px; height: 14px; flex-shrink: 0; }

  .btn-ghost {
    background: transparent;
    color: var(--text-2);
    border: 1px solid var(--border);
  }
  .btn-ghost:hover {
    background: var(--bg);
    color: var(--text);
    border-color: var(--border-strong);
  }

  .btn-primary {
    background: var(--text);
    color: #fff;
    border: 1px solid var(--text);
  }
  .btn-primary:hover { background: #2d2b26; }
  .btn-primary:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .btn-accent {
    background: var(--accent);
    color: #fff;
    border: 1px solid var(--accent);
  }
  .btn-accent:hover { background: #1e4533; }

  /* ── MAIN LAYOUT ── */
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  /* ── DROP ZONE ── */
  .drop-area {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 32px;
  }

  .drop-zone {
    width: 100%;
    max-width: 520px;
    border: 2px dashed var(--border-strong);
    border-radius: 16px;
    background: var(--surface);
    padding: 64px 48px;
    text-align: center;
    transition: all 0.2s ease;
    cursor: pointer;
    position: relative;
  }

  .drop-zone.dragging {
    border-color: var(--accent);
    background: var(--accent-light);
    transform: scale(1.01);
  }

  .drop-zone:hover { border-color: var(--border-strong); background: #fff; }

  .drop-icon {
    width: 56px;
    height: 56px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
  }
  .drop-icon svg { width: 24px; height: 24px; color: var(--text-2); }

  .drop-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text);
    margin-bottom: 8px;
  }

  .drop-sub {
    font-size: 13px;
    color: var(--text-3);
    margin-bottom: 28px;
    line-height: 1.6;
  }

  .drop-hint {
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
    color: var(--text-3);
    background: var(--bg);
    border: 1px solid var(--border);
    padding: 5px 12px;
    border-radius: 4px;
    display: inline-block;
  }

  .file-input { display: none; }

  /* ── PREVIEW LAYOUT ── */
  .preview-layout {
    flex: 1;
    display: grid;
    grid-template-columns: 280px 1fr;
    height: calc(100vh - 56px);
  }

  /* ── SIDEBAR ── */
  .sidebar {
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .sidebar-header {
    padding: 20px 20px 16px;
    border-bottom: 1px solid var(--border);
  }

  .sidebar-label {
    font-family: 'DM Mono', monospace;
    font-size: 9.5px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-bottom: 10px;
  }

  .file-card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 14px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .file-card-icon {
    width: 32px;
    height: 32px;
    background: var(--text);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .file-card-icon svg { width: 14px; height: 14px; color: #fff; }

  .file-card-info { flex: 1; min-width: 0; }

  .file-card-name {
    font-size: 12.5px;
    font-weight: 500;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 2px;
  }

  .file-card-size {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--text-3);
  }

  .file-card-remove {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-3);
    padding: 2px;
    border-radius: 4px;
    display: flex;
    transition: color 0.15s;
    flex-shrink: 0;
  }
  .file-card-remove:hover { color: var(--red); }
  .file-card-remove svg { width: 14px; height: 14px; }

  .sidebar-actions {
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-bottom: 1px solid var(--border);
  }

  .sidebar-actions .btn { width: 100%; justify-content: center; }

  .sidebar-info {
    padding: 16px 20px;
    flex: 1;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px 0;
    border-bottom: 1px solid var(--border);
    font-size: 11.5px;
  }
  .info-row:last-child { border-bottom: none; }

  .info-key {
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
    color: var(--text-3);
  }
  .info-val { color: var(--text-2); font-weight: 400; }

  .status-dot {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--accent);
    font-size: 11px;
  }
  .status-dot::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    animation: blink 2s infinite;
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  /* ── PREVIEW PANE ── */
  .preview-pane {
    background: #e8e6e0;
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px;
    gap: 0;
    position: relative;
  }

  .preview-toolbar {
    width: 100%;
    max-width: 900px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .preview-toolbar-label {
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
    color: #888;
    letter-spacing: 0.05em;
  }

  .zoom-controls {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 7px;
    padding: 4px 10px;
  }

  .zoom-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-2);
    font-size: 16px;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background 0.1s;
    font-family: 'DM Mono', monospace;
  }
  .zoom-btn:hover { background: var(--bg); }

  .zoom-val {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--text-2);
    min-width: 38px;
    text-align: center;
  }

  .iframe-shadow {
    box-shadow: 0 4px 40px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.08);
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    transform-origin: top center;
    transition: transform 0.2s ease;
  }

  .preview-iframe {
    border: none;
    display: block;
    width: 820px;
    height: 1160px;
  }

  /* ── PRINT ── */
  @media print {
    .topbar, .sidebar, .preview-toolbar, .zoom-controls { display: none !important; }
    .preview-layout { display: block; height: auto; }
    .preview-pane { padding: 0; background: white; }
    .iframe-shadow { box-shadow: none; }
  }
`;

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [zoom, setZoom] = useState(85);
  const [printing, setPrinting] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback((f: File) => {
    if (!f || !f.name.endsWith(".html")) return;
    const reader = new FileReader();
    reader.onload = (e:ProgressEvent<FileReader>) => {
      setFile(f);
      setHtmlContent(e?.target?.result as string);
    };
    reader.readAsText(f);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    loadFile(f);
  }, [loadFile]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) loadFile(f);
  };

  const reset = () => { setFile(null); setHtmlContent(null); };

  const printPDF = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    setPrinting(true);
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setPrinting(false);
    }, 300);
  };

  const blobUrl = htmlContent
    ? URL.createObjectURL(new Blob([htmlContent], { type: "text/html" }))
    : null;

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* TOP BAR */}
        <div className="topbar">
          <div className="logo">
            <div className="logo-mark">
              <svg fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="logo-text">HTML → PDF</div>
              <div className="logo-sub">Preview & Export</div>
            </div>
          </div>
          <div className="topbar-actions">
            {htmlContent && (
              <>
                <button className="btn btn-ghost" onClick={reset}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  다른 파일
                </button>
                <button className="btn btn-primary" onClick={printPDF} disabled={printing}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  {printing ? "준비 중..." : "PDF 출력"}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="main">
          {!htmlContent ? (
            /* ── DROP ZONE ── */
            <div className="drop-area">
              <div
                className={`drop-zone${dragging ? " dragging" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".html"
                  className="file-input"
                  onChange={onFileChange}
                />
                <div className="drop-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="drop-title">
                  {dragging ? "여기에 놓으세요" : "HTML 파일 업로드"}
                </div>
                <div className="drop-sub">
                  파일을 드래그해서 놓거나<br />클릭해서 선택하세요
                </div>
                <div className="drop-hint">.html 파일만 지원</div>
              </div>
            </div>
          ) : (
            /* ── PREVIEW LAYOUT ── */
            <div className="preview-layout">
              {/* SIDEBAR */}
              <div className="sidebar">
                <div className="sidebar-header">
                  <div className="sidebar-label">업로드된 파일</div>
                  <div className="file-card">
                    <div className="file-card-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="file-card-info">
                      <div className="file-card-name">{file?.name}</div>
                      <div className="file-card-size">{formatBytes(file?.size ?? 0)}</div>
                    </div>
                    <button className="file-card-remove" onClick={reset} title="파일 제거">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="sidebar-actions">
                  <button className="btn btn-primary" onClick={printPDF} disabled={printing}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    {printing ? "준비 중..." : "PDF 출력 / 저장"}
                  </button>
                  <button className="btn btn-ghost" onClick={() => fileInputRef.current?.click()}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    다른 파일 선택
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".html"
                    className="file-input"
                    onChange={onFileChange}
                  />
                </div>

                <div className="sidebar-info">
                  <div className="sidebar-label" style={{ marginBottom: 8 }}>파일 정보</div>
                  <div className="info-row">
                    <span className="info-key">파일명</span>
                    <span className="info-val" style={{ fontSize: 11, maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {file?.name}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-key">크기</span>
                    <span className="info-val">{formatBytes(file?.size ?? 0)}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-key">형식</span>
                    <span className="info-val">text/html</span>
                  </div>
                  <div className="info-row">
                    <span className="info-key">상태</span>
                    <span className="info-val">
                      <span className="status-dot">미리보기 중</span>
                    </span>
                  </div>

                  <div style={{ marginTop: 20, padding: "14px", background: "#f0f2ee", border: "1px solid #d4dcce", borderRadius: 8, fontSize: 11.5, color: "#4a5e47", lineHeight: 1.7 }}>
                    <strong style={{ display: "block", marginBottom: 4, fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em", textTransform: "uppercase" }}>PDF 저장 방법</strong>
                    출력 대화상자에서 <strong>대상 → PDF로 저장</strong>을 선택하세요.
                  </div>
                </div>
              </div>

              {/* PREVIEW PANE */}
              <div className="preview-pane">
                <div className="preview-toolbar">
                  <span className="preview-toolbar-label">미리보기 — A4</span>
                  <div className="zoom-controls">
                    <button className="zoom-btn" onClick={() => setZoom(z => Math.max(40, z - 10))}>−</button>
                    <span className="zoom-val">{zoom}%</span>
                    <button className="zoom-btn" onClick={() => setZoom(z => Math.min(150, z + 10))}>+</button>
                  </div>
                </div>

                <div
                  className="iframe-shadow"
                  style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
                >
                  <iframe
                    ref={iframeRef}
                    src={blobUrl ?? undefined}
                    className="preview-iframe"
                    title="HTML Preview"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
