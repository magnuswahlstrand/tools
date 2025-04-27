const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get git info for a project
function getGitInfo(projectPath) {
    try {
        const commitCount = execSync(`git rev-list --count HEAD -- ${projectPath}`, { encoding: 'utf8' }).trim();
        const lastUpdate = execSync(`git log -1 --format=%cd --date=format:'%B %d, %Y' -- ${projectPath}`, { encoding: 'utf8' }).trim();
        return { commitCount, lastUpdate };
    } catch (e) {
        return { commitCount: '0', lastUpdate: 'N/A' };
    }
}

// Get all directories in the public folder
const publicDir = path.join(__dirname, '..', 'gh-pages-public');
const projects = fs.readdirSync(publicDir)
    .filter(f => fs.statSync(path.join(publicDir, f)).isDirectory());

// Get git info for each project
const projectsInfo = projects.map(project => {
    const gitInfo = getGitInfo(`projects/${project}`);
    return {
        name: project,
        ...gitInfo
    };
});

// Generate HTML content
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tools Projects</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            line-height: 1.6;
        }
        h1 { color: #2d3748; }
        .projects {
            display: grid;
            gap: 1rem;
            margin-top: 2rem;
        }
        .project-link {
            display: block;
            padding: 1.5rem;
            background: #f7fafc;
            border-radius: 0.5rem;
            color: #4a5568;
            text-decoration: none;
            border: 1px solid #e2e8f0;
            transition: all 0.2s;
        }
        .project-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .project-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        .project-meta {
            font-size: 0.875rem;
            color: #718096;
        }
    </style>
</head>
<body>
    <h1>Tools Projects</h1>
    <div class="projects">
        ${projectsInfo.map(project => `
        <a href="./${project.name}" class="project-link">
            <div class="project-title">${project.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
            <div class="project-meta">
                Version: ${project.commitCount} commits<br>
                Last update: ${project.lastUpdate}
            </div>
        </a>
        `).join('')}
    </div>
</body>
</html>`;

// Write the file to public/index.html
fs.writeFileSync(path.join(publicDir, 'index.html'), html);
console.log('Generated index.html with links to:', projects.join(', ')); 