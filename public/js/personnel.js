document
  .getElementById("personnelForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/personnel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.text();
      document.getElementById("message").textContent = result;
      this.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      document.getElementById("message").textContent = "Error submitting form";
    }
  });
