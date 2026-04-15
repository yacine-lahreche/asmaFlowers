document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.glass-card');
    const flower = document.querySelector('.main-flower');
    
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 80;
            const y = (window.innerHeight / 2 - e.pageY) / 80;
            
            card.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg)`;
            flower.style.transform = `translate(${-x * 3}px, ${-y * 3}px)`;
        });
    }

    // Smooth entrance
    const elements = [
        document.querySelector('.tagline'),
        document.querySelector('h1'),
        document.querySelector('.story-text'),
        document.querySelector('.features-list')
    ];

    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100);
    });
});
