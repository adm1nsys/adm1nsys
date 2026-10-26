// Everything personal that changes over time lives here.
// Empty values are simply hidden on the site.
window.SITE = {
  name: 'Heorhii Romanenko',
  github: 'https://github.com/adm1nsys',
  repo: 'https://github.com/adm1nsys/adm1nsys',

  email: 'georgeiv14@gmail.com',
  // e.g. 'assets/files/lebenslauf.pdf'
  cv: '',
  // 3:4 portrait; without it the initials are shown
  photo: 'assets/img/portrait-formal.jpg',
  birthday: '2004-10-18',

  // Tiles of menu.html. To add a page: create the HTML file with <body data-page="id">
  // and add it here; the label comes from the I18N key.
  pages: [
    { id: 'about', href: 'index.html', label: 'navAbout', icon: 'person' },
    { id: 'music', href: 'music.html', label: 'navMusic', icon: 'note' },
    { id: 'links', href: 'links.html', label: 'navLinks', icon: 'link' },
    { id: 'projects', href: 'projects.html', label: 'navProjects', icon: 'stack' }
  ],

  // Apple Music playlist links as copied from the Share menu, e.g.
  // { title: 'Night drive', url: 'https://music.apple.com/de/playlist/night-drive/pl.u-xxxxxxxx' }
  playlists: [
    { title: 'iDeal X¥P3', url: 'https://music.apple.com/ua/playlist/ideal-x%C2%A5p3/pl.u-jV89b7DFDG36gjP' }
  ],

  // Also listed in the contact block on the main page
  socials: [
    { name: 'GitHub', handle: '@adm1nsys', url: 'https://github.com/adm1nsys' },
    { name: 'Figma', handle: '@adminpro', url: 'https://www.figma.com/@adminpro' },
    { name: 'Instagram', handle: '@_george_.jpg', url: 'https://www.instagram.com/_george_.jpg/' },
    { name: 'Instagram · Design', handle: '@_george_.png', url: 'https://www.instagram.com/_george_.png/' },
    { name: 'X', handle: '@_george_jpg', url: 'https://x.com/_george_jpg' }
    // { name: 'Telegram', handle: '@username', url: 'https://t.me/username' },
    // { name: 'LinkedIn', handle: 'Heorhii Romanenko', url: 'https://www.linkedin.com/in/username' },
  ],

  support: [
    { name: 'Come Back Alive', url: 'https://savelife.in.ua/en/' },
    { name: 'Serhiy Prytula Charity Foundation', url: 'https://prytulafoundation.org/en/' }
  ]
};
