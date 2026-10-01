// ===== コピー用テキスト =====
const PAGE_URL = "https://ryoya9595.github.io/koushi-notify-guide/";
const GUIDE_URL = PAGE_URL + "guide.md";

const EXPLAIN_PROMPT = `「RISE講師通知」（Discordの未返信の質問をLINEで知らせる仕組み）を解説してください。

【解説書】
${GUIDE_URL}

【進め方】
1. 解説書を curl（Windows は curl.exe）で取得して、全文を読んでください。
   ※ 要約して読むツールではなく、原文をそのまま読んでください。
   ※ 解説書のファイルは、このフォルダには保存しないでください（画面に出すか、一時フォルダへ）。
2. 解説書の「解説の進め方」のとおり、私の質問を受けながら、少しずつ説明してください。
3. 専門用語はかみくだいて、短く説明してください。
4. 最後に、私の仕事に応用するならどうなるか、一緒に考えてください。`;

const APPLY_PROMPT = `この仕組みを私の仕事に当てはめたい。何を見張って、何を「済み」にして、誰に知らせるのがいいか、質問しながら一緒に考えて`;

const TEXTS = {
  explainPrompt: EXPLAIN_PROMPT,
  applyPrompt: APPLY_PROMPT,
};

Object.entries(TEXTS).forEach(([id, text]) => {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
});

// ===== コピー処理 =====
async function copyText(text, target) {
  let ok = false;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      ok = true;
    }
  } catch { ok = false; }
  if (!ok && target) {
    const range = document.createRange();
    range.selectNodeContents(target);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    sel.removeAllRanges();
  }
  return ok;
}

function showToast(msg) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

document.querySelectorAll(".copy-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const targetId = button.dataset.target;
    const target = document.getElementById(targetId);
    const text = TEXTS[targetId] || (target ? target.textContent : "");
    const ok = await copyText(text, target);
    const original = button.textContent;
    button.textContent = ok ? "コピーしました" : "手動でコピー";
    button.classList.toggle("done", ok);
    showToast(ok ? "📋 コピーしました" : "コピーできませんでした");
    setTimeout(() => {
      button.textContent = original;
      button.classList.remove("done");
    }, 2000);
  });
});

// ===== ナビ現在地ハイライト =====
const navLinks = Array.from(document.querySelectorAll(".topnav a[href^='#']"));
const sections = navLinks
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);
if ("IntersectionObserver" in window && sections.length) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const id = "#" + e.target.id;
        navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => obs.observe(s));
}
