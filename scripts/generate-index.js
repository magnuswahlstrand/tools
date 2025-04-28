const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const yaml = require('yaml');

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

// Parse frontmatter from README.md
function getProjectMetadata(projectPath) {
    try {
        const readmePath = path.join(__dirname, '..', 'projects', projectPath, 'README.md');
        const content = fs.readFileSync(readmePath, 'utf8');
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        
        if (frontmatterMatch) {
            return yaml.parse(frontmatterMatch[1]);
        }
        return {};
    } catch (e) {
        return {};
    }
}

// Get all directories in the public folder
const publicDir = path.join(__dirname, '..', 'gh-pages-public');
const projects = fs.readdirSync(publicDir)
    .filter(f => fs.statSync(path.join(publicDir, f)).isDirectory());

// Get git info and metadata for each project
const projectsInfo = projects.map(project => {
    const gitInfo = getGitInfo(`projects/${project}`);
    const metadata = getProjectMetadata(project);
    return {
        name: project,
        ...gitInfo,
        ...metadata
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
            background: #f8fafc;
        }
        h1 { color: #2d3748; }
        .projects {
            display: grid;
            gap: 1.5rem;
            margin-top: 2rem;
        }
        .project-link {
            display: block;
            padding: 1.5rem;
            background: white;
            border-radius: 0.75rem;
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
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #1a202c;
        }
        .project-description {
            color: #4a5568;
            margin-bottom: 1rem;
        }
        .project-meta {
            font-size: 0.875rem;
            color: #718096;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #e2e8f0;
        }
        .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 0.75rem;
        }
        .tag {
            background: #edf2f7;
            color: #4a5568;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
        }
        .notes {
            margin-top: 0.75rem;
        }
        .note {
            display: inline-block;
            background: #fff5f5;
            color: #c53030;
            padding: 0.25rem 0.75rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            font-weight: 500;
            margin-right: 0.5rem;
            border: 1px solid #feb2b2;
        }
    </style>
</head>
<body>
    <h1>Tools Projects</h1>
    <div class="projects">
        ${projectsInfo.map(project => `
        <a href="./${project.name}" class="project-link">
            <div class="project-title">${project.title || project.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
            ${project.description ? `<div class="project-description">${project.description}</div>` : ''}
            ${project.tags ? `
            <div class="tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>` : ''}
            ${project.notes ? `
            <div class="notes">
                ${project.notes.map(note => `<span class="note">${note}</span>`).join('')}
            </div>` : ''}
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