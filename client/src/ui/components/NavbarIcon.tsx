import "./Style/NavbarIcon.css";
import "./Style/navbar.css";

const NavbarIcon = () => {
  const navbar = document.getElementById("navbar");
  const width = window.innerWidth;

  if (width < 768) {
    if (navbar) {
      navbar.style.display = "none";
    }
  }

  function openNavbar() {
    if (navbar) {
      navbar.style.display = "flex";
    }
  }

  function checkWidth() {
    const new_width = window.innerWidth;
    if (new_width > 768) {
      if (navbar) {
        navbar.style.display = "flex";
      }
    } else {
      if (navbar) {
        navbar.style.display = "none";
      }
    }
  }
  window.addEventListener("resize", checkWidth);

  return (
    <>
      <i
        className="material-symbols-outlined menu-icon"
        onClick={() => openNavbar()}
      >
        menu
      </i>
    </>
  );
};

export default NavbarIcon;
