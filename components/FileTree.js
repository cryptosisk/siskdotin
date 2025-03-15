// FileTree.js
class Tree {
  constructor(container, options = {}) {
    this.container = container;
    this.selectedId = options.initialSelectedId || null;
    this.expandedItems = new Set(options.initialExpandedItems || []);
    this.elements = options.elements || [];
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  toggleExpand(id) {
    if (this.expandedItems.has(id)) {
      this.expandedItems.delete(id);
    } else {
      this.expandedItems.add(id);
    }
    this.render();
  }

  select(id) {
    this.selectedId = id;
    this.render();
  }

  createFolderElement(item) {
    const isExpanded = this.expandedItems.has(item.id);
    const folderDiv = document.createElement('div');
    folderDiv.className = 'folder';
    
    const folderHeader = document.createElement('div');
    folderHeader.className = `folder-header ${this.selectedId === item.id ? 'selected' : ''}`;
    folderHeader.innerHTML = `
      <span class="icon">${isExpanded ? '📂' : '📁'}</span>
      <span class="name">${item.name}</span>
    `;
    
    folderHeader.addEventListener('click', () => {
      if (item.isSelectable) {
        this.select(item.id);
      }
      this.toggleExpand(item.id);
    });

    folderDiv.appendChild(folderHeader);

    if (isExpanded && item.children) {
      const childrenDiv = document.createElement('div');
      childrenDiv.className = 'folder-children';
      item.children.forEach(child => {
        childrenDiv.appendChild(
          child.children ? this.createFolderElement(child) : this.createFileElement(child)
        );
      });
      folderDiv.appendChild(childrenDiv);
    }

    return folderDiv;
  }

  createFileElement(item) {
    const fileDiv = document.createElement('div');
    fileDiv.className = `file ${this.selectedId === item.id ? 'selected' : ''}`;
    fileDiv.innerHTML = `
      <span class="icon">📄</span>
      <span class="name">${item.name}</span>
    `;
    
    if (item.isSelectable) {
      fileDiv.addEventListener('click', () => this.select(item.id));
    }

    return fileDiv;
  }

  render() {
    this.container.innerHTML = '';
    this.elements.forEach(element => {
      this.container.appendChild(
        element.children ? this.createFolderElement(element) : this.createFileElement(element)
      );
    });
  }

  attachEventListeners() {
    // Add any global event listeners here
  }
}

export { Tree };
