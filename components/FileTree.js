// FileTree Component
class FileTree {
    constructor(container) {
        this.container = container;
        this.structure = [];
    }

    // Set the data structure
    setData(data) {
        this.structure = data;
        this.render();
    }

    // Create a folder item
    createFolderItem(item) {
        const folderDiv = document.createElement('div');
        folderDiv.className = 'tree-folder';
        
        const folderContent = document.createElement('div');
        folderContent.className = 'folder-content';
        
        const folderName = document.createElement('span');
        folderName.className = 'folder-name';
        folderName.innerHTML = `
            <span class="folder-icon">📁</span>
            ${item.name}
        `;
        
        folderContent.appendChild(folderName);
        folderDiv.appendChild(folderContent);
        
        // Add click handler for folder expansion
        folderName.addEventListener('click', () => {
            folderDiv.classList.toggle('expanded');
            if (folderDiv.classList.contains('expanded')) {
                folderName.querySelector('.folder-icon').textContent = '📂';
            } else {
                folderName.querySelector('.folder-icon').textContent = '📁';
            }
        });
        
        // Recursively render children
        if (item.children && item.children.length > 0) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'folder-children';
            item.children.forEach(child => {
                const childElement = child.type === 'folder' 
                    ? this.createFolderItem(child)
                    : this.createFileItem(child);
                childrenContainer.appendChild(childElement);
            });
            folderDiv.appendChild(childrenContainer);
        }
        
        return folderDiv;
    }

    // Create a file item
    createFileItem(item) {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'tree-file';
        
        // Special icon for home
        const icon = item.name === 'home' ? '🏠' : '📄';
        
        fileDiv.innerHTML = `
            <span class="file-icon">${icon}</span>
            ${item.name}
        `;
        
        // Add click handler for file selection and navigation
        fileDiv.addEventListener('click', () => {
            document.querySelectorAll('.tree-file').forEach(f => f.classList.remove('selected'));
            fileDiv.classList.add('selected');
            
            // Handle navigation if link is provided
            if (item.link) {
                window.location.href = item.link;
            }
        });
        
        // Add hover style for clickable items
        if (item.link) {
            fileDiv.classList.add('clickable');
        }
        
        return fileDiv;
    }

    // Render the entire tree
    render() {
        this.container.innerHTML = '';
        this.structure.forEach(item => {
            const element = item.type === 'folder' 
                ? this.createFolderItem(item)
                : this.createFileItem(item);
            this.container.appendChild(element);
        });
    }
}

export default FileTree;
