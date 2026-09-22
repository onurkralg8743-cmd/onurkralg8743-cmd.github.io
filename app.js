const navMenu = document.getElementById("navMenu");
document.getElementById("menuBtn").onclick = () => {
  navMenu.classList.toggle("open");
};

const modal = document.getElementById("authModal");

function openModal() {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

document.getElementById("authBtn").onclick = openModal;
document.getElementById("heroAuthBtn").onclick = openModal;
document.getElementById("closeModal").onclick = closeModal;

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((x) => x.classList.remove("active"));
    tab.classList.add("active");

    const signup = tab.dataset.mode === "signup";

    document.getElementById("authTitle").textContent =
      signup ? "Yeni hesap oluştur 🚀" : "Tekrar hoş geldin 👋";

    document.getElementById("authDesc").textContent =
      signup ? "Ücretsiz hesabını oluştur." : "Hesabına giriş yap.";

    document.getElementById("submitBtn").textContent =
      signup ? "Kayıt Ol" : "Giriş Yap";
  });
});

document.getElementById("themeBtn").onclick = () => {
  document.body.classList.toggle("alt");
  localStorage.setItem(
    "onur-theme",
    document.body.classList.contains("alt") ? "alt" : "default"
  );
};

if (localStorage.getItem("onur-theme") === "alt") {
  document.body.classList.add("alt");
}

const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

musicBtn.onclick = async () => {
  try {
    if (music.paused) {
      await music.play();
      musicBtn.textContent = "⏸️ Müzik";
    } else {
      music.pause();
      musicBtn.textContent = "🎵 Müzik";
    }
  } catch (err) {
    alert("Müzik için site klasörüne music.mp3 adlı bir dosya ekle.");
  }
};

document.getElementById("authForm").addEventListener("submit", (e) => {
  e.preventDefault();

  document.getElementById("authMessage").textContent =
    "Giriş/Kayıt arayüzü hazır. Gerçek hesap sistemi için Supabase bağlantısı kurulması gerekiyor.";
});
