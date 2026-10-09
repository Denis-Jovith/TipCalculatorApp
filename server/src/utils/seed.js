import 'dotenv/config';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import SiteSettings from '../models/SiteSettings.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
import SocialLink from '../models/SocialLink.js';
import Project from '../models/Project.js';
import Achievement from '../models/Achievement.js';
import LiveApp from '../models/LiveApp.js';
import QrDesign from '../models/QrDesign.js';

export const skills = [
  { name: 'Windows Server Administration', category: 'Systems & Infrastructure', level: 90, order: 1 },
  { name: 'Linux Administration (Ubuntu & RHEL)', category: 'Systems & Infrastructure', level: 88, order: 2 },
  { name: 'Active Directory Services', category: 'Systems & Infrastructure', level: 88, order: 3 },
  {
    name: 'Microsoft 365 Administration (Exchange Online, Teams, SharePoint, OneDrive)',
    category: 'Systems & Infrastructure',
    level: 90,
    order: 4
  },
  { name: 'Server Management, Hosting & Migration (Contabo VPS)', category: 'Systems & Infrastructure', level: 85, order: 5 },
  { name: 'Firewall Configuration (UFW)', category: 'Systems & Infrastructure', level: 82, order: 6 },
  { name: 'Cloudflare DNS Management & Domain Administration', category: 'Systems & Infrastructure', level: 85, order: 7 },
  { name: 'Web Hosting & Website Deployment', category: 'Systems & Infrastructure', level: 82, order: 8 },
  { name: 'ICT Infrastructure Support & Hardware Maintenance', category: 'Systems & Infrastructure', level: 85, order: 9 },
  { name: 'Service Desk & Helpdesk Support (ITSM)', category: 'Systems & Infrastructure', level: 85, order: 10 },

  { name: 'MERN Stack (MongoDB, Express, React, Node.js) - Primary Stack', category: 'Programming & Web', level: 92, order: 1 },
  { name: 'TypeScript / JavaScript', category: 'Programming & Web', level: 88, order: 2 },
  { name: 'React & Progressive Web Apps (PWA)', category: 'Programming & Web', level: 88, order: 3 },
  { name: 'Python', category: 'Programming & Web', level: 75, order: 4 },
  { name: 'Java', category: 'Programming & Web', level: 78, order: 5 },
  { name: 'Kotlin & Ktor', category: 'Programming & Web', level: 82, order: 6 },
  { name: 'C#', category: 'Programming & Web', level: 65, order: 7 },
  { name: 'PHP', category: 'Programming & Web', level: 72, order: 8 },
  { name: 'HTML, CSS & SQL', category: 'Programming & Web', level: 85, order: 9 },

  { name: 'Core Banking System Support', category: 'Banking & Enterprise', level: 80, order: 1 },
  { name: 'Banking Operations Understanding', category: 'Banking & Enterprise', level: 75, order: 2 },
  { name: 'Enterprise Application Support', category: 'Banking & Enterprise', level: 80, order: 3 },
  { name: 'Enterprise File Management & Storage Concepts', category: 'Banking & Enterprise', level: 78, order: 4 },
  { name: 'Incident & Request Management (ITSM)', category: 'Banking & Enterprise', level: 82, order: 5 },

  { name: 'Network Troubleshooting & LAN Configuration', category: 'Networking', level: 85, order: 1 },
  { name: 'Router & Network Configuration / LAN & WAN Support', category: 'Networking', level: 80, order: 2 },
  { name: 'Internet & Connectivity Support', category: 'Networking', level: 80, order: 3 },
  { name: 'Basic Network Security', category: 'Networking', level: 75, order: 4 },

  { name: 'Git & GitHub', category: 'Tools & Platforms', level: 90, order: 1 },
  { name: 'IDEs (Android Studio, Visual Studio, VS Code)', category: 'Tools & Platforms', level: 88, order: 2 },
  { name: 'Gradle Build Systems', category: 'Tools & Platforms', level: 75, order: 3 },
  { name: 'Agile Development Practices', category: 'Tools & Platforms', level: 78, order: 4 },
  { name: 'Jira & Trello', category: 'Tools & Platforms', level: 78, order: 5 },

  { name: 'Jetpack Compose', category: 'Mobile & UI/UX', level: 85, order: 1 },
  { name: 'Android UI Lifecycle', category: 'Mobile & UI/UX', level: 80, order: 2 },
  { name: 'API Integration', category: 'Mobile & UI/UX', level: 85, order: 3 },
  { name: 'Responsive Design', category: 'Mobile & UI/UX', level: 85, order: 4 },
  { name: 'Kotlin Multiplatform (KMM)', category: 'Mobile & UI/UX', level: 75, order: 5 },
  { name: 'Figma (UI/UX Design)', category: 'Mobile & UI/UX', level: 70, order: 6 },
  { name: 'Blender (3D Design & Rendering)', category: 'Mobile & UI/UX', level: 65, order: 7 },

  { name: 'TeamViewer', category: 'Remote Support & Collaboration', level: 85, order: 1 },
  { name: 'RustDesk', category: 'Remote Support & Collaboration', level: 80, order: 2 },
  { name: 'Remote Desktop Tools', category: 'Remote Support & Collaboration', level: 82, order: 3 },
  { name: 'Online Collaboration Systems', category: 'Remote Support & Collaboration', level: 82, order: 4 },

  { name: 'Ethical Hacking Fundamentals', category: 'Cybersecurity & Emerging Tech', level: 60, order: 1 },
  { name: 'Network & Firewall Security', category: 'Cybersecurity & Emerging Tech', level: 75, order: 2 },
  { name: 'Blockchain Fundamentals', category: 'Cybersecurity & Emerging Tech', level: 55, order: 3 },
  { name: 'AI Agents & Automation', category: 'Cybersecurity & Emerging Tech', level: 65, order: 4 }
];

