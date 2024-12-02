// Set particles on pages load
document.addEventListener("DOMContentLoaded", setParticles());

// Set particles on theme change
const themeObserver = new MutationObserver(() => {
    setParticles();
});
themeObserver.observe(document.documentElement, { 
    attributeFilter: ['data-theme'] 
});

function setParticles() {
    var theme = localStorage.getItem("themeName");
    tsParticles.domItem(0)?.destroy(); // Removes current particles

    if (theme != "christmas") {
        tsParticles.load({
            particles: {
                number: { value: 100, density: { enable: true, value_area: 800 } },
                color: { value: "#ffffff" },
                shape: { type: "star" },
                opacity: {
                    value: 0.4,
                    random: true,
                    anim: { enable: true, speed: 0.5, opacity_min: 0.1, sync: true }
                },
                size: {
                    value: 1.75,
                    random: true,
                    anim: { enable: false }
                },
                move: {
                    enable: true,
                    speed: 0.5,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
        });
    } else {
        tsParticles.load({
            particles: {
                number: {
                    value: 100,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#ffffff"
                },
                shape: {
                    type: "circle"
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false
                    }
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
                    }
                }
            },
        });
    }
}