// ----------------------
// Utility Functions
// ----------------------

function isDesktop() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  return !/android.*mobile|iphone|ipod|windows phone/i.test(ua);
}
const IS_DESKTOP = isDesktop();

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
  const statsImg = document.getElementById("github-stats-img");
  const placeholder = document.getElementById("stats-placeholder");
  const errorMsg = document.getElementById("stats-error");
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
  placeholder.style.display = "block";
  errorMsg.style.display = "none";
  statsImg.style.display = "none";
  const imgUrl = `${baseURL}?${params.toString()}`;
  const preloader = new Image();
  const timeoutDuration = 8000; // Set timeout duration (in ms)
  const timeoutId = setTimeout(() => {
    preloader.src = "";
    errorMsg.style.display = "block";
    placeholder.style.display = "none";
  }, timeoutDuration);

  preloader.onload = () => {
    clearTimeout(timeoutId);
    statsImg.src = imgUrl;
    statsImg.style.display = "block";
    placeholder.style.display = "none";
  };

  preloader.onerror = () => {
    clearTimeout(timeoutId);
    errorMsg.style.display = "block";
    placeholder.style.display = "none";
  };

  preloader.src = imgUrl;
}

function initParticles(isLight) {
  const color = isLight ? "#0077cc" : "#ffffff";
  const size = window.innerWidth / 400 + 2;

  const interactivityStyle = IS_DESKTOP
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
    interactivity: interactivityStyle,
    retina_detect: true,
  });
}

// ----------------------
// Theme & Initial Setup
// ----------------------

const toggleBtn = document.getElementById("theme-toggle");

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  const isLight = savedTheme !== "dark";
  document.body.classList.toggle("light-mode", isLight);
  toggleBtn.textContent = isLight ? "☀️" : "🌙";
  updateGitHubStatsTheme(isLight);
  initParticles(isLight);

  const links = document.querySelectorAll(".sidebar-link");
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      links.forEach((el) => el.classList.remove("active"));
      this.classList.add("active");
      const target = document.getElementById(
        this.getAttribute("href").substring(1)
      );
      if (target) {
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.pageYOffset - 70,
          behavior: "smooth",
        });
      }
    });
  });
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

// ----------------------
// VanillaTilt Initialization
// ----------------------

if (IS_DESKTOP) {
  VanillaTilt.init(document.querySelectorAll(".certification-card"), {
    max: 15,
    speed: 400,
    scale: 1.05,
    glare: true,
    "max-glare": 0.1,
  });

  VanillaTilt.init(document.querySelectorAll(".contact-wrapper"), {
    max: 8,
    speed: 100,
    scale: 1.0,
    glare: true,
    "max-glare": 0.1,
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
      const description =
        !repo.description || repo.description === "null"
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

      if (IS_DESKTOP) {
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
      button.id = "fancy-show-button";
      button.textContent = "↓ Show more projects ↓";
      let expanded = false;

      button.addEventListener("click", () => {
        const hiddenProjects = Array.from(
          document.querySelectorAll(".hidden-project")
        );

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
    container.innerHTML = `<p>Unable to load recent projects. Please try again later.</p>`;
  }
}

loadRecentProjects();

// ----------------------
// AVATAR
// ----------------------

//https://pooya-nasiri-portfolio.readyplayer.me/avatar?id=6841e94dc4abd0700db3afe4

import * as THREE from "https://esm.sh/three@0.161.0";
import { GLTFLoader } from "https://esm.sh/three@0.161.0/examples/jsm/loaders/GLTFLoader.js";

// Constants for expressions
const SMILE_DEFAULT = 0.5;
const MOUTH_DEFAULT = 0.2;
const SMILE_HOVER = 1.0;
const MOUTH_HOVER = 1.0;

// Scene setup
const container = document.getElementById("avatar-container");
if (!container) throw new Error("Avatar container not found");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  35,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 1.5, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.domElement.classList.add("three-avatar");
container.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff, 0x000000, 6));

// Interaction and tracking
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const lookTarget = new THREE.Vector3();
const dummy = new THREE.Object3D();

// Avatar-related
let avatar = null;
let headBone = null;
let smileIndex, openIndex;

// Animate head tracking
function animate() {
  requestAnimationFrame(animate);
  if (!avatar || !headBone) return;

  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.at(2.8, lookTarget);
  headBone.parent.worldToLocal(lookTarget);
  dummy.position.copy(headBone.position);
  dummy.lookAt(lookTarget);
  headBone.quaternion.copy(dummy.quaternion);
  renderer.render(scene, camera);
}

// Blink once
function blinkEyesOnce() {
  avatar?.traverse((child) => {
    if (child.name === "EyeLeft" || child.name === "EyeRight") {
      child.visible = false;
      setTimeout(() => (child.visible = true), 200);
    }
  });
}

// Set smile and mouth expression
function setExpression(smileValue, mouthValue) {
  avatar?.traverse((child) => {
    if (child.isMesh && child.morphTargetInfluences) {
      if (smileIndex !== undefined) {
        child.morphTargetInfluences[smileIndex] = smileValue;
      }
      if (openIndex !== undefined) {
        child.morphTargetInfluences[openIndex] = mouthValue;
      }
    }
  });
}

// Load avatar
new GLTFLoader().load(
  "https://models.readyplayer.me/6841e94dc4abd0700db3afe4.glb",
  (gltf) => {
    avatar = gltf.scene;
    avatar.scale.set(4, 4, 1);
    avatar.position.set(0, -5.2, 0);
    scene.add(avatar);
    if (IS_DESKTOP) {
      // Find morph targets and head bone
      avatar.traverse((child) => {
        if (child.isBone && child.name === "Head") headBone = child;
        if (child.isMesh && child.morphTargetDictionary) {
          smileIndex ??= child.morphTargetDictionary["mouthSmile"];
          openIndex ??= child.morphTargetDictionary["mouthOpen"];
        }
      });

      // Start tracking
      animate();

      // Initial expression
      setExpression(SMILE_DEFAULT, MOUTH_DEFAULT);

      // Hover behavior
      const contact = document.getElementById("contact");
      if (contact) {
        contact.addEventListener("mouseenter", () => {
          setExpression(SMILE_HOVER, MOUTH_HOVER);
          blinkEyesOnce();
        });
        contact.addEventListener("mouseleave", () => {
          setExpression(SMILE_DEFAULT, MOUTH_DEFAULT);
        });
      }
    } else renderer.render(scene, camera);
  }
);

// Event listeners
window.addEventListener("mousemove", (e) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 0.6;
});

window.addEventListener("resize", () => {
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

window.addEventListener("click", blinkEyesOnce);
