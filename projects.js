/* =========================================================
   YOUR PROJECTS — edit everything here.
   Pictures: put files in the "images" folder, then write the path,
   e.g. cover: 'images/manabus-cover.jpg'. Leave '' to show a color block.
   ========================================================= */
const PROJECTS = [
  {
    slug: 'UTeMbus',
    title: 'UTeMbus',
    subtitle: 'Campus Bus Tracking App',
    year: '2026',
    category: 'UI/UX Design',
    tools: 'Figma',
    role: 'UI/UX Designer',
    color: '#6f8fd8',
    cover: '',                       // e.g. 'images/utembus-cover.jpg' (tilted phone mockup works well)
    badge: 'First place, FigMaxperience',
    idea: 'UTeMbus is a campus bus tracking app concept designed to help UTeM students check bus locations, estimated arrival times, and routes. It aims to make daily commutes easier and reduce the uncertainty of waiting for a bus. A 4-page prototype that won first place at FigMaxperience.',
    process: [
      { title: 'Research and user flow', text: 'I focused on the challenges students face when waiting for campus buses, particularly uncertainty about arrival times and bus locations. I created a user flow to map out the steps students take when using the app, from checking bus locations to receiving notifications.', image: '' },
      { title: 'Wireframes', text: 'I planned the layout of each screen to make important information easy to find, including bus locations, arrival times, and routes.', image: '' },
      { title: 'Design decisions', text: 'I chose a teal-based colour palette to give the interface a fresh, modern look. I kept the layout simple and prioritised readability so students could check bus information quickly.', image: '' }
    ],
    outcome: {
      text: 'The final prototype includes a home screen with bus locations, a route map, and notifications for estimated arrival times. It provides students with a clear and efficient way to track campus buses and plan their commutes.',
      images: ['', '', ''],          // final screens / mockups
      link: ''                       // Figma prototype link, e.g. 'https://www.figma.com/proto/...'
    }
  },

  {
    slug: 'rentify',
    title: 'Rentify',
    subtitle: 'Clothing Rental System',
    year: '2025',
    category: 'System Design · Web / UI',
    tools: 'Figma, HTML/CSS',
    role: 'Designer and developer',
    color: '#c98a8a',
    cover: '',                       // website screenshot or clothing photo
    badge: 'Diploma final-year project',
    idea: 'Rentify is a clothing rental system designed to provide an affordable and sustainable alternative to traditional shopping. It allows users to rent clothing items for a short period, reducing waste and promoting a more environmentally friendly approach to fashion. My role involved both the design and development of the platform.',
    process: [
      { title: 'Main user journey', text: 'I mapped out the steps a user takes from discovering available clothing items to completing the rental process.', image: '' },
      { title: 'Interface design', text: 'I designed the interface to be intuitive and user-friendly, focusing on the rental process and item discovery.', image: '' },
      { title: 'Important features', text: 'I prioritized features that would enhance the user experience, such as a simple search function and a clear rental timeline.', image: '' }
    ],
    outcome: { text: 'The final platform includes a responsive web interface and a streamlined rental process.', images: ['', ''], link: '' }
  },

  {
    slug: '100plus',
    title: '100PLUS',
    subtitle: 'AI Advertising Campaign',
    year: '2025',
    category: 'Visual Design · Art Direction',
    tools: 'AI tools, Photoshop / Illustrator',
    role: 'Art director and designer',
    color: '#e3c96a',
    cover: 'images/plus-cover.jpg',   // the KEKAL ONZ poster
    badge: 'Creative campaign',
    idea: '100PLUS is a creative advertising campaign concept that leverages AI tools to generate innovative visuals and ideas. The campaign aims to promote the 100PLUS brand through a series of eye-catching advertisements, including billboards, truck panels, and social media designs. My role involved art direction and design, guiding the creative process and ensuring the final outputs aligned with the brand identity.',
    process: [
      { title: 'Moodboard', text: 'I created a moodboard to establish the visual direction for the campaign, focusing on vibrant colors and dynamic compositions that reflect the energy of the 100PLUS brand.', image: 'images/plus-moodboard.png' },
      { title: 'AI-generated base image', text: 'The base visual generated with AI tools, before any typography or branding was added.', image: 'images/plus-original.jpg' },
      { title: 'Billboard layout', text: 'The 30\' x 10\' billboard artwork, set up with print dimensions.', image: 'images/plus-tech-billboard.jpg' }
    ],
    outcome: {
      text: 'The final campaign pieces: billboard, truck panel and Instagram designs.',
      images: [
        'images/plus-mockup-billboard.jpg',
        'images/plus-mockup-truck.jpg',
        'images/plus-mockup-instagram.jpg'
      ],
      link: ''
    }
  },

  {
    slug: 'see-beyond-the-silence',
    title: 'See Beyond the Silence',
    subtitle: 'Mental Health Awareness Campaign',
    year: '2026',
    category: 'Visual Design · Art Direction',
    tools: 'Adobe Photoshop, Generative AI',
    role: 'Designer',
    color: '#8c2f39',
    cover: 'images/rst-cover.jpg',
    badge: 'Digital Imaging project',
    idea: 'See Beyond the Silence is a mental health awareness campaign about struggles that people rarely say out loud. It looks at three experiences: rejection sensitivity, emotional isolation and emotional eating. Each one is told through a single line that begins with "I thought...", paired with a photograph.',
    process: [
      { title: 'Photoshoot', text: 'Each theme was photographed as its own scene: a dark bedroom with balloons for rejection sensitivity, light painting for emotional isolation, and a birthday cake for emotional eating.', image: 'images/rst-photoshoot.jpg' },
      { title: 'Layouts and print specs', text: 'The designs were prepared for three formats: a 6 m x 3 m billboard (1:20), bus stop lightboxes at 594 mm x 841 mm (1:7), and Instagram posts at 1080 px x 1080 px (1:10).', image: 'images/rst-tech-billboard.jpg' },
      { title: 'Showing it in context', text: 'I used generative AI to place the finished designs into a realistic Kuala Lumpur scene at blue hour, with a billboard, a bus stop and a phone in the foreground, without changing the artwork itself.', image: 'images/rst-ai-mockup.jpg' }
    ],
    outcome: {
      text: 'One campaign across billboard, bus stop lightbox and Instagram, shown here as mockups.',
      images: ['images/rst-billboard.jpg', 'images/rst-lightbox.jpg', 'images/rst-instagram.jpg'],
      link: ''
    }
  }
];