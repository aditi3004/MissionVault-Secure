document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    alert("Unauthorized access. Please login.");
    window.location.href = "/login";
    return;
  }

  document.getElementById("username").textContent = user.username;
  document.getElementById("role").textContent = user.role;

  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "/login";
  });
});
