export default {
    admin: [
        {
            name: 'Dashboard',
            icon: 'glyphicon glyphicon-blackboard',
            path: '/admin/dashboard',
            component: './Dashboard/Dashboard'
        },
        {
            name: 'Pages',
            icon: 'glyphicon glyphicon-blackboard',
            path: '/admin/pages',
            exact: false,
            component: './Pages/PageList',
            sub: [
                {
                    name: 'Create Page',
                    path: '/pages/create',
                    component: './CreatePage'
                },
                {
                    name: 'Edit Page',
                    path: '/pages/edit/:id',
                    component: './CreatePage'
                }
            ]
        },
        {
            name: 'Posts',
            icon: 'glyphicon glyphicon-pushpin',
            path: '/admin/posts',
            component: './Posts/PostList',
            sub: [
                {
                    name: 'Create Post',
                    path: '/admin/posts/create',
                    component: './Posts/CreatePost'
                },
                {
                    name: 'Edit Post',
                    path: '/admin/posts/edit/:id',
                    component: './Posts/PostList'
                }
            ]
        },
        {
            name: 'Menus',
            icon: 'glyphicon glyphicon-th-list',
            path: '/admin/menus',
            component: './Menus/MenuList'
        },
        {
            name: 'Categories',
            icon: 'glyphicon glyphicon-tags',
            path: '/admin/categories',
            component: './Categories/CategoryList'
        },
        {
            name: 'Galleries',
            icon: 'glyphicon glyphicon-camera',
            path: '/admin/galleries',
            component: './Galleries/GalleryList'
        },
        {
            name: 'Users',
            icon: 'glyphicon glyphicon-user',
            path: '/admin/users',
            component: './Users/UserList'
        }
    ],
    dialogs: [
        {
            name: 'Images',
            icon: 'glyphicon glyphicon-user',
            path: '/admin/dialog/images',
            component: './Tools/ImageBrowser/ImageBrowse.js'
        }
    ]
}; 