#  Pooya Nasiri -  AI & Machine Learning Engineer Portfolio

![Portfolio Preview](icon/banner_image.png)
Welcome to my personal portfolio website! This project is a highly interactive, single-page application designed to showcase my experiences. 

It features a custom-built 3D avatar, physics-based particle effects, and a unique UI interaction system, all built with vanilla JavaScript and WebGL.

## 🚀 Live Demo
**[View Portfolio Live at PooyaNasiri.GitHub.io](https://pooyanasiri.github.io/)**

## ✨ Key Features


* **🤖 Interactive 3D Avatar**: A fully rigged 3D character powered by **Three.js** that tracks mouse movements and reacts to user interactions (try clicking the avatar!).
* **🌌 Particle Physics**: A reactive background system using **Particles.js** that responds to cursor proximity.
* **📱 Responsive & Adaptive**: Fully optimized for desktops (with hover effects) and mobile devices (touch-optimized layouts).
* **🌓 Dark/Light Mode**: System-aware theme toggling with persistent local storage preferences.
* **📊 Self-Hosted GitHub Stats**: Integrates a custom Vercel-hosted instance of `github-readme-stats` to bypass public API rate limits and ensure high availability.
* **🧱 3D Tilt Effects**: Project cards utilize **Vanilla-tilt.js** for a premium holographic depth effect.
* **🎨 Dynamic "Gooey" UI**: A custom SVG-filtered "Resume" button with fluid liquid animations and Houdini-based color shifting.

## 🛠️ Built With

* ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
* ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
* ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
* **Three.js** (WebGL 3D Rendering)
* **Particles.js** (Canvas Physics)
* **Vanilla-tilt.js** (3D Interaction)
* **Google Apps Script** (Analytics & Logging)

## ⚙️ Setup & Installation

If you want to run this locally or fork it for your own use:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/PooyaNasiri/pooyanasiri.github.io.git
    cd pooyanasiri.github.io
    ```

2.  **Open the project**
    Since this is a static site, you can simply open `index.html` in your browser. However, for the 3D Avatar (`.glb` models) to load correctly, you must run it on a local server (to avoid CORS issues).

    **Using Python:**
    ```bash
    # Python 3.x
    python -m http.server 8000
    ```
    Then visit `http://localhost:8000`.

    **Using VS Code:**
    Install the "Live Server" extension and click "Go Live" at the bottom right.


## 📬 Contact

* **Email**: [Pooya.nasiri75@gmail.com](mailto:Pooya.nasiri75@gmail.com)
* **LinkedIn**: [linkedin.com/in/PooyaNasiri](https://linkedin.com/in/PooyaNasiri)

---