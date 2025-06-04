// ----------------------
// Utility Functions
// ----------------------

function isDesktop() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return !/android.*mobile|iphone|ipod|windows phone/i.test(ua);
  }
  
  function toggleVisibility(button, visible) {
    button.classList.toggle("visible", visible);
  }
  
  function showResumePopup() {
    const popup = document.createElement("div");
    popup.className = "resume-popup";
    popup.textContent = "📥 Downloading Resume...";
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2500);
  }
  
  function updateGitHubStatsTheme(isLight) {
    const baseURL = "https://github-readme-stats.vercel.app/api";
    const username = "PooyaNasiri";
    const theme = isLight ? "default" : "github_dark";
    const params = new URLSearchParams({
      username,
      show_icons: "true",
      hide: "contribs,prs,issues",
      theme,
      t: Date.now(),
    });
    statsImg.src = `${baseURL}?${params.toString()}`;
  }
  
  function initParticles(isLight) {
    const color = isLight ? "#0077cc" : "#ffffff";
    const size = window.innerWidth / 400 + 2;
  
    const interactivity_style = isDesktop()
      ? {
          detect_on: "window",
          events: {
            onhover: { enable: true, mode: "grab" },
            onclick: { enable: true, mode: "push" },
            resize: true,
          },
          modes: {
            grab: { distance: 200 },
            push: { particles_nb: 8 },
          },
        }
      : {
          detect_on: "canvas",
          events: {
            onhover: { enable: false },
            onclick: { enable: false },
            resize: true,
          },
        };
  
    particlesJS("particles-js", {
      particles: {
        number: { value: 20, density: { enable: true, value_area: 500 } },
        color: { value: color },
        shape: { type: "circle" },
        opacity: { value: 0.3, random: true },
        size: { value: size, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: color,
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          out_mode: "out",
        },
      },
      interactivity: interactivity_style,
      retina_detect: true,
    });
  }
  
  // ----------------------
  // Theme & Initial Setup
  // ----------------------
  
  const statsImg = document.getElementById("github-stats-img");
  const toggleBtn = document.getElementById("theme-toggle");
  
  window.addEventListener("load", () => {
    const savedTheme = localStorage.getItem("theme");
    const isLight = savedTheme !== "dark";
    document.body.classList.toggle("light-mode", isLight);
    toggleBtn.textContent = isLight ? "☀️" : "🌙";
    updateGitHubStatsTheme(isLight);
    initParticles(isLight);
  });
  
  window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    const isLight = savedTheme !== "dark";
    document.body.classList.toggle("light-mode", isLight);
    toggleBtn.textContent = isLight ? "☀️" : "🌙";
    updateGitHubStatsTheme(isLight);
    initParticles(isLight);
  });
  
  toggleBtn.addEventListener("click", () => {
    const isLightMode = document.body.classList.toggle("light-mode");
    localStorage.setItem("theme", isLightMode ? "light" : "dark");
    toggleBtn.textContent = isLightMode ? "☀️" : "🌙";
    toggleBtn.classList.add("animate");
    setTimeout(() => toggleBtn.classList.remove("animate"), 400);
    updateGitHubStatsTheme(isLightMode);
    initParticles(isLightMode);
  });
  
  // ----------------------
  // Scroll Buttons
  // ----------------------
  
  const resumeButton = document.getElementById("resume-button");
  const goToTopButton = document.getElementById("go-to-top");
  
  window.addEventListener("scroll", () => {
    const shouldShow = window.scrollY > 300;
    toggleVisibility(resumeButton, shouldShow);
    toggleVisibility(goToTopButton, shouldShow);
  });
  
  goToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    goToTopButton.classList.add("launched");
    setTimeout(() => goToTopButton.classList.remove("launched"), 1000);
  });
  
  // ----------------------
  // Resume Popup
  // ----------------------
  
  ["resume-button", "resume-link"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", showResumePopup);
  });
  
  // ----------------------
  // Sidebar Navigation
  // ----------------------
  
  const links = document.querySelectorAll(".sidebar-link");
  const sections = document.querySelectorAll("section[id]");
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        const link = document.querySelector(`.sidebar-link[href="#${id}"]`);
        if (link) {
          link.classList.toggle("active", entry.isIntersecting);
        }
      });
    },
    { root: null, rootMargin: "0px", threshold: 0.2 }
  );
  
  sections.forEach((section) => observer.observe(section));
  
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      links.forEach((el) => el.classList.remove("active"));
      this.classList.add("active");
  
      const target = document.getElementById(this.getAttribute("href").substring(1));
      const top = target.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
  
  // ----------------------
  // VanillaTilt Initialization
  // ----------------------
  
  if (isDesktop()) {
    VanillaTilt.init(document.querySelectorAll(".certification-card"), {
      max: 15,
      speed: 400,
      scale: 1.05,
      glare: true,
      "max-glare": 0.05,
    });
  
    VanillaTilt.init(document.querySelectorAll(".contact-wrapper"), {
      max: 5,
      speed: 100,
      scale: 1.0,
      glare: true,
      "max-glare": 0.05,
    });
  }
  
  // ----------------------
  // Load GitHub Projects
  // ----------------------
  
  async function loadRecentProjects() {
    const container = document.getElementById("recent-projects");
  
    try {
      const res = await fetch(`data/recent.json?nocache=${Date.now()}`);
      if (!res.ok) throw new Error("Failed to fetch project data.");
  
      const repos = await res.json();
      container.innerHTML = "";
  
      const getColumnCount = () => {
        const grid = window.getComputedStyle(container);
        return grid.getPropertyValue("grid-template-columns").split(" ").length;
      };
  
      const columns = getColumnCount();
      const initialCount = columns * 2;
  
      repos.forEach((repo, index) => {
        const description = !repo.description || repo.description === "null"
          ? "No description provided."
          : repo.description;
  
        const card = document.createElement("a");
        card.href = repo.html_url;
        card.target = "_blank";
        card.rel = "noopener";
        card.className = "project-card project-link";
  
        const languageHTML = repo.language
          ? `<span class="project-language">${repo.language}</span>`
          : "";
  
        const topicsHTML = (repo.topics || [])
          .map((tag) => `<span class="project-tag">${tag}</span>`)
          .join(" ");
  
        card.innerHTML = `
          <h3>${repo.name.replace(/[_-]/g, " ")}</h3>
          <p class="project-description">${description}</p>
          ${languageHTML}
          <div class="project-tags">${topicsHTML}</div>
        `;
  
        if (index >= initialCount) {
          card.style.display = "none";
          card.classList.add("hidden-project");
        }
  
        container.appendChild(card);
  
        if (isDesktop()) {
          VanillaTilt.init(card, {
            max: 15,
            speed: 500,
            scale: 1.05,
            glare: true,
            "max-glare": 0.05,
          });
        }
      });
  
      if (repos.length > initialCount) {
        const button = document.createElement("button");
        button.classList.add("fancy-show-button");
        button.textContent = "↓ Show more projects ↓";
        let expanded = false;
  
        button.addEventListener("click", () => {
          const hiddenProjects = Array.from(document.querySelectorAll(".hidden-project"));
  
          if (!expanded) {
            let i = 0;
            const revealInterval = setInterval(() => {
              const group = hiddenProjects.slice(i, i + 1);
              if (group.length === 0) {
                clearInterval(revealInterval);
                return;
              }
  
              group.forEach((card) => {
                card.style.display = "block";
                card.classList.add("animated-show");
                setTimeout(() => card.classList.remove("animated-show"), 500);
              });
  
              i += 1;
            }, 200);
  
            button.textContent = "↑ Show fewer projects ↑";
            expanded = true;
          } else {
            const buttonTop = button.getBoundingClientRect().top;
            hiddenProjects.forEach((card) => (card.style.display = "none"));
            const newTop = button.getBoundingClientRect().top;
            const scrollOffset = newTop - buttonTop;
  
            window.scrollBy({ top: scrollOffset, behavior: "instant" });
  
            button.textContent = "↓ Show more projects ↓";
            expanded = false;
          }
        });
  
        container.appendChild(button);
      }
    } catch (err) {
      console.error(err);
      container.innerHTML = `<p style="color:red;">Unable to load recent projects. Please try again later.</p>`;
    }
  }
  
  loadRecentProjects();  