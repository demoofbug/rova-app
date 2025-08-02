document.addEventListener('DOMContentLoaded', () => {
    const storySteps = document.querySelectorAll('.story-step');
    const visualsPanel = document.querySelector('.story-visuals-panel');
    const desktopMockupImg = visualsPanel.querySelector('.desktop-mockup img');
    const phoneMockupScreen = visualsPanel.querySelector('.phone-mockup .screen');
    const tabletMockupImg = visualsPanel.querySelector('.tablet-mockup img');

    // Function to update the active visual
    function updateVisual(activeStep) {
        const visual = activeStep.dataset.visual;
        const img = activeStep.dataset.img;

        // Make all mockups inactive first
        visualsPanel.querySelectorAll('.device-mockup').forEach(m => m.classList.remove('active'));

        // Activate the correct mockup and set its image/content
        if (visual === 'desktop') {
            const mockup = visualsPanel.querySelector('.desktop-mockup');
            mockup.classList.add('active');
            if (img) desktopMockupImg.src = img;
        } else if (visual === 'phone') {
            const mockup = visualsPanel.querySelector('.phone-mockup');
            mockup.classList.add('active');
            if (img) {
                // For the phone, we set the background image and handle scrolling
                phoneMockupScreen.style.backgroundImage = `url(${img})`;
                if (activeStep.dataset.scroll === 'true') {
                    phoneMockupScreen.classList.add('scrolling');
                } else {
                    phoneMockupScreen.classList.remove('scrolling');
                }
            }
        } else if (visual === 'tablet') {
            const mockup = visualsPanel.querySelector('.tablet-mockup');
            mockup.classList.add('active');
            if (img) tabletMockupImg.src = img;
        }
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // When a step intersects, make it active
                storySteps.forEach(step => step.classList.remove('active'));
                entry.target.classList.add('active');
                updateVisual(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -50% 0px', // Trigger when the element is in the middle of the viewport
        threshold: 0.5
    });

    storySteps.forEach(step => {
        observer.observe(step);
    });

    // Set the initial state based on the first step
    if (storySteps.length > 0) {
        updateVisual(storySteps[0]);
        storySteps[0].classList.add('active');
    }
});
