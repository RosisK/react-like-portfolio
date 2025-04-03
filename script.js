document.addEventListener("DOMContentLoaded", function () {
    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");

            // Special case for home link
            if (targetId === '#home') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                history.pushState(null, null, ' ');
                return;
            }

            if (targetId === "#") return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition =
                    targetElement.getBoundingClientRect().top;
                const offsetPosition =
                    elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                });

                // Update URL without page jump
                history.pushState(null, null, targetId);
            }
        });
    });

    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    
    function updateActiveNav() {
        let current = '';
        const scrollPosition = window.pageYOffset;
        
        // Special case for top of page
        if (scrollPosition < 100) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#home') {
                    link.classList.add('active');
                }
            });
            return;
        }
        
        // Check other sections
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop - 200 && 
                scrollPosition < sectionTop + sectionHeight - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    }


    window.addEventListener("scroll", updateActiveNav);
    updateActiveNav(); // Run once on load

    // Mobile menu toggle
    const mobileMenuToggle = document.createElement("button");
    mobileMenuToggle.className = "mobile-menu-toggle";
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(mobileMenuToggle);

    mobileMenuToggle.addEventListener("click", function () {
        document.querySelector(".sidebar").classList.toggle("active");
    });

    // Theme switching logic
    const themeButtons = document.querySelectorAll(".theme-btn");
    const html = document.documentElement;

    function setTheme(theme) {
        html.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);

        // Update active button
        themeButtons.forEach((btn) => {
            btn.classList.remove("active");
            if (btn.classList.contains(theme)) {
                btn.classList.add("active");
            }
        });

        // Force redraw for transition
        document.body.style.display = "none";
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = "";
    }

    // Check for saved theme or prefer-color-scheme
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme(prefersDark ? "dark" : "light");
    }

    // Theme button click handlers
    themeButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            const theme = this.classList.contains("light") ? "light" : "dark";
            setTheme(theme);
        });
    });
});
