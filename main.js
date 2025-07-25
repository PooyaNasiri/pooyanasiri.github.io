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
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isLight = savedTheme ? savedTheme !== "dark" : !prefersDark;
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

import * as THREE from "https://esm.sh/three@0.161.0";
import { GLTFLoader } from "https://esm.sh/three@0.161.0/examples/jsm/loaders/GLTFLoader.js";

// Expression Constants
const SMILE_DEFAULT = 0.5;
const MOUTH_DEFAULT = 0.2;
const SMILE_HOVER = 1.0;
const MOUTH_HOVER = 1.0;

// DOM References
const avatarContainer = document.getElementById("avatar-container");
const avatarPlaceholder = document.getElementById("avatar-placeholder");

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  35,
  avatarContainer.clientWidth / avatarContainer.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 1.5, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(avatarContainer.clientWidth, avatarContainer.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.domElement.classList.add("three-avatar");
avatarContainer.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff, 0x000000, 6));

// Interaction
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const lookTarget = new THREE.Vector3();
const dummy = new THREE.Object3D();

// Avatar State
let avatar = null;
let headBone = null;
let handBone = null;
let forearmBone = null;
let shoulderBone = null;
let smileIndex, openIndex;

// Animation Loop
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

// Resize Handler
function resizeAvatar() {
  const width = avatarContainer.clientWidth;
  const height = avatarContainer.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

//handshake Function
function handShake() {
  if (!IS_DESKTOP || !handBone || !forearmBone || !shoulderBone) return;
  let frame = 0;
  const frames = [0, 0.4, -0.4, 0.3, -0.3, 0.2, -0.2, 0];
  handBone.rotation.y = Math.PI / 2;
  forearmBone.rotation.x = -Math.PI / 1.1;
  shoulderBone.rotation.y = -Math.PI / 2.5;
  const interval = setInterval(() => {
    if (frame >= frames.length) {
      clearInterval(interval);
      handBone.rotation.y = 0;
      forearmBone.rotation.x = 0;
      shoulderBone.rotation.y = 0;
      return;
    }
    handBone.rotation.z = frames[frame];
    frame++;
  }, 50);
}

// Expression Functions
function blinkEyesOnce() {
  avatar?.traverse((child) => {
    if (child.name === "EyeLeft" || child.name === "EyeRight") {
      child.visible = false;
      setTimeout(() => (child.visible = true), 200);
    }
  });
}

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

// Load Avatar
new GLTFLoader().load("data/6841e94dc4abd0700db3afe4.glb", (gltf) => {
  avatar = gltf.scene;
  avatar.scale.set(4, 4, 1);
  avatar.position.set(0, -5.2, 0);
  scene.add(avatar);

  if (IS_DESKTOP) {
    // Track head and morph targets
    avatar.traverse((child) => {
      if (child.isBone && child.name === "Head") headBone = child;
      if (child.isBone && child.name === "RightHand") handBone = child;
      if (child.isBone && child.name === "RightForeArm") forearmBone = child;
      if (child.isBone && child.name === "RightShoulder") shoulderBone = child;
      if (child.isMesh && child.morphTargetDictionary) {
        smileIndex ??= child.morphTargetDictionary["mouthSmile"];
        openIndex ??= child.morphTargetDictionary["mouthOpen"];
      }
    });

    animate();
    setExpression(SMILE_DEFAULT, MOUTH_DEFAULT);

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
  } else {
    renderer.render(scene, camera);
  }
});

// Mouse Tracking
window.addEventListener("mousemove", (e) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 0.6;
});

window.addEventListener("click", blinkEyesOnce);
window.addEventListener("resize", resizeAvatar);
avatarPlaceholder.addEventListener("click", handShake);

// ----------------------
// SCROLL + POSITIONING
// ----------------------

window.addEventListener("DOMContentLoaded", resetAvatarPosition);
window.addEventListener("scroll", moveAvatar);
let avatarState = null;
function moveAvatar() {
  const isCorner = window.scrollY > 100 && IS_DESKTOP;
  const nextState = isCorner ? "corner" : "reset";
  if (nextState !== avatarState) {
    avatarContainer.classList.remove("no-transition");
    if (isCorner) moveAvatarToCorner();
    else resetAvatarPosition();
  } else {
    avatarContainer.classList.add("no-transition");
    void avatarContainer.offsetHeight;
    if (isCorner) moveAvatarToCorner();
    else resetAvatarPosition();
  }
  avatarState = nextState;
}

