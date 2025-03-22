export function ProjectPage({ title, subtitle, sections }) {
    return `
        <div class="project-content">
            <h1 class="project-title">${title}</h1>
            <p class="project-subtitle">${subtitle}</p>
            ${sections.map(section => `
                <div class="project-section">
                    ${section.title ? `<h2 class="section-title">${section.title}</h2>` : ''}
                    <div class="section-content">
                        ${section.content}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}
