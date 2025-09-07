class Tab {
    constructor(tabId, contentHTML) {
      this.el = document.getElementById(tabId);
      this.content = contentHTML;
    }
  }
  
  // Create your Tab objects
  const tabs = [
    new Tab("robotTab",  `
<ul class="treeView">
	<li>
		Chess Robot
		<ul>
		<li><strong>Description:</strong> An autonomous chess-playing robot that combines computer vision and robotic control to play physical chess games.</li>
		<li><strong>Hardware:</strong>
			<ul>
			<li>20″ articulated arm (Fusion 360 &amp; 3D-printed)</li>
			<li>Raspberry Pi 4B + AI Camera</li>
			<li>PCA9685 PWM driver</li>
			<li>High-torque 270° metal-gear servos (40 kg·cm - 60 kg·cm)</li>
			</ul>
		</li>
		<li><strong>Software:</strong>
			<ul>
			<li>OpenCV pipeline for robust board detection</li>
			<li>PyTorch CNN for square-by-square piece classification</li>
			<li>Inverse kinematics for precise arm control</li>
			<li>Stockfish API integration for move generation</li>
			</ul>
		</li>
		<li><strong>Progress &amp; Roadmap:</strong>
			<ul>
			<li>✅ Multi-stage board detection &amp; 8x8 segmentation</li>
			<li>✅ CNN trained &amp; integrated</li>
			<li>✅ Stockfish communication</li>
			<li>🔄 Inverse kinematics full integration (in progress)</li>
			<li>🔄 Piece classification refinements (up next)</li>
			</ul>
		</li>
		<li><a href="https://github.com/zthoffman21/chessRobot" target="_blank">View on GitHub</a></li>
		</ul>
	</li>
</ul>
`),
    new Tab("racingTab", `
<ul class="treeView">
  <li>
    Racing Line Simulation
    <ul>
      <li><strong>Description:</strong> Draw custom race tracks and let AI optimize the best racing line using realistic car physics and evolutionary algorithms.</li>
      <li><strong>Core Technologies:</strong>
        <ul>
          <li>Python 3.7+</li>
          <li>Pygame 2.0+</li>
          <li>NEAT-Python 2.12.0</li>
          <li>Tkinter (Std. Library)</li>
        </ul>
      </li>
      <li><strong>Modes:</strong>
        <ul>
          <li><em>Best Time Mode:</em> Watch AI cars evolve to minimize lap times on your track.</li>
          <li><em>Head-to-Head Mode:</em> Two AI teams train &amp; compete side-by-side with adjustable parameters.</li>
        </ul>
      </li>
      <li><strong>Features:</strong>
        <ul>
          <li><em>Advanced Car Physics:</em>  
            Velocity &amp; steering based on traction, downforce &amp; mass; throttle-position controls; mask-based collision detection.</li>
          <li><em>NEAT ML Integration:</em>  
            Evolutionary algorithm with 10 inputs (velocity, steering, distances) &amp; 2 outputs (throttle, steering); fitness = lap time + crash avoidance.</li>
          <li><em>Custom Track Creation:</em>  
            Intuitive drawing tool (brush sizes 1-5, “w”/“b” pen, “c” to clear) for designing unique circuits.</li>
        </ul>
      </li>
      <li><strong>Quickstart:</strong>
        <ul>
          <li><code>git clone https://github.com/zthoffman21/racing-line-simulation.git</code></li>
          <li><code>pip install -r requirements.txt</code></li>
          <li><code>python main.py</code> → draw your track → select mode → optimize</li>
        </ul>
      </li>
      <li><a href="https://github.com/zthoffman21/Machine_Learning_Racing_Simulation" target="_blank">View on GitHub</a></li>
    </ul>
  </li>
</ul>
`),
    new Tab("websiteTab",`
<ul class="treeView">
  <li>
    Personal Website
    <ul>
      <li><strong>Description:</strong> A retro-styled interactive portfolio that mimics a vintage OS, showcasing projects, resume, contact info, and mini-apps in draggable windows.</li>
      <li><strong>Technologies:</strong>
        <ul>
          <li>HTML5 &amp; CSS3</li>
          <li>JavaScript</li>
          <li>Cloudflare Pages hosting</li>
        </ul>
      </li>
      <li><strong>Features:</strong>
        <ul>
          <li>Draggable, focus-managed windows (<code>draggableWindow.js</code>)</li>
          <li>CRT scanline effect using Canvas (<code>crtEffect.js</code>)</li>
          <li>Animated particle background (<code>particles.js</code>)</li>
          <li>Built-in Minesweeper game (<code>mineSweeper.js</code>)</li>
          <li>Music jukebox with play/pause/skip controls (<code>music.js</code>)</li>
          <li>Dynamic theme switcher (light/dark/retro) (<code>theme.js</code>)</li>
          <li>PDF resume embed with smooth zoom handling</li>
        </ul>
      </li>
      <li><a href="https://github.com/zthoffman21/zthoffman.com" target="_blank">View on GitHub</a></li>
    </ul>
  </li>
</ul>
`),
    new Tab("gameTab",   `
<ul class="treeView">
  <li>
    Pawn's Revenge
    <ul>
      <li><strong>Description:</strong> A wave-style shooter where you control a pawn fending off spawning chess-piece enemies by picking up and throwing board labels (letters &amp; numbers).</li>
      <li><strong>Technologies:</strong>
        <ul>
          <li>Python 3.x &amp; Pygame</li>
        </ul>
      </li>
      <li><strong>Modules &amp; Assets:</strong>
        <ul>
          <li>GameLoop: manages waves, spawning &amp;</li>
          <li>MainMenu: title screen &amp; navigation</li>
          <li>ControlsMenu: keybinding instructions</li>
          <li>Sprites &amp; Textures: visual assets</li>
          <li>UsefulFunctions: utility helpers (input, scoring, collision)</li>
        </ul>
      </li>
      <li><strong>Gameplay:</strong> Progress through increasing waves of enemies, collect letter/number pickups as projectiles, and survive as long as possible.</li>
      <li><a href="https://github.com/zthoffman21/Pawns-Revenge-Python" target="_blank">View on GitHub</a></li>
    </ul>
  </li>
</ul>
`)
  ];
  
  const content = document.getElementById("projectsContent");
  
  let currentTabEl = document.querySelector(".tab.activeTab") || tabs[0].el;
  
  (function init() {
    const activeTabObj = tabs.find(t => t.el === currentTabEl);
    if (activeTabObj) content.innerHTML = activeTabObj.content;
  })();
  

  tabs.forEach(t => {
    t.el.addEventListener("click", () => {
      currentTabEl.classList.remove("activeTab");
  
      t.el.classList.add("activeTab");
      currentTabEl = t.el;
  
      content.innerHTML = t.content;
    });
  });
  
