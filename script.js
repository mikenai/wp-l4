const STORAGE_KEY = "lab4BrowserInfo";
const VARIANT_NUMBER = 4;
const commentsElement = document.getElementById("comments");
const browserInfoElement = document.getElementById("browserInfo");
const themeToggle = document.getElementById("themeToggle");
const feedbackModal = document.getElementById("feedbackModal");
const closeModal = document.getElementById("closeModal");

function collectBrowserInfo() {
  return {
    "Операційна система": navigator.platform || "Невідомо",
    "Браузер": navigator.userAgent,
    "Мова": navigator.language,
    "Онлайн": navigator.onLine ? "так" : "ні",
    "Ширина екрана": `${screen.width}px`,
    "Висота екрана": `${screen.height}px`,
    "Час збереження": new Date().toLocaleString("uk-UA")
  };
}

function saveBrowserInfo() {
  const browserInfo = collectBrowserInfo();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(browserInfo));
}

function renderBrowserInfo() {
  const savedInfo = JSON.parse(localStorage.getItem(STORAGE_KEY));

  browserInfoElement.innerHTML = Object.entries(savedInfo)
    .map(([label, value]) => `<dt>${label}</dt><dd>${value}</dd>`)
    .join("");
}

function renderComments(comments) {
  commentsElement.innerHTML = comments
    .map((comment) => `
      <article class="comment">
        <h3>${comment.name}</h3>
        <p><strong>${comment.email}</strong></p>
        <p>${comment.body}</p>
      </article>
    `)
    .join("");
}

function loadComments() {
  fetch(`https://jsonplaceholder.typicode.com/posts/${VARIANT_NUMBER}/comments`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Не вдалося завантажити коментарі.");
      }

      return response.json();
    })
    .then(renderComments)
    .catch(() => {
      commentsElement.textContent = "Коментарі тимчасово недоступні.";
    });
}

function getThemeByTime() {
  const hour = new Date().getHours();
  return hour >= 7 && hour < 21 ? "light" : "dark";
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-theme", isDark);
  themeToggle.checked = isDark;
}

function setupTheme() {
  applyTheme(getThemeByTime());

  themeToggle.addEventListener("change", () => {
    applyTheme(themeToggle.checked ? "dark" : "light");
  });
}

function openFeedbackModal() {
  feedbackModal.classList.add("is-open");
  feedbackModal.setAttribute("aria-hidden", "false");
}

function hideFeedbackModal() {
  feedbackModal.classList.remove("is-open");
  feedbackModal.setAttribute("aria-hidden", "true");
}

closeModal.addEventListener("click", hideFeedbackModal);
feedbackModal.addEventListener("click", (event) => {
  if (event.target === feedbackModal) {
    hideFeedbackModal();
  }
});

saveBrowserInfo();
renderBrowserInfo();
loadComments();
setupTheme();
setTimeout(openFeedbackModal, 1000);
