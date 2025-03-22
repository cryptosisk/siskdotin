import FileTree from './components/FileTree.js';

document.addEventListener('DOMContentLoaded', () => {
    const fileTreeContainer = document.getElementById('fileTree');
    const fileTree = new FileTree(fileTreeContainer);

    // Sample data structure
    const structure = [
        {
            type: 'folder',
            name: 'sisk',
            children: [
                { type: 'file', name: 'home', link: '/' },
                {
                    type: 'folder',
                    name: 'current projects',
                    children: [
                        { type: 'file', name: 'Nucels DAO' },
                        { type: 'file', name: 'Irreversible DAO' },
                        { type: 'file', name: 'Vehicle DAO' }
                    ]
                },
                {
                    type: 'folder',
                    name: 'personal',
                    children: [
                        { type: 'file', name: 'X posts & threads' },
                        { type: 'file', name: 'ideas' },
                        { type: 'file', name: 'books/films' }
                    ]
                },
                {
                    type: 'folder',
                    name: 'past projects',
                    children: [
                        { type: 'file', name: 'past projects' },
                        { type: 'file', name: 'contact' }
                    ]
                }
            ]
        }
    ];

    fileTree.setData(structure);
});