function moveAvatarToCorner() {
  avatarContainer.style.setProperty("--avatar-top", "1rem");
  avatarContainer.style.setProperty("--avatar-left", "1rem");
  avatarContainer.style.setProperty("--avatar-width", "6vw");
  avatarContainer.style.setProperty("--avatar-height", "7.5vw");
}

function resetAvatarPosition() {
  const rect = avatarPlaceholder.getBoundingClientRect();
  avatarContainer.style.setProperty("--avatar-top", `${rect.top}px`);
  avatarContainer.style.setProperty("--avatar-left", `${rect.left}px`);
  avatarContainer.style.setProperty("--avatar-width", "12vw");
  avatarContainer.style.setProperty("--avatar-height", "15vw");
}

// ----------------------
// LIVE RESIZING SUPPORT
// ----------------------

let isResizing = false;
let resizeRAF = null;

function startLiveResize() {
  if (isResizing) return;
  isResizing = true;

  function loop() {
    resizeAvatar();
    moveAvatar();
    resizeRAF = requestAnimationFrame(loop);
  }

  resizeRAF = requestAnimationFrame(loop);
}

function stopLiveResize() {
  isResizing = false;
  if (resizeRAF) cancelAnimationFrame(resizeRAF);
  resizeAvatar();
}

avatarContainer.addEventListener("transitionrun", (e) => {
  if (["width", "height"].includes(e.propertyName)) {
    startLiveResize();
  }
});

avatarContainer.addEventListener("transitionend", (e) => {
  if (["width", "height"].includes(e.propertyName)) {
    stopLiveResize();
  }
});

// ----------------------
// LOGGING
// ----------------------

const counterUrl =
  "https://script.google.com/macros/s/AKfycbwgOdPngWYFAv0Vi3BGDXW-e5LvkeH7lFe64VVie0qFmZpugqxs-1_HoFfR4glSFklGvQ/exec";

async function log(type) {
  let ipData = {};
  try {
    const res = await fetch("https://ipwhois.app/json/");
    if (res.ok) {
      ipData = await res.json();
    }
  } catch (e) {
    // fallback: leave fields undefined
  }

  const parser = new UAParser();
  const result = parser.getResult();
  const isBot = (() => {
    const ua = navigator.userAgent || "";
    const knownBots =
      /bot|crawler|spider|crawling|headless|python|curl|wget|phantomjs|slimerjs/i;
    const isHeadless = navigator.webdriver === true;
    return isHeadless || knownBots.test(ua);
  })();

  const params = new URLSearchParams({
    timestamp: new Date().toISOString(),
    action: type,
    bot: isBot ? "Yes" : "No",
    browser: `${result.browser.name} ${result.browser.version}`,
    os: `${result.os.name} ${result.os.version}`,
    device: result.device.type || "Desktop",
    cpu: result.cpu.architecture,
    screen: `${screen.width}x${screen.height}`,
    language: navigator.language,
    referrer: document.referrer,
    ip: ipData.ip,
    iptype: ipData.type,
    continent: ipData.continent,
    timezone: ipData.timezone,
    timezone_name: ipData.timezone_name,
    country: ipData.country,
    country_code: ipData.country_code,
    country_flag: ipData.country_flag,
    country_phone: ipData.country_phone,
    currency: ipData.currency + ipData.currency_symbol,
    region: ipData.region,
    city: ipData.city,
    loc:
      ipData.latitude && ipData.longitude
        ? `${ipData.latitude},${ipData.longitude}`
        : "",
    isp: ipData.isp,
    org: ipData.org,
    asn: ipData.asn,
    success: ipData.success !== false ? "success" : "fail",
  });

  try {
    await fetch(`${counterUrl}?${params.toString()}`);
  } catch (err) {
    console.error("Error logging", err);
  }
}

document
  .getElementById("resume-link")
  .addEventListener("click", () => log("download"));

document
  .getElementById("resume-button")
  .addEventListener("click", () => log("download"));
log("view");
