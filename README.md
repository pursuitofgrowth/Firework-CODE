This project showcases a dynamic and highly performant generative firework simulation using HTML Canvas and the GSAP animation library. The effect focuses on realistic physics and dramatic visual impact, utilizing an object pooling system for efficiency.

✨ Features
Interactive Launch: Click anywhere on the screen to launch a new firework shell from that location.

Physics Simulation: Particles follow realistic parabolic trajectories (affected by gravity) and slow down over time (friction).

Object Pooling: A fixed pool of particles is reused instead of constantly creating new objects, ensuring smooth performance even with hundreds of active elements.

Glow and Trails: The globalCompositeOperation = 'lighter' setting creates a brilliant, glowing effect, and the background clear rate ensures beautiful, fading trails.

Impact Glow Hold (Latest Feature): Shrapnel particles hold their maximum brightness for a fraction of a second after the burst, enhancing the visual impact of the explosion before they begin to fade and fall.

🛠️ Technologies Used
HTML5 Canvas: For high-performance, frame-by-frame rendering.

JavaScript (ES6): For particle logic, physics updates, and procedural generation.

GSAP (GreenSock Animation Platform): Used for managing particle lifetime, setting fade-out durations, and coordinating the timing of the decay.
