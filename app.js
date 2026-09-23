const SUPABASE_URL = "https://jbqzozewgjvuasdksuua.supabase.co";
const SUPABASE_KEY = "sb_publishable_k3EIA-TivsPT2NDGYqZl6w_yVhXxUtA";

const { createClient } = supabase;
const client = createClient(SUPABASE_URL, SUPABASE_KEY);

const modal = document.getElementById("authModal");
const authBtn = document.getElementById("authBtn");
const heroAuthBtn = document.getElementById("heroAuthBtn");
const closeModal = document.getElementById("closeModal");

function openModal() {
  modal.classList.add("show");
}

function closeAuth() {
  modal.classList.remove("show");
}

authBtn.onclick = openModal;
heroAuthBtn.onclick = openModal;
closeModal.onclick = closeAuth;

modal.onclick = (e) => {
  if (e.target === modal) closeAuth();
};

let mode = "login";

document.querySelectorAll(".tab").forEach((tab) => {
  tab.onclick = () => {
    document.querySelectorAll(".tab")
      .forEach((x) => x.classList.remove("active"));

    tab.classList.add("active");

    mode = tab.dataset.mode;

    const signup = mode === "signup";

    document.getElementById("authTitle").textContent =
      signup ? "Yeni hesap oluştur 🚀" : "Tekrar hoş geldin 👋";

    document.getElementById("authDesc").textContent =
      signup ? "Ücretsiz hesabını oluştur." : "Hesabına giriş yap.";

    document.getElementById("submitBtn").textContent =
      signup ? "Kayıt Ol" : "Giriş Yap";
  };
});

document.getElementById("authForm").onsubmit = async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("authMessage");

  message.textContent = "İşlem yapılıyor...";

  if (mode === "signup") {
    const { error } = await client.auth.signUp({
      email,
      password
    });

    if (error) {
      message.textContent = "Hata: " + error.message;
      return;
    }

    message.textContent =
      "Kayıt başarılı! E-postanı kontrol et.";
  } else {
    const { error } = await client.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      message.textContent = "Hata: " + error.message;
      return;
    }

    message.textContent = "Giriş başarılı! 🎉";

    setTimeout(() => {
      closeAuth();
      updateUser();
    }, 1000);
  }
};

async function updateUser() {
  const { data } = await client.auth.getUser();

  if (data.user) {
    authBtn.textContent = "🚪 Çıkış Yap";

    authBtn.onclick = async () => {
      await client.auth.signOut();
      location.reload();
    };
  } else {
    authBtn.textContent = "Giriş / Kayıt";
    authBtn.onclick = openModal;
  }
}

updateUser();