export const experience = [
  {
    role: 'ICT Officer',
    organization: 'ATCL SACCOS',
    location: 'Dar es Salaam, Tanzania',
    startDate: 'March 2025',
    endDate: 'Present',
    order: 1,
    bullets: [
      'Administer and maintain Active Directory Services, Microsoft 365 Admin Center, and enterprise email/collaboration platforms',
      'Migrated organizational servers from shared hosting to Contabo VPS within the first 4 months of employment, improving reliability and control',
      'Configured UFW firewall and Cloudflare DNS/security settings to strengthen system and network security',
      'Implemented fibre internet infrastructure, improving uptime and operational stability',
      'Led the Microsoft 365 migration and collaboration environment setup',
      'Developed and delivered the atclsaccos.co.tz corporate website end-to-end, and continue to maintain it',
      'Provide ICT support and Service Desk assistance across organizational systems, managing incidents and requests using ITSM processes',
      'Support Core Banking System users and operational applications; administer network, hardware and LAN infrastructure, with remote support via TeamViewer and RustDesk',
      'Work with vendors and developers during system upgrades, integrations, and digital transformation initiatives'
    ]
  },
  {
    role: 'ICT Intern',
    organization: 'Tanzania Airports Authority (Songwe Airport)',
    location: 'Mbeya, Tanzania',
    startDate: 'October 2024',
    endDate: 'November 2024',
    order: 2,
    bullets: [
      'Provided ICT support for airport systems and users',
      'Assisted in troubleshooting hardware and network issues',
      'Supported maintenance of ICT infrastructure and operational systems',
      'Assisted users with technical support and operational assistance'
    ]
  },
  {
    role: 'ICT Intern',
    organization: 'NMB Bank Plc (Usongwe Branch)',
    location: 'Mbeya, Tanzania',
    startDate: 'August 2024',
    endDate: 'September 2024',
    order: 3,
    bullets: [
      'Supported branch ICT operations and Core Banking System users',
      'Assisted in Core Banking System support and troubleshooting',
      'Provided technical support and Service Desk assistance to branch staff',
      'Observed banking operations and ICT service workflows first-hand'
    ]
  }
];

export const education = [
  {
    degree: 'Bachelor of Computer Science (BCS), Honors',
    school: 'Mbeya University of Science and Technology (MUST)',
    period: '2022 - 2025',
    details: 'GPA: 4.3 / 5.0',
    order: 1
  },
  {
    degree: 'Advanced Certificate of Secondary Education (Division I)',
    school: 'Mwakaleli Secondary School',
    period: '2020 - 2022',
    details: 'Points 9',
    order: 2
  },
  {
    degree: 'Certificate of Secondary Education (Division I)',
    school: 'Rubya Seminary School',
    period: '2016 - 2019',
    details: 'Points 9',
    order: 3
  },
  {
    degree: 'Certificate of Primary School Education',
    school: 'Rubya Seminary School',
    period: '2008 - 2015',
    details: '',
    order: 4
  }
];

