const email = document.getElementById("email");
const password = document.getElementById("password");
const result = document.getElementById("result");

const login = async () => {
  if (!email.value || !password.value) {
    result.style.color = "red";
    result.innerText = "All fields are required";
    return;
  }
  try {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      }),
      credentials:"include"
    });
    let data;
    try {
      data = await res.json();
    }
    catch {
      throw new Error("invalid server response");
    }
    result.innerText = data.message;
    if (!res.ok) {
      result.style.color = "red";
      result.innerText = data.message;
      return
    }
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    result.style.color = "green";
    result.innerText = data.message;
    window.location.href = "/dashboard/dashboard.html";

  }
  catch (e) {
    result.innerText = e.message
  }
}

