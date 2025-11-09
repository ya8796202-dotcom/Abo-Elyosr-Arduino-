window.addEventListener("scroll", () => {
  document.querySelectorAll(".fade-in").forEach(el => {
    if(el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add("visible");
    }
  });
});
