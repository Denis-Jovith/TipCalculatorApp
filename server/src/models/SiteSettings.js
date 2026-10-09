import mongoose from 'mongoose';

// Singleton document holding every editable piece of global site content.
const siteSettingsSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: 'Denis Jovitus Buberwa' },
    shortName: { type: String, default: 'DJB' },
    akaNames: {
      type: [String],
      default: ['Denis Jovith', 'Captain D', 'DJB', 'Denis Buberwa', 'Denis-Jovith', 'Denis']
    },
    akaLabel: { type: String, default: 'Also known as:' },
    tagline: { type: String, default: 'Multipurpose ICT Professional & Full-Stack MERN Developer' },
    // Rotating marquee under the hero — identity/role descriptors, not names (names live in akaNames).
    roles: {
      type: [String],
      default: [
        'Software Developer',
        'ICT Systems Professional',
        'Cybersecurity Enthusiast',
        'Blockchain Explorer',
        'AI Agents Professional',
        'MERN Stack Engineer'
      ]
    },
    heroSubtitle: {
      type: String,
      default:
        'A fully-packed ICT professional — building secure infrastructure, full-stack MERN products, and exploring cybersecurity, blockchain, and AI agent systems. Based in Dar es Salaam, Tanzania.'
    },
    // Small text under the tagline, e.g. "aka Denis Jovith · Captain D · ...". Leave blank to hide the word.
    heroAkaLabel: { type: String, default: 'aka' },
    aboutHtml: {
      type: String,
      default:
        '<p>I am a multipurpose ICT and software professional — equally at home securing enterprise infrastructure and shipping full-stack products. My primary stack is the <strong>MERN stack (MongoDB, Express.js, React.js, Node.js)</strong>, with additional proficiency in TypeScript, Python, Java, Kotlin, Ktor, C#, and PHP.</p><p>On the infrastructure side, I administer Windows and Linux servers, Active Directory, and Microsoft 365, manage cloud/VPS hosting, and configure firewalls and DNS — currently as an ICT Officer supporting a banking-adjacent SACCOS.</p><p>Beyond my day-to-day work, I&rsquo;m a <strong>cybersecurity enthusiast</strong> exploring ethical hacking, a <strong>blockchain explorer</strong>, and increasingly focused on <strong>AI agent systems and automation</strong> — always learning, always building.</p>'
    },
    heroImage: { type: String, default: '/seed/profile.jpeg' },
    // Extra profile photos — when this has 2+ entries the hero shows an auto-playing,
    // pausable crossfade carousel instead of the single static heroImage.
    heroImages: { type: [String], default: [] },
    resumeUrl: { type: String, default: '' },
    location: { type: String, default: 'Dar es Salaam, Tanzania' },
    email: { type: String, default: 'denisjovitusbuberwa@gmail.com' },
    phone: { type: String, default: '+255 758 548 912' },

    // Nav bar link labels — hrefs stay fixed to each section's anchor, only the visible text is editable.
    navLabels: {
      type: {
        about: { type: String, default: 'About' },
        skills: { type: String, default: 'Skills' },
        experience: { type: String, default: 'Experience' },
        education: { type: String, default: 'Education' },
        projects: { type: String, default: 'Projects' },
        achievements: { type: String, default: 'Achievements' },
        recommendations: { type: String, default: 'Recommendations' },
        connect: { type: String, default: 'Connect' },
        links: { type: String, default: 'Links' }
      },
      default: {}
    },

    // Hero call-to-action buttons
    heroCtaPrimaryText: { type: String, default: 'View My Work' },
    heroCtaPrimaryLink: { type: String, default: '#projects' },
    heroCtaSecondaryText: { type: String, default: "Let's Connect" },
    heroCtaSecondaryLink: { type: String, default: '#connect' },
    resumeButtonText: { type: String, default: 'Resume' },

    // Section titles & subtitles
    aboutTitle: { type: String, default: 'About Me' },
    skillsTitle: { type: String, default: 'Skills & Expertise' },
    experienceTitle: { type: String, default: 'Experience & Education' },
    employmentLabel: { type: String, default: 'Employment' },
    educationLabel: { type: String, default: 'Education' },
    projectsTitle: { type: String, default: 'Projects' },
    projectsSubtitle: {
      type: String,
      default: 'A mix of web, mobile and 3D work. Click a live preview to scroll it right here, or open it in a new tab.'
    },
    achievementsTitle: { type: String, default: 'Achievements & Milestones' },
    achievementsSubtitle: {
      type: String,
      default: 'Certifications, awards, and memorable moments along the way — click one to see more, download it, or leave a comment.'
    },
    recommendationsTitle: { type: String, default: 'Recommendations' },
    recommendationsSubtitle: {
      type: String,
      default: "What people I've worked with have to say. Worked with me? Leave one below."
    },
    connectTitle: { type: String, default: "Let's Connect" },
    connectSubtitle: {
      type: String,
      default: 'Have a project in mind, or just want to say hi? Reach out on any platform below.'
    },

    // The standalone /links "link in bio" page and the QR codes shown there and on the
    // homepage Connect section (both render via the same StyledQR component). Module shape
    // is deliberately not exposed here — 'square' is the only shape verified reliable across
    // payload lengths (see StyledQR.jsx) and a customizable shape could silently reintroduce
    // that scan-failure bug. Colour is safe to customize as long as contrast stays high.
    linksPageHeading: { type: String, default: '' },
    linksPageSubtitle: { type: String, default: '' },
    qrColor: { type: String, default: '#4FA8A8' },
    qrBgColor: { type: String, default: '#08122c' },

    // Footer — every piece is independently editable and may be left blank to omit it.
    footerCopyrightSymbol: { type: String, default: '©' },
    footerShowYear: { type: Boolean, default: true },
    footerTagline: { type: String, default: 'Built with the MERN stack as a Progressive Web App.' },
    seoTitle: {
      type: String,
      default:
        'Denis Jovitus Buberwa | Denis Jovith | Captain D | DJB — Software Developer, ICT Professional & Cybersecurity Enthusiast'
    },
    seoDescription: {
      type: String,
      default:
        'Denis Jovitus Buberwa — also known as Denis Jovith, Captain D, DJB, Denis Buberwa, Denis-Jovith — is a multipurpose ICT professional from Dar es Salaam, Tanzania: MERN stack software developer, ICT systems administrator, cybersecurity enthusiast, blockchain explorer, and AI agents professional.'
    },
    seoKeywords: {
      type: [String],
      default: [
        'Denis Jovitus Buberwa',
        'Denis Jovith',
        'Denis-Jovith',
        'Captain D',
        'DJB',
        'Denis Buberwa',
        'Denis Jovitus',
        'Denis',
        'Software Developer Tanzania',
        'MERN Stack Developer Tanzania',
        'ICT Professional Dar es Salaam',
        'ICT Systems Administrator',
        'Cybersecurity Enthusiast',
        'Blockchain Explorer',
        'AI Agents Professional',
        'AI Agent Developer'
      ]
    },
    siteUrl: { type: String, default: 'https://denisjovitusbuberwa.djb.co.tz' }
  },
  { timestamps: true }
);

export default mongoose.model('SiteSettings', siteSettingsSchema);