const socialLinks = [
  { platform: 'GitHub', url: 'https://github.com/Denis-Jovith', icon: 'Github', order: 1 },
  { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/denis-buberwa-555b09258/', icon: 'Linkedin', order: 2 },
  { platform: 'Email', url: 'mailto:denisjovitusbuberwa@gmail.com', icon: 'Mail', order: 3 },
  { platform: 'Phone / WhatsApp', url: 'https://wa.me/255758548912', icon: 'Phone', order: 4 }
];

// Real, currently-operated platforms - edit freely from Admin -> Live Applications.
// NOTE: "cepet.co.tz" is a best guess at the intended domain (typed as "cepe.to.tz") -
// please correct it from the admin panel if that's not quite right.
const liveApps = [
  {
    name: 'ATCL SACCOS',
    url: 'https://atclsaccos.co.tz',
    description: 'Corporate website and member platform for ATCL SACCOS, built, deployed and maintained end-to-end.',
    status: 'live',
    order: 1
  },
  {
    name: 'CePET',
    url: 'https://cepet.co.tz',
    description: "Prof. Kalafunja M. O-saki's academic platform - digital identity, research library, CePET Academy, and confidential supervision workspace.",
    status: 'live',
    order: 2
  },
  {
    name: 'Denis Jovitus Buberwa',
    url: 'https://denisjovitusbuberwa.co.tz',
    description: 'Companion domain for this portfolio.',
    status: 'live',
    order: 3
  },
  {
    name: 'Jovinile Tech Force',
    url: 'https://joviniletechforce.djb.co.tz',
    description: 'In progress.',
    status: 'coming-soon',
    order: 4
  }
];

// A starting example for the "Saved QR codes" gallery in Admin -> QR Codes - admins can
// add as many independent designs as they like (business cards, flyers, campaign links).
const qrDesigns = [
  {
    name: 'Links page QR',
    value: 'https://denisjovitusbuberwa.djb.co.tz/links',
    color: '#4FA8A8',
    bgColor: '#08122c',
    logoUrl: '/logo/icon-192.png',
    logoSize: 0.22,
    order: 1
  }
];

const projects = [
  {
    title: 'ATCL SACCOS Corporate Website',
    category: 'web',
    summary: 'Responsive corporate website built and deployed for ATCL SACCOS, hosted on a self-managed Contabo VPS behind Cloudflare.',
    descriptionHtml:
      '<p>Designed, developed and deployed the corporate website for ATCL SACCOS, then migrated it from shared hosting to a self-managed Contabo VPS with Cloudflare DNS and UFW firewall hardening for improved reliability and security.</p>',
    thumbnail: '/seed/web-first-website.png',
    liveUrl: 'https://atclsaccos.co.tz',
    tags: ['Web Hosting', 'Cloudflare', 'Linux', 'Deployment'],
    featured: true,
    order: 1
  },
  {
    title: 'My First Website',
    category: 'web',
    summary: 'A foundational HTML/CSS website - the very first site I ever shipped.',
    descriptionHtml: '<p>My first website project, built with plain HTML and CSS to learn the fundamentals of the web.</p>',
    thumbnail: '/seed/web-first-website.png',
    tags: ['HTML', 'CSS'],
    order: 2
  },
  {
    title: 'Class Attendance System',
    category: 'web',
    summary: 'A Java-based class attendance management system.',
    descriptionHtml: '<p>A desktop/web attendance tracking system built in Java to help manage student attendance records.</p>',
    thumbnail: '/seed/web-class-attendance.png',
    tags: ['Java'],
    order: 3
  },
  {
    title: 'C Programming Projects',
    category: 'web',
    summary: 'A collection of C programming exercises and mini-projects.',
    descriptionHtml: '<p>A set of C projects exploring core programming and data-structure concepts.</p>',
    thumbnail: '/seed/web-c-projects.png',
    tags: ['C'],
    order: 4
  },
  {
    title: 'My Portfolio App',
    category: 'mobile',
    summary: 'Native Android portfolio app built with Kotlin and Jetpack Compose - the predecessor to this very website.',
    descriptionHtml:
      '<p>A Jetpack Compose Android portfolio app featuring animated gradients, horizontally scrolling project galleries, and an embedded Blender showreel. This MERN + PWA site is its full-stack, browser-based evolution.</p>',
    thumbnail: '/seed/mobile-myportfolio.png',
    repoUrl: 'https://github.com/Denis-Jovith/MyPortFolio',
    tags: ['Kotlin', 'Jetpack Compose'],
    featured: true,
    order: 5
  },
  {
    title: 'Tip Calculator',
    category: 'mobile',
    summary: 'A clean, animated tip-calculator Android app built with Kotlin and Jetpack Compose.',
    descriptionHtml: '<p>An Android tip calculator app built with Kotlin and Jetpack Compose, focused on a clean Material 3 UI.</p>',
    thumbnail: '/seed/mobile-tip-calculator.png',
    tags: ['Kotlin', 'Jetpack Compose'],
    order: 6
  },
  {
    title: 'Note App (KMM)',
    category: 'mobile',
    summary: 'A cross-platform notes app built with Kotlin Multiplatform Mobile and Clean Architecture.',
    descriptionHtml: '<p>A notes application sharing business logic across Android and iOS via Kotlin Multiplatform Mobile (KMM), following Clean Architecture principles.</p>',
    thumbnail: '/seed/mobile-note-app-kmm.png',
    tags: ['Kotlin Multiplatform', 'Clean Architecture'],
    order: 7
  },
  {
    title: 'Commercial Ads App',
    category: 'mobile',
    summary: 'An Android app for browsing and managing commercial advertisements.',
    descriptionHtml: '<p>An Android application for listing and managing commercial ads, built with Kotlin.</p>',
    thumbnail: '/seed/mobile-commercial-ads.png',
    tags: ['Kotlin'],
    order: 8
  },
  {
    title: '3D Designs & Animations',
    category: 'blender',
    summary: 'Original 3D designs and motion graphics created and rendered in Blender.',
    descriptionHtml: '<p>A showreel of original 3D models, materials, and animations designed and rendered in Blender.</p>',
    thumbnail: '/seed/blender-chai.png',
    images: ['/seed/blender-chai.png', '/seed/blender-pic3.png'],
    videoUrl: '/seed/blender-showreel.mp4',
    tags: ['Blender', '3D Design'],
    featured: true,
    order: 9
  }
];

const achievements = [
  {
    title: 'Migrated ATCL SACCOS Infrastructure to Contabo VPS',
    category: 'milestone',
    date: 'June 2025',
    summary: 'Migrated organizational servers from shared hosting to a self-managed Contabo VPS within 4 months of joining, improving reliability and control.',
    descriptionHtml:
      '<p>Within my first four months as ICT Officer at ATCL SACCOS, I planned and executed a full migration of the organization\'s hosting from a shared provider to a self-managed Contabo VPS - configuring UFW firewall rules, Cloudflare DNS, and a hardened Linux server setup along the way.</p><p>The result: faster, more reliable hosting fully under our own control, with stronger security posture across the board.</p>',
    downloadable: false,
    commentable: true,
    order: 1
  },
  {
    title: 'Jeshi la Kujenga Taifa (JKT) National Service',
    category: 'certification',
    date: 'June - September 2022',
    summary: 'Completed National Service training at Mgambo JKT 835 Kj - discipline, leadership, and teamwork under pressure.',
    descriptionHtml:
      '<p>Completed a term of National Service (Jeshi la Kujenga Taifa) at Mgambo JKT 835 Kj, an experience that shaped my discipline, leadership, and ability to work under pressure - qualities I carry directly into ICT operations and incident response.</p>',
    downloadable: false,
    commentable: true,
    order: 2
  }
];

export async function seedDatabase({ verbose = false } = {}) {
  const log = (...args) => verbose && console.log(...args);

  if ((await SiteSettings.countDocuments()) === 0) {
    await SiteSettings.create({});
    log('Seeded site settings');
  }

  if ((await Skill.countDocuments()) === 0) {
    await Skill.insertMany(skills);
    log(`Seeded ${skills.length} skills`);
  }

  if ((await Experience.countDocuments()) === 0) {
    await Experience.insertMany(experience);
    log(`Seeded ${experience.length} experience entries`);
  }

  if ((await Education.countDocuments()) === 0) {
    await Education.insertMany(education);
    log(`Seeded ${education.length} education entries`);
  }

  if ((await SocialLink.countDocuments()) === 0) {
    await SocialLink.insertMany(socialLinks);
    log(`Seeded ${socialLinks.length} social links`);
  }

  if ((await LiveApp.countDocuments()) === 0) {
    await LiveApp.insertMany(liveApps);
    log(`Seeded ${liveApps.length} live apps`);
  }

  if ((await QrDesign.countDocuments()) === 0) {
    await QrDesign.insertMany(qrDesigns);
    log(`Seeded ${qrDesigns.length} QR designs`);
  }

  if ((await Project.countDocuments()) === 0) {
    for (const project of projects) {
      await Project.create(project);
    }
    log(`Seeded ${projects.length} projects`);
  }

  if ((await Achievement.countDocuments()) === 0) {
    for (const achievement of achievements) {
      await Achievement.create(achievement);
    }
    log(`Seeded ${achievements.length} achievements`);
  }

  const adminEmail = (process.env.ADMIN_EMAIL || 'denisjovitusbuberwa@gmail.com').toLowerCase();
  if (!(await User.findOne({ email: adminEmail }))) {
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
    await User.create({
      name: process.env.ADMIN_NAME || 'Denis Jovitus Buberwa',
      email: adminEmail,
      password,
      status: 'active',
      emailVerified: true
    });
    if (!process.env.ADMIN_PASSWORD) {
      console.warn(
        '\nNo ADMIN_PASSWORD set - created admin ' + adminEmail + ' with default password "ChangeMe123!".\n' +
          '   Log in and change it immediately, or set ADMIN_PASSWORD in server/.env before seeding.\n'
      );
    } else {
      log(`Seeded admin user ${adminEmail}`);
    }
  }
}

// Allow running as a standalone script: `npm run seed`
if (import.meta.url === `file://${process.argv[1]}`) {
  connectDB()
    .then(() => seedDatabase({ verbose: true }))
    .then(() => {
      console.log('Seeding complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}
