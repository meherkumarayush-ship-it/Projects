async function login() {
  try {
    const response = await fetch("http://127.0.0.1:5000/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",   // 🔥 VERY IMPORTANT
      body: JSON.stringify({
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
      })
    });

    if (response.ok) {
      window.location.href = "admin.html";
    } else {
      document.getElementById("error").innerText = "❌ Invalid credentials";
    }
  } catch (err) {
    document.getElementById("error").innerText = "⚠️ Server not running";
    console.error(err);
  }
}
