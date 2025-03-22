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
                        { type: 'file', name: 'Nucels DAO', path: '/projects/nucels' },
                        { type: 'file', name: 'Irreversible DAO', path: '/projects/irreversible' },
                        { type: 'file', name: 'Vehicle DAO', path: '/projects/vehicle' }
                    ]
                },
                {
                    type: 'folder',
                    name: 'personal',
                    children: [
                        { type: 'file', name: 'X posts & threads', path: '/personal/posts' },
                        { type: 'file', name: 'ideas', path: '/personal/ideas' },
                        { type: 'file', name: 'books/films', path: '/personal/media' }
                    ]
                },
                {
                    type: 'folder',
                    name: 'past projects',
                    children: [
                        { type: 'file', name: 'past projects', path: '/past-projects' },
                        { type: 'file', name: 'contact', path: '/contact' }
                    ]
                }
            ]
        }
    ];

    fileTree.setData(structure);
});

