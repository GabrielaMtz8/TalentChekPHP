function toggleMenu() {
    const menu = document.getElementById("dropdownMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  }

  // Cierra el menú al hacer clic fuera
  document.addEventListener("click", function (event) {
    const menu = document.getElementById("dropdownMenu");
    const icon = document.querySelector(".user-icon");
    if (!menu.contains(event.target) && !icon.contains(event.target)) {
      menu.style.display = "none";
    }
  });