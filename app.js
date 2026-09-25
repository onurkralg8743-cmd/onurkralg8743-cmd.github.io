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
  if (e.target === modal) {
    closeAuth();
  }
};

let mode = "login";

document.querySelectorAll(".tab").forEach((tab) => {
  tab.onclick = () => {
    document
      .querySelectorAll(".tab")
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

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const message = document.getElementById("authMessage");

  message.textContent = "İşlem yapılıyor...";

  if (mode === "signup") {
    const { error } = await client.auth.signUp({
      email: email,
      password: password
    });

    if (error) {
      message.textContent = "Hata: " + error.message;
      return;
    }

    message.textContent =
      "Kayıt başarılı! 📧 E-postanı kontrol edip hesabını doğrula.";
  } else {
    const { error } = await client.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      message.textContent = "Hata: " + error.message;
      return;
    }

    message.textContent = "Giriş başarılı! 🎉";

    setTimeout(() => {
      closeAuth();
      updateUser();
      loadProfile();
    }, 800);
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


/* =========================
   PROFİL SİSTEMİ
========================= */

async function loadProfile() {
  const { data: userData, error: userError } =
    await client.auth.getUser();

  if (userError || !userData.user) {
    return;
  }

  const user = userData.user;

  let profile = null;

  const { data, error } = await client
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Profil hatası:", error);
    return;
  }

  profile = data;

  if (!profile) {
    let username = prompt(
      "👤 Profilin için bir kullanıcı adı seç:"
    );

    if (!username) {
      username = "Onur" + Math.floor(Math.random() * 9999);
    }

    username = username.trim();

    if (username.length < 3) {
      alert("Kullanıcı adı en az 3 karakter olmalı.");
      return;
    }

    const { data: newProfile, error: insertError } =
      await client
        .from("profiles")
        .insert({
          id: user.id,
          username: username
        })
        .select()
        .single();

    if (insertError) {
      console.error(insertError);
      alert(
        "Profil oluşturulamadı.\n\n" +
        "Kullanıcı adı daha önce alınmış olabilir."
      );
      return;
    }

    profile = newProfile;
  }

  showProfile(user, profile);
}


function showProfile(user, profile) {
  let profileBox = document.getElementById("dynamicProfile");

  if (!profileBox) {
    profileBox = document.createElement("section");

    profileBox.id = "dynamicProfile";
    profileBox.className = "section";

    document.querySelector("main").appendChild(profileBox);
  }

  profileBox.innerHTML = `
    <p class="eyebrow">04 — PROFİL</p>

    <h2>Profilim 👤</h2>

    <div class="glass profile-card">
      <div style="
        font-size:55px;
        margin-bottom:10px;
      ">👤</div>

      <h3 style="
        color:var(--text);
        font-size:25px;
        margin-bottom:5px;
      ">
        ${escapeHTML(profile.username)}
      </h3>

      <p style="color:var(--muted); margin-bottom:18px;">
        ${escapeHTML(user.email || "")}
      </p>

      <p style="
        color:#55ff9a;
        margin-bottom:20px;
      ">
        ✓ Giriş yapıldı
      </p>

      <button id="profileLogout" class="btn secondary">
        🚪 Çıkış Yap
      </button>
    </div>
  `;

  document.getElementById("profileLogout").onclick =
    async () => {
      await client.auth.signOut();
      location.reload();
    };
}


function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}


/* =========================
   BAŞLAT
========================= */

updateUser();
loadProfile();

client.auth.onAuthStateChange((event, session) => {
  if (session) {
    updateUser();
    loadProfile();
  }
});
