/**
 * Use an IntersectionObserver to find the closest title being scrolled by the user
 */
function studyProgressObserver() {
    const activeLinkClass = 'case-study__link--active';
    const navLinks = document.querySelectorAll('.case-study__link');
    const sections = [];

    navLinks.forEach(link => {
        const sectionId = getSectionIdFromLink(link);
        const section = document.getElementById(sectionId);
        sections.push(section);
    });

    const observerOptions = {
        root: null,
        rootMargin: `0px 0px -66% 0px`,
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        let currentActiveSectionId = null;
        const intersectingEntries = entries.filter(entry => entry.isIntersecting);

        if (intersectingEntries.length > 0) {
            intersectingEntries.sort((a, b) => a.target.offsetTop - b.target.offsetTop);
            currentActiveSectionId = intersectingEntries[0].target.id;
        }

        navLinks.forEach(link => {
            link.classList.remove(activeLinkClass);
            const sectionIdForLink = getSectionIdFromLink(link);
            if (sectionIdForLink === currentActiveSectionId) {
                link.classList.add(activeLinkClass);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    function getSectionIdFromLink(link) {
        return link.getAttribute('href').substring(1);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', studyProgressObserver);
} else {
    studyProgressObserver();
}