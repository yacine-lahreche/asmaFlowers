document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.glass-card');
    const flower = document.querySelector('.main-flower');
    const modal = document.getElementById('contactModal');
    const modalCard = document.querySelector('.modal-card');
    const openBtn = document.getElementById('contactBtn');
    const closeBtn = document.getElementById('closeModal');
    
    // Subtle Cursor Parallax
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 80;
            const y = (window.innerHeight / 2 - e.pageY) / 80;
            
            if (!modal.classList.contains('active')) {
                card.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg)`;
                flower.style.transform = `translate(${-x * 2}px, ${-y * 2}px)`;
            } else {
                // Parallax for the Modal Card
                modalCard.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg) translateZ(50px)`;
            }
        });
    }

    // Modal Controls
    openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update Social Links from LocalStorage
        const socials = JSON.parse(localStorage.getItem('asmaFlowersSocials')) || {
            instagram: '#', facebook: '#', tiktok: '#', whatsapp: '213696004501'
        };

        const igLink = document.getElementById('link-instagram');
        const fbLink = document.getElementById('link-facebook');
        const ttLink = document.getElementById('link-tiktok');
        const waLink = document.getElementById('link-whatsapp');

        if (igLink) igLink.href = socials.instagram === 'Not set' ? '#' : socials.instagram;
        if (fbLink) fbLink.href = socials.facebook === 'Not set' ? '#' : socials.facebook;
        if (ttLink) ttLink.href = socials.tiktok === 'Not set' ? '#' : socials.tiktok;
        if (waLink) waLink.href = socials.whatsapp === 'Not set' ? '#' : `https://wa.me/${socials.whatsapp}`;

        modal.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    // Smooth entrance animations
    const elements = [
        document.querySelector('.brand-name'),
        document.querySelector('.tagline'),
        document.querySelector('h1'),
        document.querySelector('.description'),
        document.querySelector('.actions'),
        document.querySelector('.season-badge')
    ];

    elements.forEach((el, index) => {
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100);
        }
    });
});
