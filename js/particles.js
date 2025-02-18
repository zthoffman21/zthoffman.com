// Arrays to hold particle data
const starThemes = ["default", "starWars", "blue"];
const snowThemes = ["christmas"];

// Set particles on pages load
document.addEventListener("DOMContentLoaded", setParticles());

// Set particles on theme change
const themeObserver = new MutationObserver(() => {
    setParticles();
});
themeObserver.observe(document.documentElement, {
    attributeFilter: ["data-theme"],
});

function setParticles() {
    var theme = localStorage.getItem("themeName") || "default";

    // Destroy all existing particle instances
    var instances = tsParticles.dom();
    while (instances.length > 0) {
        instances.forEach((instance) => instance.destroy());
        instances = tsParticles.dom(); // Refresh the list after destruction
    }

    if (starThemes.includes(theme)) {
        // Load regular stars
        tsParticles.load({
            particles: {
                number: { value: 235, density: { enable: true, value_area: 800 } },
                color: { value: "#ffffff" },
                shape: { type: "star" },
                opacity: {
                    value: 0.3,
                    random: true,
                    anim: { enable: true, speed: 0.5, opacity_min: 0.1, sync: true },
                },
                size: {
                    value: 1.75,
                    random: true,
                    anim: { enable: false },
                },
                move: {
                    enable: true,
                    speed: 0.2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                },
            },
            interactivity: {
                events: {
                    onhover: {
                        enable: true,
                        mode: "repulse", 
                    },
                },
                modes: {
                    repulse: {
                        distance: 75, 
                        duration: 1,
                        speed: 0.01,
                    },
                },
            },
        });

        // Load shooting stars
        tsParticles.load({
            particles: {
                number: {
                    value: 1,
                    density: {
                        enable: true,
                        value_area: 800,
                    },
                },
                color: { value: "#ffffff" },
                shape: { type: "star" },
                opacity: {
                    value: 0.4,
                    random: true,
                },
                size: {
                    value: 2,
                    random: true,
                },
                move: {
                    enable: true,
                    speed: { min: 1, max: 10 },
                    random: true,
                    straight: true,
                    out_mode: "out",
                },
            },
            interactivity: {
                events: {
                    onhover: {
                        enable: true,
                        mode: "repulse",
                    },
                },
                modes: {
                    repulse: {
                        distance: 75, 
                        duration: 1, 
                        speed: 0.01,
                    },
                },
            },
        });
    } else if (snowThemes.includes(theme)) {
        // Load snow
        tsParticles.load({
            particles: {
                number: {
                    value: 200,
                    density: {
                        enable: true,
                        value_area: 800,
                    },
                },
                color: {
                    value: "#ffffff",
                },
                shape: {
                    type: "circle",
                },
                opacity: {
                    value: 0.4,
                    random: true,
                    anim: {
                        enable: false,
                    },
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                    },
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: "bottom",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    drift: {
                        enable: true,
                        x: 1,
                    },
                },
            },
        });
    }
}
