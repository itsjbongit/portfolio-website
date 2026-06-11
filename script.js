/* ============================================================
   JEROME BIJU — FINAL PORTFOLIO
   script.js
   ============================================================ */

   document.addEventListener('DOMContentLoaded', () => {
    // ─── 1. GLOBAL VARIABLES & SETUP ───────────────────────────
    gsap.registerPlugin(ScrollTrigger);
    
    const isMobile = window.innerWidth < 768;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // ─── 2. LENIS SMOOTH SCROLLING ──────────────────────────────
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0, 0);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId && targetId !== '#') {
                lenis.scrollTo(targetId, { offset: -50 });
            }
        });
    });

    // ─── 3. BACKGROUND CANVAS (Subtle fluid particles) ──────────
    const bgCanvas = document.getElementById('bgCanvas');
    const bgCtx = bgCanvas.getContext('2d');
    let bgParticles = [];

    const resizeBgCanvas = () => {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
    };

    const initBgParticles = () => {
        bgParticles = [];
        const count = isMobile ? 30 : 80;
        for (let i = 0; i < count; i++) {
            bgParticles.push({
                x: Math.random() * bgCanvas.width,
                y: Math.random() * bgCanvas.height,
                radius: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.5 + 0.1,
                speed: Math.random() * 0.15 + 0.05
            });
        }
    };

    const animateBg = () => {
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        
        bgParticles.forEach(p => {
            p.y -= p.speed;
            if (p.y < 0) {
                p.y = bgCanvas.height;
                p.x = Math.random() * bgCanvas.width;
            }
            bgCtx.beginPath();
            bgCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            bgCtx.fillStyle = `rgba(167, 139, 250, ${p.alpha * 0.4})`;
            bgCtx.fill();
        });
        
        requestAnimationFrame(animateBg);
    };

    window.addEventListener('resize', () => { resizeBgCanvas(); initBgParticles(); });
    resizeBgCanvas();
    initBgParticles();
    if (!isReducedMotion) animateBg();

    // ─── 4. LOADER & HERO INITIALIZATION ────────────────────────
    const initMain = () => {
        document.getElementById('main').classList.remove('main-hidden');
        document.getElementById('main').classList.add('main-visible');
        
        gsap.to('[data-reveal]', {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 1.2,
            ease: 'power3.out'
        });
        
        const scrollHint = document.querySelector('.scroll-hint');
        if(scrollHint) scrollHint.classList.add('visible');
    };

    const runLoader = () => {
        const tl = gsap.timeline({ onComplete: initMain });
        
        tl.to('#loaderLine1', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' })
          .to('#loaderLine1', { opacity: 0, y: -10, duration: 1, delay: 1 })
          .to('#loaderLine2', { opacity: 1, y: 0, duration: 1 })
          .to('#loaderBar', { width: '100%', duration: 1.5, ease: 'power2.inOut' }, '-=0.5')
          .to('#loader', { opacity: 0, duration: 1, ease: 'power2.inOut', delay: 0.2 })
          .set('#loader', { display: 'none' });
    };

    window.addEventListener('load', runLoader);

    // ─── 5. GSAP PARALLAX SCROLL FOR CARDS ──────────────────────
    if (!isReducedMotion) {

        document.querySelectorAll('.parallax-card').forEach(card => {
    
            const distance = isMobile ? 20 : 60;
    
            gsap.fromTo(
                card,
                {
                    y: distance
                },
                {
                    y: -distance,
                    ease: "none",
                    scrollTrigger: {
                        trigger: card.parentElement,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1
                    }
                }
            );
        });
    }

    // ─── 6. CHAPTER ANIMATIONS ──────────────────────────────────
    document.querySelectorAll('[data-split]').forEach(el => {
        const text = el.innerText;
        el.innerHTML = text.split('').map(char => 
            `<span class="split-char" style="display:inline-block; opacity:0; transform:translateY(30px);">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');
        
        ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            onEnter: () => {
                gsap.to(el.querySelectorAll('.split-char'), {
                    opacity: 1, y: 0, duration: 0.8, stagger: 0.03, ease: 'power3.out'
                });
            }
        });
    });

    document.querySelectorAll('.achievement-card').forEach(card => {
        ScrollTrigger.create({
            trigger: card,
            start: "top 85%",
            onEnter: () => {
                if (card.classList.contains('revealed')) return;
                card.classList.add('revealed');
                
                const scoreEl = card.querySelector('.score-number');
                const targetScore = parseInt(card.dataset.score);
                
                gsap.to(scoreEl, {
                    innerHTML: targetScore,
                    duration: 2.5,
                    snap: { innerHTML: 1 },
                    ease: 'power3.out',
                    onUpdate: function() {
                        scoreEl.innerHTML = Math.round(this.targets()[0].innerHTML);
                    }
                });
            }
        });
    });

    ScrollTrigger.create({
        trigger: ".interest-stack",
        start: "top 85%",
        onEnter: () => {
            document.querySelectorAll('.interest-card').forEach(el => el.classList.add('revealed'));
        }
    });

    // ... (Your existing code: Lenis, Loader, Particles, etc. from source 11) ...

// ─── SOLID GLASS ORB LOGIC ─────────────────────────────
// ─── SONOMA LIQUID GLASS ORB LOGIC ─────────────────────────────
// ─── FINAL OPTIMIZED SATURN SYSTEM LOGIC ─────────────────────────────
const orbCanvas = document.getElementById('bgCanvasOrb');
if (orbCanvas) {
    const container = orbCanvas.parentElement;
    const renderer = new THREE.WebGLRenderer({ canvas: orbCanvas, alpha: true, antialias: true });
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    
    // 1. Texture Generation
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 1024);
    gradient.addColorStop(0, '#D4B483');
    gradient.addColorStop(0.3, '#E4C99F');
    gradient.addColorStop(0.5, '#C1A176');
    gradient.addColorStop(0.7, '#D4B483');
    gradient.addColorStop(1, '#B09060');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 60; i++) {
        ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, i * 17, 1024, 10);
    }
    const texture = new THREE.CanvasTexture(canvas);

    // 2. Grouping System
    const saturnGroup = new THREE.Group();

    // 3. Planet Setup
    const planetGeom = new THREE.SphereGeometry(3, 128, 128);
    const planetMat = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.8 });
    const saturn = new THREE.Mesh(planetGeom, planetMat);
    saturn.rotation.z = 30 * (Math.PI / 180); // 30-degree axial tilt

    // 4. Rings Setup
    const ringGeom = new THREE.RingGeometry(3.2, 6, 128);
    const ringMat = new THREE.MeshStandardMaterial({ 
        color: 0xC2B280, side: THREE.DoubleSide, transparent: true, opacity: 0.8 
    });
    const rings = new THREE.Mesh(ringGeom, ringMat);
    rings.rotation.x = Math.PI / 2;
    rings.rotation.y = 30 * (Math.PI / 180); // Align with tilt

    // 5. Scene Assembly
    saturnGroup.add(saturn);
    saturnGroup.add(rings);
    scene.add(saturnGroup);

    // 6. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xFFF9D6, 1.2);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // 7. Responsive Logic
    const handleResize = () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.position.z = window.innerWidth < 768 ? 14 : 10;
        camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // 8. Transformations (Scale 25%, 20-degree X-tilt)
    
    saturnGroup.rotation.x = 20 * (Math.PI / 180);

    // 9. Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        saturn.rotation.y += 0.002;
        rings.rotation.z -= 0.05; // Fast ring speed
        
        const float = Math.sin(Date.now() * 0.0005) * 0.1;
        saturnGroup.position.y = float;
        
        renderer.render(scene, camera);
    }
    animate();
}
const friendsTrigger = document.getElementById('friendsTrigger');
const friendsBody = document.getElementById('friendsBody');

if (friendsTrigger && friendsBody) {

    gsap.set(friendsBody, {
        height: 0,
        opacity: 0,
        overflow: "hidden"
    });

    let isOpen = false;

    const toggleFriends = (e) => {
        // REMOVED: e.preventDefault() and e.stopPropagation()
        // They interfere with native touch-to-click conversion on mobile divs.

        isOpen = !isOpen;

        if (isOpen) {
            friendsTrigger.classList.add('expanded');
            friendsBody.classList.add('is-open');

            gsap.to(friendsBody, {
                height: "auto",
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                overwrite: true, // Prevents animation conflicts if tapped repeatedly
                onComplete: () => {
                    ScrollTrigger.refresh();
                }
            });

            const label = friendsTrigger.querySelector('.interlude-expand-text');
            if (label) {
                label.textContent = "Close memory archive";
            }

            gsap.fromTo(
                ".memory-card",
                {
                    y: 30,
                    opacity: 0,
                    scale: 0.96
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    stagger: 0.1,
                    duration: 0.6,
                    ease: "power2.out",
                    overwrite: true
                }
            );

        } else {
            friendsTrigger.classList.remove('expanded');
            friendsBody.classList.remove('is-open'); // ADDED: This was missing in your original code

            gsap.to(friendsBody, {
                height: 0,
                opacity: 0,
                duration: 0.6,
                ease: "power3.inOut",
                overwrite: true
            });

            const label = friendsTrigger.querySelector('.interlude-expand-text');
            if (label) {
                label.textContent = "Tap to unfold memories";
            }
        }
    };

    friendsTrigger.addEventListener('click', toggleFriends);
}
const familyTrigger = document.getElementById('familyTrigger');
const familyBody = document.getElementById('familyBody');

if (familyTrigger && familyBody) {
    gsap.set(familyBody, { height: 0, opacity: 0, overflow: "hidden" });
    let isFamilyOpen = false;

    const toggleFamily = () => {
        isFamilyOpen = !isFamilyOpen;
        if (isFamilyOpen) {
            familyTrigger.classList.add('expanded');
            familyBody.classList.add('is-open');
            gsap.to(familyBody, {
                height: "auto", opacity: 1, duration: 0.8, ease: "power3.out", overwrite: true,
                onComplete: () => { ScrollTrigger.refresh(); }
            });
            const label = familyTrigger.querySelector('.interlude-expand-text');
            if (label) label.textContent = "Close family archive";

            // SCOPED SELECTOR: Animates only family cards
            gsap.fromTo("#familyBody .memory-card", 
                { y: 30, opacity: 0, scale: 0.96 },
                { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.6, ease: "power2.out", overwrite: true }
            );
        } else {
            familyTrigger.classList.remove('expanded');
            familyBody.classList.remove('is-open');
            gsap.to(familyBody, { height: 0, opacity: 0, duration: 0.6, ease: "power3.inOut", overwrite: true });
            const label = familyTrigger.querySelector('.interlude-expand-text');
            if (label) label.textContent = "Tap to unfold family archive";
        }
    };
    familyTrigger.addEventListener('click', toggleFamily);
}

// ─── TEACHERS INTERLUDE LOGIC ─────────────────────────────
const teachersTrigger = document.getElementById('teachersTrigger');
const teachersBody = document.getElementById('teachersBody');

if (teachersTrigger && teachersBody) {
    gsap.set(teachersBody, { height: 0, opacity: 0, overflow: "hidden" });
    let isTeachersOpen = false;

    const toggleTeachers = () => {
        isTeachersOpen = !isTeachersOpen;
        if (isTeachersOpen) {
            teachersTrigger.classList.add('expanded');
            teachersBody.classList.add('is-open');
            gsap.to(teachersBody, {
                height: "auto", opacity: 1, duration: 0.8, ease: "power3.out", overwrite: true,
                onComplete: () => { ScrollTrigger.refresh(); }
            });
            const label = teachersTrigger.querySelector('.interlude-expand-text');
            if (label) label.textContent = "Close mentors archive";

            gsap.fromTo("#teachersBody .memory-card", 
                { y: 30, opacity: 0, scale: 0.96 },
                { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.6, ease: "power2.out", overwrite: true }
            );
        } else {
            teachersTrigger.classList.remove('expanded');
            teachersBody.classList.remove('is-open');
            gsap.to(teachersBody, { height: 0, opacity: 0, duration: 0.6, ease: "power3.inOut", overwrite: true });
            const label = teachersTrigger.querySelector('.interlude-expand-text');
            if (label) label.textContent = "Tap to unfold the mentors who shaped the journey.";
        }
    };
    teachersTrigger.addEventListener('click', toggleTeachers);
}

// ─── SCHOOL LEADER ACHIEVEMENT LOGIC ─────────────────────────────
const leaderTrigger = document.getElementById('leaderTrigger');
const leaderBody = document.getElementById('leaderBody');

if (leaderTrigger && leaderBody) {
    gsap.set(leaderBody, { height: 0, opacity: 0, overflow: "hidden" });
    let isLeaderOpen = false;

    const toggleLeader = () => {
        isLeaderOpen = !isLeaderOpen;
        if (isLeaderOpen) {
            leaderTrigger.classList.add('expanded');
            leaderBody.classList.add('is-open');
            gsap.to(leaderBody, {
                height: "auto", opacity: 1, duration: 0.8, ease: "power3.out", overwrite: true,
                onComplete: () => { ScrollTrigger.refresh(); }
            });
            const label = leaderTrigger.querySelector('.interlude-expand-text');
            if (label) label.textContent = "Close milestone archive";

            gsap.fromTo("#leaderBody .memory-card", 
                { y: 30, opacity: 0, scale: 0.96 },
                { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.6, ease: "power2.out", overwrite: true }
            );
        } else {
            leaderTrigger.classList.remove('expanded');
            leaderBody.classList.remove('is-open');
            gsap.to(leaderBody, { height: 0, opacity: 0, duration: 0.6, ease: "power3.inOut", overwrite: true });
            const label = leaderTrigger.querySelector('.interlude-expand-text');
            if (label) label.textContent = "Tap to unfold: School Leader 2024-25.";
        }
    };
    leaderTrigger.addEventListener('click', toggleLeader);
}

    // ─── 8. PROJECTS 3D TILT EFFECT ─────────────────────────────
    const projectCards = document.querySelectorAll('.project-card');
    
    ScrollTrigger.create({
        trigger: ".projects-grid",
        start: "top 80%",
        onEnter: () => {
            gsap.to('.project-card', { 
                opacity: 1, y: 0, stagger: 0.15, duration: 1, ease: 'power3.out',
                onStart: () => {
                    document.querySelectorAll('.project-card')
                        .forEach(card => card.classList.add('revealed'));
                }
            });
        }
    });

    if (!isMobile && !isReducedMotion) {
        projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const xPct = x / rect.width - 0.5;
                const yPct = y / rect.height - 0.5;
                
                gsap.to(card, {
                    rotationY: xPct * 8,
                    rotationX: -yPct * 8,
                    transformPerspective: 1000,
                    ease: "power1.out",
                    duration: 0.4
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotationY: 0,
                    rotationX: 0,
                    ease: "power3.out",
                    duration: 0.8
                });
            });
        });
    }
});