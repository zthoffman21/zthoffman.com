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
    var theme = localStorage.getItem("themeName");

    // Destroy all existing particle instances
    var instances = tsParticles.dom();
    while (instances.length > 0) {
        instances.forEach((instance) => instance.destroy());
        instances = tsParticles.dom(); // Refresh the list after destruction
    }

    if (theme != "christmas") {
        // Load regular stars
        tsParticles.load({
            particles: {
                number: { value: 200, density: { enable: true, value_area: 800 } },
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
        });

        // Load shooting stars
        tsParticles.load({
            particles: {
                number: { value: 0.5, density: { enable: true, value_area: 800 } },
                color: { value: "#ffffff" },
                shape: { type: "star" },
                opacity: {
                    value: 0.5,
                    random: true,
                },
                size: {
                    value: 2,
                    random: true,
                },
                move: {
                    enable: true,
                    speed: 15,
                    random: true,
                    straight: true,
                    out_mode: "out",
                    bounce: false,
                },
            },
        });
    } else {
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