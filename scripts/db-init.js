import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const figImgs = [
  '/images/products/custom-human-figurine/1.png', '/images/products/custom-human-figurine/2.png',
  '/images/products/custom-human-figurine/3.png', '/images/products/custom-human-figurine/4.png',
  '/images/products/custom-human-figurine/1.png', '/images/products/custom-human-figurine/2.png',
  '/images/products/custom-human-figurine/3.png', '/images/products/custom-human-figurine/4.png',
  '/images/products/custom-human-figurine/1.png', '/images/products/custom-human-figurine/2.png',
];
const keyImgs = [
  '/images/products/keychain/1.png', '/images/products/keychain/2.png',
  '/images/products/keychain/3.png', '/images/products/keychain/4.png',
  '/images/products/keychain/1.png', '/images/products/keychain/2.png',
  '/images/products/keychain/3.png', '/images/products/keychain/4.png',
  '/images/products/keychain/1.png', '/images/products/keychain/2.png',
];
const nmpImgs = [
  '/images/products/nameplate/1.jpeg', '/images/products/custom-human-figurine/1.png',
  '/images/products/custom-human-figurine/2.png', '/images/products/custom-human-figurine/3.png',
  '/images/products/nameplate/1.jpeg', '/images/products/custom-human-figurine/4.png',
  '/images/products/custom-human-figurine/1.png', '/images/products/custom-human-figurine/2.png',
  '/images/products/nameplate/1.jpeg', '/images/products/custom-human-figurine/3.png',
];
const mixImgs = [
  '/images/products/custom-human-figurine/1.png', '/images/products/keychain/1.png',
  '/images/products/custom-human-figurine/2.png', '/images/products/keychain/2.png',
  '/images/products/custom-human-figurine/3.png', '/images/products/keychain/3.png',
  '/images/products/custom-human-figurine/4.png', '/images/products/keychain/4.png',
  '/images/products/custom-human-figurine/1.png', '/images/products/keychain/1.png',
];

const CARE_FIGURINE = [
  'Keep away from direct sunlight to preserve the finish. Dust gently with a soft dry cloth. Do not expose to moisture or extreme heat.',
  'Your figurine is a precious object — treat it as one. Store on a flat, stable surface.',
];
const CARE_KEYCHAIN = [
  'Keep away from direct sunlight to preserve the finish. Dust gently with a soft dry cloth. Do not expose to moisture or extreme heat.',
];
const CARE_NAMEPLATE = ['Keep away from direct sunlight to prevent fading. Wipe with a soft, damp cloth.'];
const CARE_LAMP = ['Avoid direct sunlight. Dust gently with a soft cloth. Do not expose to water or extreme heat. LED warranty covers defects for 1 year.'];
const CARE_STONE = ['Stone and bronze are durable. Keep away from direct sunlight to preserve color. Dust gently with a soft cloth. Store safely.'];

const DELIVER_STEP = { title: 'Deliver:', description: 'Your piece arrives gift-ready, wrapped with care. Ringroad delivery free of charge.' };
const PRICE_NOTE_FULL = '100% prepayment required · Includes gift-ready packaging · Free delivery within Kathmandu';
const PRICE_NOTE_PARTIAL = '25% prepayment required · Includes gift-ready packaging · Free delivery within Kathmandu';

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.NUXT_DB_HOST || '127.0.0.1',
    port: Number(process.env.NUXT_DB_PORT || '3306'),
    user: process.env.NUXT_DB_USER || 'root',
    password: process.env.NUXT_DB_PASSWORD || '',
  });

  console.log('Connected to MySQL server.');

  await connection.query('CREATE DATABASE IF NOT EXISTS hamro3d;');
  console.log('Database "hamro3d" ensured.');
  await connection.query('USE hamro3d;');
  // Allow id=0 to be stored as literal zero, not treated as AUTO_INCREMENT
  await connection.query("SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';");

  console.log('Cleaning up existing tables...');
  await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
  await connection.query('DROP TABLE IF EXISTS products;');
  await connection.query('DROP TABLE IF EXISTS categories;');
  await connection.query('DROP TABLE IF EXISTS orders;');
  await connection.query('DROP TABLE IF EXISTS users;');
  await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

  console.log('Creating "users" table...');
  await connection.query(`
    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      role VARCHAR(20) NOT NULL DEFAULT 'customer',
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NULL,
      address TEXT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  console.log('Creating "categories" table...');
  await connection.query(`
    CREATE TABLE categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) NOT NULL UNIQUE,
      description TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('Creating "products" table...');
  await connection.query(`
    CREATE TABLE products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      \`rank\` INT DEFAULT 10,
      head VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      subtitle VARCHAR(255) NULL,
      descriptions JSON NOT NULL,
      processes JSON NOT NULL,
      care JSON NOT NULL,
      price INT NOT NULL,
      price_note VARCHAR(255) NULL,
      images JSON NOT NULL,
      gif VARCHAR(255) NULL,
      material JSON NOT NULL,
      size JSON NOT NULL,
      tags JSON NULL,
      is_signature_piece TINYINT(1) NOT NULL DEFAULT 0,
      status VARCHAR(20) NOT NULL DEFAULT 'Active',
      stock INT DEFAULT 0,
      related_product_ids JSON NULL,
      category_id INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );
  `);

  console.log('Creating "orders" table...');
  await connection.query(`
    CREATE TABLE orders (
      id VARCHAR(50) PRIMARY KEY,
      customer_name VARCHAR(100) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(20) NOT NULL,
      delivery_address TEXT NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'Awaiting review',
      payment_method VARCHAR(50) NOT NULL,
      subtotal INT NOT NULL,
      shipping INT DEFAULT 0,
      total INT NOT NULL,
      \`lines\` JSON NOT NULL,
      timeline JSON NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  // ─── Seed categories ────────────────────────────────────────────────────────
  console.log('Seeding categories...');
  const categoriesData = [
    { name: 'Personalized Piece',    slug: 'personalized-piece',   description: 'Gifts and figurines made for the people you cannot forget.' },
    { name: 'Crafted Identity',      slug: 'crafted-identity',     description: 'Nameplates and icons carrying meaningful statements.' },
    { name: 'Memory You Can Touch',  slug: 'memory-you-can-touch', description: 'Small everyday keepsakes and pocket memories.' },
    { name: 'Piece By Piece',        slug: 'piece-by-piece',       description: 'Puzzles and interactive builds crafted in physical form.' },
    { name: 'Time In Physical Form', slug: 'time-in-physical-form', description: 'Sculptures representing milestones and quiet memories.' },
    { name: 'Lit Memories',          slug: 'lamps',                description: 'Portraits and memories illuminated in soft, ambient light.' },
    { name: 'At Home',               slug: 'home-decor',           description: 'Sculptures and reliefs that belong in the spaces you love.' },
    { name: 'For Every Occasion',    slug: 'festival-gifts',       description: 'Pieces crafted for Dashain, Tihar, weddings, and every moment that matters.' },
    { name: 'Worn With Meaning',     slug: 'wearables',            description: 'Miniature keepsakes designed to be carried on your person.' },
    { name: 'Fully Bespoke',         slug: 'bespoke',              description: 'Commissions that do not fit any category — made entirely around your idea.' },
  ];

  const catSlugToId = {};
  for (const c of categoriesData) {
    const [result] = await connection.query(
      'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
      [c.name, c.slug, c.description]
    );
    catSlugToId[c.slug] = result.insertId;
  }

  // ─── Seed products ──────────────────────────────────────────────────────────
  console.log('Seeding products...');

  // Category slug mapping from mock category names
  const mockCatToSlug = {
    'Figurines':      'personalized-piece',
    'Keychains':      'memory-you-can-touch',
    'Nameplates':     'crafted-identity',
    'Lamps':          'lamps',
    'Sculptures':     'time-in-physical-form',
    'Puzzles':        'piece-by-piece',
    'Home Decor':     'home-decor',
    'Festival Gifts': 'festival-gifts',
    'Wearables':      'wearables',
    'Bespoke':        'bespoke',
  };

  const productsData = [
    // ─── Figurines ─────────────────────────────────────────────────────────────
    {
      id: 0, rank: 2, isSignaturePiece: true,
      head: 'FOR YOUR LOVE · PERSONALIZED PIECE',
      title: 'Custom Human Figurine',
      subtitle: 'A moment made permanent.',
      descriptions: [
        'A figurine is not a product. It is a moment made permanent — a person you love, rendered in physical form so they are never truly out of reach.',
        'Send us one clear photograph. Our artisans study your image, understand the person, and craft a piece that holds the feeling of them — not just their likeness.',
        'Every figurine is hand-finished and painted. No two are identical. Each arrives in our signature gift packaging with a handwritten commission card.',
      ],
      processes: [
        { title: 'Commission:', description: 'Place your order and share your reference photograph and any details about the person.' },
        { title: 'Craft:', description: 'Our team prints, refines, and hand-finishes your figurine over 2–3 weeks.' },
        DELIVER_STEP,
      ],
      care: CARE_FIGURINE,
      price: 1950, priceNote: PRICE_NOTE_PARTIAL,
      gif: '/gif/1.gif', images: figImgs,
      material: ['PLA'], size: { unit: 'cm', value: [10, 15, 17] },
      relatedProductIds: [8, 20, 3, 14],
      category: 'Figurines', status: 'Active', stock: 12,
      tags: ['figurine', 'custom', 'personalized', 'gift', 'portrait', 'keepsake', 'anniversary', 'birthday'],
    },
    {
      id: 20, rank: 5, isSignaturePiece: true,
      head: 'TOGETHER · COUPLE KEEPSAKE',
      title: 'Couple Figurine Set',
      subtitle: 'Two people. One piece.',
      descriptions: [
        'Two people who chose each other, made tangible. A couple figurine is not a gift — it is a declaration, held in your hands.',
        'Send us photos of both people. Our artisans craft each figure individually, then pose them together in a way that reflects your relationship.',
        'Delivered as a matched set, gift-boxed with a handwritten card. A piece for your shelf, your desk, your bedside table.',
      ],
      processes: [
        { title: 'Commission:', description: 'Share clear photographs of both people and any posing preferences.' },
        { title: 'Craft:', description: 'Each figure is printed and hand-finished separately before being posed together. Allow 3–4 weeks.' },
        DELIVER_STEP,
      ],
      care: CARE_FIGURINE,
      price: 3500, priceNote: PRICE_NOTE_PARTIAL,
      gif: '/gif/1.gif', images: figImgs,
      material: ['PLA'], size: { unit: 'cm', value: [12, 8, 18] },
      relatedProductIds: [0, 8, 21, 3],
      category: 'Figurines', status: 'Active', stock: 15,
      tags: ['figurine', 'couple', 'wedding', 'anniversary', 'love', 'personalized', 'gift'],
    },
    {
      id: 21, rank: 8,
      head: 'FAMILY FOREVER · CHERISHED MEMORY',
      title: 'Family Figurine Set',
      subtitle: 'Everyone you love, in one piece.',
      descriptions: [
        'A family is not just people — it is every ordinary Tuesday, every shared meal, every quiet moment. We hold all of that in a single sculpture.',
        'From 3 to 6 family members, each figure crafted from photographs and posed together naturally. Children, parents, grandparents — all welcome.',
        'Arrives as a unified composition on a single base, gift-boxed with a card listing every name.',
      ],
      processes: [
        { title: 'Commission:', description: 'Share individual photos of each family member. Let us know the ages and any special details.' },
        { title: 'Design Review:', description: 'We share a 3D composition preview for approval before production begins.' },
        { title: 'Craft:', description: 'Printed and hand-finished over 4–5 weeks. No shortcuts.' },
        DELIVER_STEP,
      ],
      care: CARE_FIGURINE,
      price: 5500, priceNote: PRICE_NOTE_PARTIAL,
      images: figImgs,
      material: ['PLA'], size: { unit: 'cm', value: [20, 10, 18] },
      relatedProductIds: [0, 20, 8, 22],
      category: 'Figurines', status: 'Active', stock: 10,
      tags: ['figurine', 'family', 'group', 'personalized', 'gift', 'keepsake', 'Dashain'],
    },
    {
      id: 22, rank: 14,
      head: 'FOR YOUR PET · BELOVED COMPANION',
      title: 'Pet Figurine',
      subtitle: 'The one who never needs words.',
      descriptions: [
        'A pet is a daily presence — underfoot, curled in the corner, waiting at the door. We preserve that presence in a piece that lasts.',
        'Send us a clear photograph of your pet. Our artisans capture the posture, the fur, the particular way they hold themselves.',
        'Each pet figurine is hand-painted to match your animal\'s markings. It arrives in a velvet-lined box.',
      ],
      processes: [
        { title: 'Commission:', description: 'Share 2–3 photos of your pet from different angles. Note any distinctive markings.' },
        { title: 'Craft:', description: 'Printed and hand-painted over 2–3 weeks.' },
        DELIVER_STEP,
      ],
      care: CARE_FIGURINE,
      price: 1750, priceNote: PRICE_NOTE_PARTIAL,
      images: figImgs,
      material: ['PLA'], size: { unit: 'cm', value: [8, 10, 12] },
      relatedProductIds: [0, 20, 14, 3],
      category: 'Figurines', status: 'Active', stock: 18,
      tags: ['figurine', 'pet', 'cat', 'dog', 'animal', 'personalized', 'gift'],
    },
    {
      id: 39, rank: 28,
      head: 'FOR YOUR FAITH · DEVOTIONAL PIECE',
      title: 'Devotional Figurine',
      subtitle: 'A quiet presence on your altar.',
      descriptions: [
        'Some pieces are made for a specific place — the puja room, the family altar, the space where you begin your day with intention.',
        'We craft devotional figurines of deities, spiritual symbols, and revered figures, treated with the respect they are owed.',
        'Every devotional piece is handled with care from commission to delivery. Each arrives wrapped in cloth, never carelessly packaged.',
      ],
      processes: [
        { title: 'Commission:', description: 'Tell us the deity or figure and any specific iconographic preferences.' },
        { title: 'Review:', description: 'We share a reference for your approval before production.' },
        { title: 'Craft:', description: 'Produced with care over 3–4 weeks.' },
        DELIVER_STEP,
      ],
      care: CARE_FIGURINE,
      price: 2500, priceNote: PRICE_NOTE_PARTIAL,
      images: figImgs,
      material: ['PLA', 'Resin'], size: { unit: 'cm', value: [10, 8, 20] },
      relatedProductIds: [0, 8, 27, 20],
      category: 'Figurines', status: 'Active', stock: 14,
      tags: ['devotional', 'deity', 'spiritual', 'puja', 'altar', 'Nepal', 'faith', 'figurine'],
    },
    {
      id: 40, rank: 29,
      head: 'CHILDREN · PLAY WITH MEANING',
      title: 'Custom Storybook Figurine',
      subtitle: 'Their favourite character, real.',
      descriptions: [
        'Every child has a character they would give anything to hold in their hands. We make that real.',
        'Send us the character — from a book, a drawing, a story they invented — and we render it in durable PLA, safe and built to last.',
        'A gift that outlives the childhood phase it came from.',
      ],
      processes: [
        { title: 'Share the Character:', description: 'A drawing, screenshot, or description of who they love.' },
        { title: 'Design:', description: 'We model and share a preview for your approval.' },
        { title: 'Craft:', description: 'Printed and finished over 1–2 weeks.' },
        DELIVER_STEP,
      ],
      care: ['Safe for ages 5+. Keep away from moisture. Wipe with a soft dry cloth. Store on a flat surface.'],
      price: 1600, priceNote: PRICE_NOTE_FULL,
      images: figImgs,
      material: ['PLA'], size: { unit: 'cm', value: [8, 6, 14] },
      relatedProductIds: [0, 22, 5, 28],
      category: 'Figurines', status: 'Active', stock: 20,
      tags: ['children', 'storybook', 'character', 'figurine', 'gift', 'kids', 'custom', 'imagination'],
    },
    {
      id: 41, rank: 30,
      head: 'SPORTS · ACHIEVEMENT MARKED',
      title: 'Sports Trophy Figurine',
      subtitle: 'The win they will never stop talking about.',
      descriptions: [
        'Trophies are generic. A figurine of the person who won — in the moment they won — is something else entirely.',
        'We craft custom sports figurines from photographs: a cricketer mid-swing, a footballer at the peak of a jump, a runner crossing the finish line.',
      ],
      processes: [
        { title: 'Share the Moment:', description: 'A photo of the athlete in their sport. The more dynamic the pose, the better.' },
        { title: 'Craft:', description: 'Printed and finished over 2–3 weeks.' },
        DELIVER_STEP,
      ],
      care: CARE_FIGURINE,
      price: 2100, priceNote: PRICE_NOTE_FULL,
      images: figImgs,
      material: ['PLA'], size: { unit: 'cm', value: [10, 8, 20] },
      relatedProductIds: [0, 37, 8, 36],
      category: 'Figurines', status: 'Active', stock: 12,
      tags: ['sports', 'trophy', 'figurine', 'athlete', 'cricket', 'football', 'achievement', 'gift'],
    },
    // ─── Keychains ─────────────────────────────────────────────────────────────
    {
      id: 14, rank: 4,
      head: 'IN YOUR POCKET · MEMORY YOU CAN TOUCH',
      title: 'Keychain Figurine',
      subtitle: 'A small piece you carry everywhere.',
      descriptions: [
        'A keychain is the last thing you touch before you leave, and the first thing you touch when you return. Make it meaningful.',
        'We 3D print and hand-finish a custom charm from a photo, a sketch, or a memory. Small enough to carry. Significant enough to matter.',
        'Each keychain is made with durable PLA and attached to a quality metal ring. It arrives in a small velvet pouch, ready to become part of your daily ritual.',
      ],
      processes: [
        { title: 'Share Your Idea:', description: 'Send us a photo, sketch, or description of what matters to you.' },
        { title: 'Design:', description: 'We create a 3D model and send it for your approval.' },
        { title: 'Print & Finish:', description: 'We print, sand, paint, and finish your keychain over 1 week.' },
        DELIVER_STEP,
      ],
      care: CARE_KEYCHAIN,
      price: 1200, priceNote: PRICE_NOTE_PARTIAL,
      gif: '/gif/1.gif', images: keyImgs,
      material: ['PLA'], size: { unit: 'cm', value: [4, 3, 1] },
      relatedProductIds: [4, 0, 3, 22],
      category: 'Keychains', status: 'Active', stock: 42,
      tags: ['keychain', 'custom', 'personalized', 'pocket', 'gift', 'daily', 'charm'],
    },
    {
      id: 4, rank: 12,
      head: 'IN YOUR POCKET · MEMORY YOU CAN TOUCH',
      title: 'Memory Keychain',
      subtitle: 'A small piece you carry everywhere.',
      descriptions: [
        'A keychain is the last thing you touch before you leave, and the first thing you touch when you return. Make it meaningful.',
        'We 3D print and hand-finish a custom charm from a photo, a sketch, or a memory. Small enough to carry. Significant enough to matter.',
        'Each keychain is made with durable PLA and attached to a quality metal ring. It arrives in a small velvet pouch, ready to become part of your daily ritual.',
      ],
      processes: [
        { title: 'Share Your Idea:', description: 'Send us a photo, sketch, or description of what matters to you.' },
        { title: 'Design:', description: 'We create a 3D model and send it for your approval.' },
        { title: 'Print & Finish:', description: 'We print, sand, paint, and finish your keychain over 1 week.' },
        DELIVER_STEP,
      ],
      care: CARE_KEYCHAIN,
      price: 350, priceNote: PRICE_NOTE_FULL,
      gif: '/gif/1.gif', images: keyImgs,
      material: ['PLA'], size: { unit: 'cm', value: [4, 3, 1] },
      relatedProductIds: [14, 0, 3, 22],
      category: 'Keychains', status: 'Active', stock: 35,
      tags: ['keychain', 'custom', 'pocket', 'gift', 'affordable', 'charm', 'everyday'],
    },
    {
      id: 23, rank: 18,
      head: 'FOR EVERY OCCASION · GIFTING ESSENTIAL',
      title: 'Couple Keychain Set',
      subtitle: 'Two charms. One bond.',
      descriptions: [
        'A pair of keychains — each carrying the other\'s miniature. A quiet promise you carry every day.',
        'We craft matched sets based on couple photos. Each charm is unique, painted to match, and packed together in a single gift box.',
      ],
      processes: [
        { title: 'Share Photos:', description: 'Send us a photo of each person.' },
        { title: 'Craft:', description: 'Both charms printed and finished together over 1–2 weeks.' },
        DELIVER_STEP,
      ],
      care: CARE_KEYCHAIN,
      price: 800, priceNote: PRICE_NOTE_FULL,
      images: keyImgs,
      material: ['PLA'], size: { unit: 'cm', value: [4, 3, 1] },
      relatedProductIds: [14, 4, 20, 3],
      category: 'Keychains', status: 'Active', stock: 25,
      tags: ['keychain', 'couple', 'love', 'pair', 'gift', 'anniversary', 'Valentine'],
    },
    // ─── Nameplates ────────────────────────────────────────────────────────────
    {
      id: 3, rank: 3,
      head: 'NAMEPLATE MEANING · CRAFTED IDENTITY',
      title: 'Custom Nameplate',
      subtitle: 'A name, made permanent.',
      descriptions: [
        'A nameplate is more than decoration. It is an acknowledgment — of a person, a place, a moment. We craft custom nameplates in materials that last.',
        'Tell us the name, the style, the space it will occupy. We design it to feel intentional, not mass-made.',
        'Every nameplate is hand-finished and inspected. It arrives ready to mount, with care instructions and a note about why it matters.',
      ],
      processes: [
        { title: 'Design Choice:', description: 'Select font and layout from our options or request a custom design.' },
        { title: 'Preview:', description: 'We send a digital mockup for your approval before production.' },
        { title: 'Craft:', description: 'Printed and finished over 1–2 weeks. Each piece is unique.' },
        DELIVER_STEP,
      ],
      care: CARE_NAMEPLATE,
      price: 1500, priceNote: PRICE_NOTE_FULL,
      gif: '/gif/1.gif', images: nmpImgs,
      material: ['PLA'], size: { unit: 'cm', value: [30, 10, 2] },
      relatedProductIds: [24, 0, 14, 8],
      category: 'Nameplates', status: 'Active', stock: 18,
      tags: ['nameplate', 'custom', 'Devanagari', 'Nepali', 'wall', 'home', 'identity', 'personalized'],
    },
    {
      id: 24, rank: 10,
      head: 'YOUR HOME · YOUR NAME',
      title: 'Door Nameplate',
      subtitle: 'The first thing people see.',
      descriptions: [
        'A door nameplate is not just identification. It is a welcome — a statement that this space belongs to someone who cares.',
        'Available in Nepali script (Devanagari), English, or both. Choose your finish — matte, satin, or brushed.',
        'Weather-resistant material suitable for outdoor mounting. Arrives with fixtures and installation guide.',
      ],
      processes: [
        { title: 'Choose Script & Style:', description: 'Provide the name(s) in your preferred script and select a finish.' },
        { title: 'Preview:', description: 'Digital mockup sent for approval within 2 business days.' },
        { title: 'Craft:', description: 'Produced over 1 week.' },
        DELIVER_STEP,
      ],
      care: CARE_NAMEPLATE,
      price: 1800, priceNote: PRICE_NOTE_FULL,
      images: nmpImgs,
      material: ['PLA', 'Weather-resistant coating'], size: { unit: 'cm', value: [35, 12, 3] },
      relatedProductIds: [3, 25, 0, 14],
      category: 'Nameplates', status: 'Active', stock: 22,
      tags: ['nameplate', 'door', 'outdoor', 'home', 'Nepali', 'Devanagari', 'weather-resistant'],
    },
    {
      id: 25, rank: 19,
      head: 'DESK IDENTITY · PROFESSIONAL PIECE',
      title: 'Office Desk Nameplate',
      subtitle: 'Your name, on your terms.',
      descriptions: [
        'A desk nameplate says: I am here. I do this work. It matters. We make them worthy of the person behind the desk.',
        'Choose from horizontal stand or angled display formats. Add a title beneath the name for added gravitas.',
      ],
      processes: [
        { title: 'Provide Details:', description: 'Share the name, title, and preferred layout.' },
        { title: 'Craft:', description: 'Produced and finished over 5–7 days.' },
        DELIVER_STEP,
      ],
      care: CARE_NAMEPLATE,
      price: 1200, priceNote: PRICE_NOTE_FULL,
      images: nmpImgs,
      material: ['PLA'], size: { unit: 'cm', value: [25, 8, 5] },
      relatedProductIds: [3, 24, 0, 14],
      category: 'Nameplates', status: 'Active', stock: 30,
      tags: ['nameplate', 'desk', 'office', 'professional', 'corporate', 'gift'],
    },
    // ─── Lamps ─────────────────────────────────────────────────────────────────
    {
      id: 1, rank: 11, isSignaturePiece: true,
      head: 'LET THEM GLOW · AMBIENT MEMORY',
      title: 'Portrait Litholamp',
      subtitle: 'A face in soft light.',
      descriptions: [
        'A litholamp transforms a photograph into a glowing portrait. Place it on a shelf, a desk, a bedside table. Each time the light is on, they are present.',
        'We etch your photograph into translucent lithophane material. When lit from behind, the portrait emerges in warm, diffused light — intimate, never harsh.',
        'Each litholamp is individually made. Arrives with an LED base, USB cable, and gift packaging.',
      ],
      processes: [
        { title: 'Submit Image:', description: 'Share a clear, well-lit portrait photograph.' },
        { title: 'Design Approval:', description: 'We show you a preview of how the etching will appear when lit.' },
        { title: 'Craft:', description: 'Lithophane etching takes 1–2 weeks.' },
        DELIVER_STEP,
      ],
      care: CARE_LAMP,
      price: 4200, priceNote: PRICE_NOTE_FULL,
      images: mixImgs,
      material: ['PLA', 'LED base'], size: { unit: 'cm', value: [12, 12, 15] },
      relatedProductIds: [2, 26, 8, 0],
      category: 'Lamps', status: 'Active', stock: 16,
      tags: ['lamp', 'litholamp', 'portrait', 'light', 'photo', 'glow', 'ambient', 'gift'],
    },
    {
      id: 2, rank: 13,
      head: 'UNDER THE STARS · MOONLIGHT MEMORY',
      title: 'Moon Lamp',
      subtitle: 'Your moment, illuminated.',
      descriptions: [
        'A moon lamp is not a light. It is a fragment of a memory, suspended and glowing. Customize it with a date — the night everything changed.',
        'We 3D print a detailed moon replica based on the exact lunar phase for your chosen date. Soft LED lighting gives it the feel of holding a piece of the sky.',
        'Each moon lamp is hand-finished and tested. Arrives with LED base, power adapter, and a card noting your chosen date.',
      ],
      processes: [
        { title: 'Choose Your Moment:', description: 'Tell us the date and we\'ll match the exact moon phase.' },
        { title: 'Personalize:', description: 'Add a name, date, or short message engraved on the base.' },
        { title: 'Print & Finish:', description: 'Printed and hand-finished over 2–3 weeks.' },
        DELIVER_STEP,
      ],
      care: CARE_LAMP,
      price: 3800, priceNote: PRICE_NOTE_FULL,
      images: mixImgs,
      material: ['PLA', 'LED base'], size: { unit: 'cm', value: [15, 15, 18] },
      relatedProductIds: [1, 26, 8, 0],
      category: 'Lamps', status: 'Active', stock: 20,
      tags: ['lamp', 'moon', 'lunar', 'night', 'date', 'anniversary', 'romantic', 'gift'],
    },
    {
      id: 26, rank: 20,
      head: 'WARM GLOW · AMBIENT PRESENCE',
      title: 'Name Night Light',
      subtitle: 'Their name in light.',
      descriptions: [
        'A child\'s name, softly lit. A bedside comfort that says: you are known, you are loved.',
        'We craft custom name lamps in Nepali or English script. Each letter is individually made and assembled into a warm-glowing display.',
        'Available in warm white or colour-changing modes. Arrives gift-boxed with USB power cable.',
      ],
      processes: [
        { title: 'Provide the Name:', description: 'Share the name and preferred script.' },
        { title: 'Craft:', description: 'Produced over 1–2 weeks.' },
        DELIVER_STEP,
      ],
      care: CARE_LAMP,
      price: 2800, priceNote: PRICE_NOTE_FULL,
      images: mixImgs,
      material: ['PLA', 'LED strip'], size: { unit: 'cm', value: [40, 8, 10] },
      relatedProductIds: [1, 2, 3, 24],
      category: 'Lamps', status: 'Active', stock: 18,
      tags: ['lamp', 'name', 'night light', 'Nepali', 'children', 'bedroom', 'gift', 'glow'],
    },
    // ─── Sculptures ────────────────────────────────────────────────────────────
    {
      id: 8, rank: 1, isSignaturePiece: true,
      head: 'MILESTONE MARKED · TIME IN PHYSICAL FORM',
      title: 'Anniversary Sculpture',
      subtitle: 'Years together, made tangible.',
      descriptions: [
        'An anniversary is a moment to acknowledge: we chose each other again, and again. We turn that choice into a sculpture.',
        'We design a custom piece that represents your years together — intertwined lines, stacked years, or a moment from your story, rendered in PLA or resin.',
        'Each sculpture is hand-finished. Arrives with a certificate explaining its meaning and space to add your names.',
      ],
      processes: [
        { title: 'Share Your Story:', description: 'Tell us how many years, what matters most, any symbols that resonate.' },
        { title: 'Design:', description: 'We sketch 2–3 design options for your approval.' },
        { title: 'Craft:', description: 'Casting and hand-finishing takes 3–5 weeks.' },
        DELIVER_STEP,
      ],
      care: CARE_STONE,
      price: 15000, priceNote: PRICE_NOTE_FULL,
      gif: '/gif/1.gif', images: figImgs,
      material: ['PLA', 'Resin'], size: { unit: 'cm', value: [15, 10, 20] },
      relatedProductIds: [0, 20, 3, 27],
      category: 'Sculptures', status: 'Active', stock: 6,
      tags: ['sculpture', 'anniversary', 'milestone', 'couple', 'love', 'premium', 'bespoke'],
    },
    {
      id: 27, rank: 15,
      head: 'IN REMEMBRANCE · A LASTING TRIBUTE',
      title: 'Memorial Piece',
      subtitle: 'So they are never truly gone.',
      descriptions: [
        'Grief asks: where do I put this? We answer with an object — a piece that holds the memory of someone who mattered, somewhere you can see it.',
        'We create memorial pieces from photographs — figurines, portrait lamps, or sculptural tributes. You choose the form. We bring them back.',
        'Each memorial piece is handled with the utmost care. Delivered personally within Kathmandu, never left at a doorstep.',
      ],
      processes: [
        { title: 'Tell Us About Them:', description: 'Share photographs and a few words about who they were.' },
        { title: 'Choose the Form:', description: 'Figurine, litholamp, or sculptural tribute — we advise based on your story.' },
        { title: 'Craft:', description: '3–5 weeks. Handled with complete care and discretion.' },
        DELIVER_STEP,
      ],
      care: CARE_FIGURINE,
      price: 4500, priceNote: '50% prepayment required · Includes premium gift packaging · Personal delivery within Kathmandu',
      images: figImgs,
      material: ['PLA', 'Resin'], size: { unit: 'cm', value: [12, 8, 18] },
      relatedProductIds: [8, 0, 1, 20],
      category: 'Sculptures', status: 'Active', stock: 8,
      tags: ['memorial', 'remembrance', 'tribute', 'figurine', 'lamp', 'grief', 'healing'],
    },
    // ─── Puzzles ───────────────────────────────────────────────────────────────
    {
      id: 5, rank: 6,
      head: 'PUZZLE OF A MOMENT · PIECE BY PIECE',
      title: '3D Dinosaur Puzzle',
      subtitle: 'Build a memory together.',
      descriptions: [
        'A puzzle is a conversation. Building it together is the gift. We create custom 3D puzzles that turn a quiet afternoon into a memory.',
        'Choose a theme — dinosaurs, animals, landmarks, or a custom design. Each piece is precision-printed so they fit together perfectly.',
        'Each puzzle arrives in a beautiful box with an illustration of the finished piece and a personal note.',
      ],
      processes: [
        { title: 'Choose Theme:', description: 'Pick from our designs or request a custom creation.' },
        { title: 'Customize:', description: 'Tell us who this is for and why it matters. We\'ll include it in the box.' },
        { title: 'Print & Prepare:', description: 'We print each piece, sand smooth, and pack carefully over 1–2 weeks.' },
        DELIVER_STEP,
      ],
      care: ['Store pieces in the provided box. Keep away from moisture and heat. Handle gently during building.'],
      price: 2500, priceNote: PRICE_NOTE_FULL,
      gif: '/gif/1.gif',
      images: [
        '/images/products/custom-human-figurine/3.png', '/images/products/custom-human-figurine/4.png',
        '/images/products/custom-human-figurine/1.png', '/images/products/custom-human-figurine/2.png',
        '/images/products/custom-human-figurine/3.png', '/images/products/custom-human-figurine/4.png',
        '/images/products/custom-human-figurine/1.png', '/images/products/custom-human-figurine/2.png',
        '/images/products/custom-human-figurine/3.png', '/images/products/custom-human-figurine/4.png',
      ],
      material: ['PLA'], size: { unit: 'cm', value: [20, 20, 5] },
      relatedProductIds: [28, 0, 14, 3],
      category: 'Puzzles', status: 'Active', stock: 11,
      tags: ['puzzle', '3D', 'dinosaur', 'children', 'gift', 'educational', 'fun', 'activity'],
    },
    {
      id: 28, rank: 22,
      head: 'PUZZLE OF A MOMENT · PIECE BY PIECE',
      title: 'Custom Photo Puzzle',
      subtitle: 'Your memory, reassembled.',
      descriptions: [
        'Take a photograph that matters and turn it into a puzzle. Assemble it once, frame it, keep it. Or rebuild it every time you need the memory.',
        'We 3D engrave your photograph onto puzzle-cut panels, with each piece cleanly edged and easy to handle.',
      ],
      processes: [
        { title: 'Submit Photo:', description: 'Share a high-resolution image in landscape orientation.' },
        { title: 'Craft:', description: 'Engraved and cut over 1–2 weeks.' },
        DELIVER_STEP,
      ],
      care: ['Store in the provided box. Keep away from moisture. Each piece is durable but handle with care.'],
      price: 1800, priceNote: PRICE_NOTE_FULL,
      images: figImgs,
      material: ['PLA'], size: { unit: 'cm', value: [20, 15, 1] },
      relatedProductIds: [5, 0, 14, 3],
      category: 'Puzzles', status: 'Active', stock: 16,
      tags: ['puzzle', 'photo', 'custom', 'memory', 'gift', 'personalised', 'activity'],
    },
    // ─── Home Decor ────────────────────────────────────────────────────────────
    {
      id: 29, rank: 9,
      head: 'ON YOUR DESK · DAILY REMINDER',
      title: 'Custom Desk Sculpture',
      subtitle: 'Art that earns its place.',
      descriptions: [
        'A desk sculpture is the one object on your workspace that is entirely yours. Not functional. Not decorative. Meaningful.',
        'We work with you to design a form that represents something personal — a value, a memory, a person, a milestone.',
        'Compact enough for any desk. Significant enough to notice every morning.',
      ],
      processes: [
        { title: 'Describe Your Meaning:', description: 'Tell us what you want to hold in the piece.' },
        { title: 'Design:', description: 'We propose 2–3 sculptural forms.' },
        { title: 'Craft:', description: 'Produced over 2–3 weeks.' },
        DELIVER_STEP,
      ],
      care: CARE_STONE,
      price: 3200, priceNote: PRICE_NOTE_PARTIAL,
      images: mixImgs,
      material: ['PLA', 'Resin'], size: { unit: 'cm', value: [10, 10, 15] },
      relatedProductIds: [8, 3, 25, 0],
      category: 'Home Decor', status: 'Active', stock: 12,
      tags: ['desk', 'sculpture', 'office', 'art', 'meaningful', 'bespoke', 'home'],
    },
    {
      id: 30, rank: 23,
      head: 'WALL ART · MEMORY ON DISPLAY',
      title: 'Custom Wall Relief',
      subtitle: 'Memories worth hanging.',
      descriptions: [
        'A wall relief is a photograph made three-dimensional. It has depth, shadow, presence. It changes with the light in the room.',
        'We take your chosen image and render it as a hand-finished relief sculpture, ready to hang.',
      ],
      processes: [
        { title: 'Submit Image:', description: 'Provide a high-resolution photograph or illustration.' },
        { title: 'Craft:', description: 'Relief modelled and finished over 2–3 weeks.' },
        DELIVER_STEP,
      ],
      care: CARE_STONE,
      price: 5000, priceNote: PRICE_NOTE_FULL,
      images: mixImgs,
      material: ['PLA', 'Resin'], size: { unit: 'cm', value: [30, 30, 3] },
      relatedProductIds: [29, 8, 3, 0],
      category: 'Home Decor', status: 'Active', stock: 8,
      tags: ['wall art', 'relief', '3D', 'photo', 'home', 'interior', 'gift'],
    },
    // ─── Festival Gifts ────────────────────────────────────────────────────────
    {
      id: 31, rank: 7,
      head: 'DASHAIN · TIHAR · FESTIVAL GIFT',
      title: 'Festival Gift Set',
      subtitle: 'Crafted for the occasions that matter most.',
      descriptions: [
        'Dashain. Tihar. Weddings. These are the moments that define us as a family, as a culture. We create gifts worthy of them.',
        'Our festival sets combine a keychain figurine, a custom nameplate, and a handwritten story card — curated for the person you are celebrating.',
        'Every set is gift-boxed and arrives with a personal note from our studio in Kathmandu.',
      ],
      processes: [
        { title: 'Commission:', description: 'Share the occasion and the recipient. We advise on the best combination.' },
        { title: 'Craft:', description: 'Each piece made over 1–2 weeks.' },
        DELIVER_STEP,
      ],
      care: CARE_KEYCHAIN,
      price: 2200, priceNote: PRICE_NOTE_FULL,
      images: mixImgs,
      material: ['PLA'], size: { unit: 'cm', value: [20, 15, 8] },
      relatedProductIds: [14, 3, 0, 20],
      category: 'Festival Gifts', status: 'Active', stock: 20,
      tags: ['festival', 'Dashain', 'Tihar', 'gift set', 'Nepal', 'occasion', 'keychain', 'nameplate'],
    },
    {
      id: 32, rank: 16,
      head: 'WEDDING GIFT · FOREVER TOGETHER',
      title: 'Wedding Keepsake',
      subtitle: 'The beginning of forever.',
      descriptions: [
        'A wedding gift should last as long as the marriage. We create custom keepsakes that grow more meaningful with every year.',
        'Choose from a couple figurine, a custom anniversary-ready nameplate, or a date-personalized moon lamp.',
        'Each wedding piece arrives in premium packaging with a sealed note for the couple.',
      ],
      processes: [
        { title: 'Choose the Form:', description: 'Figurine, nameplate, or lamp — we advise based on your vision.' },
        { title: 'Personalize:', description: 'Names, dates, and a personal message included.' },
        { title: 'Craft:', description: '2–3 weeks depending on the chosen form.' },
        DELIVER_STEP,
      ],
      care: CARE_FIGURINE,
      price: 4000, priceNote: PRICE_NOTE_PARTIAL,
      images: figImgs,
      material: ['PLA'], size: { unit: 'cm', value: [15, 10, 20] },
      relatedProductIds: [20, 8, 3, 1],
      category: 'Festival Gifts', status: 'Active', stock: 14,
      tags: ['wedding', 'couple', 'gift', 'keepsake', 'love', 'anniversary', 'personalized'],
    },
    {
      id: 33, rank: 21,
      head: 'NEW ARRIVAL · BIRTH MEMORY',
      title: 'Baby Footprint Frame',
      subtitle: 'The first mark they ever made.',
      descriptions: [
        'A baby\'s footprint is the smallest map of a person who has just arrived. We preserve it in a form that lasts forever.',
        'We cast the footprint (or handprint) in high-detail resin, then frame it with the date, time, and name — a complete record of arrival.',
      ],
      processes: [
        { title: 'Schedule a Session or Submit a Print:', description: 'We can visit your home within Kathmandu, or you can submit an ink impression.' },
        { title: 'Cast & Frame:', description: 'Cast in resin and framed over 1–2 weeks.' },
        DELIVER_STEP,
      ],
      care: ['Display away from direct sunlight. Wipe with a soft, dry cloth. Resin is durable but avoid dropping.'],
      price: 2500, priceNote: PRICE_NOTE_FULL,
      images: mixImgs,
      material: ['Resin'], size: { unit: 'cm', value: [20, 25, 3] },
      relatedProductIds: [22, 21, 27, 0],
      category: 'Festival Gifts', status: 'Active', stock: 16,
      tags: ['baby', 'newborn', 'footprint', 'birth', 'keepsake', 'memory', 'family', 'gift'],
    },
    {
      id: 37, rank: 26,
      head: 'GRADUATION · NEXT CHAPTER',
      title: 'Graduation Keepsake',
      subtitle: 'The years behind. The life ahead.',
      descriptions: [
        'Graduation is the end of one story and the beginning of another. We mark it with a piece that holds both.',
        'A custom figurine in graduation attire, a nameplate bearing their name and year, or a sculptural reminder of what they worked towards.',
      ],
      processes: [
        { title: 'Commission:', description: 'Share a photo and the graduation details — year, field, any special meaning.' },
        { title: 'Craft:', description: 'Produced over 2–3 weeks.' },
        DELIVER_STEP,
      ],
      care: CARE_FIGURINE,
      price: 2800, priceNote: PRICE_NOTE_FULL,
      images: figImgs,
      material: ['PLA'], size: { unit: 'cm', value: [10, 8, 18] },
      relatedProductIds: [0, 3, 29, 25],
      category: 'Festival Gifts', status: 'Active', stock: 16,
      tags: ['graduation', 'achievement', 'figurine', 'keepsake', 'gift', 'milestone'],
    },
    {
      id: 38, rank: 27,
      head: 'BIRTHDAY · A YEAR REMEMBERED',
      title: 'Birthday Figurine',
      subtitle: 'For the one who deserves to be remembered.',
      descriptions: [
        'A birthday is not just a date. It is evidence that someone has been alive in the world, shaping things, mattering to people.',
        'We craft a custom figurine of the birthday person — from a photograph, in a pose that reflects who they are. A gift they will never forget receiving.',
      ],
      processes: [
        { title: 'Share a Photo:', description: 'Send a clear photograph and a few words about who they are.' },
        { title: 'Craft:', description: 'Printed and finished over 2–3 weeks. Order early for birthdays.' },
        DELIVER_STEP,
      ],
      care: CARE_FIGURINE,
      price: 1950, priceNote: PRICE_NOTE_PARTIAL,
      images: figImgs,
      material: ['PLA'], size: { unit: 'cm', value: [10, 8, 18] },
      relatedProductIds: [0, 14, 31, 20],
      category: 'Festival Gifts', status: 'Active', stock: 20,
      tags: ['birthday', 'figurine', 'gift', 'custom', 'personalized', 'celebration'],
    },
    // ─── Wearables ─────────────────────────────────────────────────────────────
    {
      id: 34, rank: 17,
      head: 'WORN WITH MEANING · WEARABLE MEMORY',
      title: 'Custom Pendant',
      subtitle: 'Carry a moment close.',
      descriptions: [
        'A pendant is the most personal object you can wear. We craft miniature custom pendants — a face, a shape, a symbol — in durable resin with a gold or silver finish.',
        'Small enough to wear every day. Significant enough to notice.',
      ],
      processes: [
        { title: 'Share Your Reference:', description: 'A photo, sketch, or description of what you want to carry.' },
        { title: 'Design:', description: 'We model and share a preview.' },
        { title: 'Craft:', description: 'Printed and finished over 1–2 weeks.' },
        DELIVER_STEP,
      ],
      care: ['Keep away from water and perfume. Store in the provided pouch. Polish gently with a soft cloth.'],
      price: 950, priceNote: PRICE_NOTE_FULL,
      images: keyImgs,
      material: ['Resin', 'Gold/Silver finish'], size: { unit: 'cm', value: [3, 3, 0.5] },
      relatedProductIds: [14, 4, 23, 0],
      category: 'Wearables', status: 'Active', stock: 30,
      tags: ['pendant', 'jewellery', 'wearable', 'custom', 'miniature', 'portrait', 'gift'],
    },
    // ─── Bespoke ───────────────────────────────────────────────────────────────
    {
      id: 35, rank: 24,
      head: 'BESPOKE · FULLY CUSTOM',
      title: 'Bespoke Commission',
      subtitle: 'If you can imagine it, we can make it.',
      descriptions: [
        'Some pieces do not fit any category. A concept no one has made. A memory no standard form can hold. That is when you commission something truly bespoke.',
        'Tell us what you are imagining. We will tell you honestly what is possible. Then we will make it.',
        'Pricing is discussed after understanding the scope. No surprises.',
      ],
      processes: [
        { title: 'Consultation:', description: 'A brief conversation about your vision, timeline, and budget.' },
        { title: 'Proposal:', description: 'We prepare a design proposal and quote within 3 business days.' },
        { title: 'Commission:', description: 'Upon approval, production begins with regular progress updates.' },
        DELIVER_STEP,
      ],
      care: ['Care instructions provided specific to the materials used in your commission.'],
      price: 8000, priceNote: 'Pricing varies by scope · 50% prepayment required · Full consultation included',
      images: figImgs,
      material: ['Varies'], size: { unit: 'cm', value: [0, 0, 0] },
      relatedProductIds: [8, 0, 20, 27],
      category: 'Bespoke', status: 'Active', stock: 5,
      tags: ['bespoke', 'custom', 'commission', 'one-of-a-kind', 'premium', 'unique', 'luxury'],
    },
    {
      id: 36, rank: 25,
      head: 'CORPORATE GIFT · MEANINGFUL RECOGNITION',
      title: 'Corporate Recognition Piece',
      subtitle: 'For the people who built something.',
      descriptions: [
        'Years of service. A project milestone. A farewell. These moments deserve more than a plaque from a catalogue.',
        'We create custom recognition pieces for teams, founders, and long-serving colleagues — each one designed around the specific story of the person being honoured.',
        'Bulk commissions available with consistent branding and individual personalisation for each recipient.',
      ],
      processes: [
        { title: 'Brief Us:', description: 'Share the occasion, the recipient(s), and any brand or design guidelines.' },
        { title: 'Design:', description: 'We propose a cohesive design that scales across recipients.' },
        { title: 'Produce:', description: 'Timeline depends on quantity. Minimum 2 weeks.' },
        DELIVER_STEP,
      ],
      care: CARE_STONE,
      price: 6000, priceNote: 'Per unit pricing · Bulk discounts available · 50% prepayment required',
      images: mixImgs,
      material: ['PLA', 'Resin'], size: { unit: 'cm', value: [15, 10, 20] },
      relatedProductIds: [8, 29, 3, 35],
      category: 'Bespoke', status: 'Active', stock: 5,
      tags: ['corporate', 'recognition', 'award', 'bulk', 'team', 'office', 'premium', 'gift'],
    },
  ];

  for (const p of productsData) {
    const catSlug = mockCatToSlug[p.category] || null;
    const catId = catSlug ? (catSlugToId[catSlug] ?? null) : null;
    await connection.query(
      `INSERT INTO products (id, \`rank\`, head, title, subtitle, descriptions, processes, care, price, price_note, images, gif, material, size, tags, is_signature_piece, status, stock, related_product_ids, category_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.id,
        p.rank,
        p.head,
        p.title,
        p.subtitle,
        JSON.stringify(p.descriptions),
        JSON.stringify(p.processes),
        JSON.stringify(p.care),
        p.price,
        p.priceNote,
        JSON.stringify(p.images),
        p.gif || null,
        JSON.stringify(p.material),
        JSON.stringify(p.size),
        JSON.stringify(p.tags || []),
        p.isSignaturePiece ? 1 : 0,
        p.status,
        p.stock,
        JSON.stringify(p.relatedProductIds),
        catId,
      ]
    );
  }

  // ─── Seed users ─────────────────────────────────────────────────────────────
  console.log('Seeding users...');
  const usersData = [
    { role: 'admin',    name: 'John Cena',     email: 'admin@gmail.com',          password: 'admin',    phone: '9800000000', address: 'Kapan, Kathmandu, Nepal',           status: 'Active' },
    { role: 'customer', name: 'Priya Khadka',  email: 'priya.k@example.com',      password: 'password', phone: '9811111111', address: 'Thamel, Kathmandu, Nepal',           status: 'Active' },
    { role: 'customer', name: 'Sameer Thapa',  email: 'sameer.t@example.com',     password: 'password', phone: '9822222222', address: 'Patan, Lalitpur, Nepal',             status: 'Active' },
    { role: 'customer', name: 'Anita Sharma',  email: 'anita.s@example.com',      password: 'password', phone: '9833333333', address: 'New Baneshwor, Kathmandu, Nepal',    status: 'Active' },
    { role: 'customer', name: 'Rajan Basnet',  email: 'rajan.b@example.com',      password: 'password', phone: '9844444444', address: 'Budhanilkantha, Kathmandu, Nepal',   status: 'Active' },
    { role: 'customer', name: 'Mina Lama',     email: 'mina.l@example.com',       password: 'password', phone: '9855555555', address: 'Jhamsikhel, Lalitpur, Nepal',        status: 'Invited' },
  ];

  for (const u of usersData) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    await connection.query(
      'INSERT INTO users (role, name, email, password, phone, address, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [u.role, u.name, u.email, hashedPassword, u.phone, u.address, u.status]
    );
  }

  // ─── Seed orders ────────────────────────────────────────────────────────────
  console.log('Seeding orders...');
  const ordersData = [
    {
      id: 'H3D-24089',
      customer_name: 'Priya Karki',
      customer_email: 'priya.k@example.com',
      customer_phone: '+977 98XXXXXXXX',
      delivery_address: 'Thamel, Ward 26\nKathmandu 44600\nNepal',
      status: 'In craft',
      payment_method: 'eSewa',
      subtotal: 12700, shipping: 0, total: 12700,
      lines: [
        { name: 'Custom Human Figurine', meta: '15 cm · FDM · Skin-tone resin', qty: 1, unitPrice: 10500, lineTotal: 10500 },
        { name: 'Memory Keychain', meta: 'Resin · Photo embed', qty: 1, unitPrice: 2200, lineTotal: 2200 },
      ],
      timeline: [
        { label: 'Order Placed', date: '6 May 2026', state: 'done' },
        { label: 'Payment Confirmed', date: '6 May 2026', state: 'done' },
        { label: 'Artisan Assigned', date: '7 May 2026', state: 'done' },
        { label: 'Crafting in Progress', date: 'Figurine on the print farm', state: 'active' },
        { label: 'Quality Check', date: 'Pending', state: 'pending' },
        { label: 'Shipped', date: 'Pending', state: 'pending' },
        { label: 'Delivered', date: 'Pending', state: 'pending' },
      ],
    },
    {
      id: 'H3D-24088',
      customer_name: 'Sameer Tamang',
      customer_email: 'sameer.t@example.com',
      customer_phone: '+977 98XXXXXXXX',
      delivery_address: 'Patan Dhoka\nLalitpur 44700\nNepal',
      status: 'Shipped',
      payment_method: 'Cash on Delivery',
      subtotal: 4000, shipping: 200, total: 4200,
      lines: [
        { name: 'Portrait Litholamp', meta: '10 cm · Lithophane · White PLA', qty: 1, unitPrice: 4200, lineTotal: 4200 },
      ],
      timeline: [
        { label: 'Order Placed', date: '5 May 2026', state: 'done' },
        { label: 'Payment Confirmed', date: '5 May 2026', state: 'done' },
        { label: 'Artisan Assigned', date: '5 May 2026', state: 'done' },
        { label: 'Crafting Complete', date: '7 May 2026', state: 'done' },
        { label: 'Quality Check', date: '8 May 2026', state: 'done' },
        { label: 'Shipped', date: 'In transit via Pathao', state: 'active' },
        { label: 'Delivered', date: 'Pending', state: 'pending' },
      ],
    },
    {
      id: 'H3D-24087',
      customer_name: 'Anita Shrestha',
      customer_email: 'anita.s@example.com',
      customer_phone: '+977 98XXXXXXXX',
      delivery_address: 'New Baneshwor\nKathmandu 44600\nNepal',
      status: 'Awaiting review',
      payment_method: 'Khalti',
      subtotal: 17200, shipping: 0, total: 17200,
      lines: [
        { name: 'Anniversary Sculpture', meta: '20 cm · Resin · Hand-painted', qty: 1, unitPrice: 14000, lineTotal: 14000 },
        { name: 'Custom Nameplate', meta: 'Wooden base · Engraved', qty: 1, unitPrice: 3200, lineTotal: 3200 },
      ],
      timeline: [
        { label: 'Order Placed', date: '4 May 2026', state: 'done' },
        { label: 'Awaiting Review', date: 'Reviewing customer photos', state: 'active' },
        { label: 'Artisan Assigned', date: 'Pending', state: 'pending' },
        { label: 'Crafting', date: 'Pending', state: 'pending' },
        { label: 'Quality Check', date: 'Pending', state: 'pending' },
        { label: 'Shipped', date: 'Pending', state: 'pending' },
        { label: 'Delivered', date: 'Pending', state: 'pending' },
      ],
    },
    {
      id: 'H3D-24086',
      customer_name: 'Rajan Basnet',
      customer_email: 'rajan.b@example.com',
      customer_phone: '+977 98XXXXXXXX',
      delivery_address: 'Budhanilkantha-4\nKathmandu 44600\nNepal',
      status: 'In craft',
      payment_method: 'eSewa',
      subtotal: 3600, shipping: 200, total: 3800,
      lines: [
        { name: 'Moon Lamp', meta: '12 cm · Lithophane · Warm LED', qty: 1, unitPrice: 3800, lineTotal: 3800 },
      ],
      timeline: [
        { label: 'Order Placed', date: '3 May 2026', state: 'done' },
        { label: 'Payment Confirmed', date: '3 May 2026', state: 'done' },
        { label: 'Artisan Assigned', date: '4 May 2026', state: 'done' },
        { label: 'Crafting in Progress', date: 'Moon lamp being printed', state: 'active' },
        { label: 'Quality Check', date: 'Pending', state: 'pending' },
        { label: 'Shipped', date: 'Pending', state: 'pending' },
        { label: 'Delivered', date: 'Pending', state: 'pending' },
      ],
    },
    {
      id: 'H3D-24085',
      customer_name: 'Mina Lama',
      customer_email: 'mina.l@example.com',
      customer_phone: '+977 98XXXXXXXX',
      delivery_address: 'Jhamsikhel\nLalitpur 44700\nNepal',
      status: 'Delivered',
      payment_method: 'Cash on Delivery',
      subtotal: 26550, shipping: 0, total: 26550,
      lines: [
        { name: 'Hand Mold Casting', meta: 'Life-size · Alginate · Resin cast', qty: 1, unitPrice: 18000, lineTotal: 18000 },
        { name: '3D Dinosaur Puzzle', meta: 'T-Rex · 35 pieces · PLA', qty: 1, unitPrice: 8550, lineTotal: 8550 },
      ],
      timeline: [
        { label: 'Order Placed', date: '2 May 2026', state: 'done' },
        { label: 'Payment Confirmed', date: '2 May 2026', state: 'done' },
        { label: 'Artisan Assigned', date: '3 May 2026', state: 'done' },
        { label: 'Crafting Complete', date: '6 May 2026', state: 'done' },
        { label: 'Quality Check', date: '7 May 2026', state: 'done' },
        { label: 'Shipped', date: '7 May 2026', state: 'done' },
        { label: 'Delivered', date: '8 May 2026', state: 'done' },
      ],
    },
  ];

  for (const o of ordersData) {
    await connection.query(
      `INSERT INTO orders (id, customer_name, customer_email, customer_phone, delivery_address, status, payment_method, subtotal, shipping, total, \`lines\`, timeline)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [o.id, o.customer_name, o.customer_email, o.customer_phone, o.delivery_address,
       o.status, o.payment_method, o.subtotal, o.shipping, o.total,
       JSON.stringify(o.lines), JSON.stringify(o.timeline)]
    );
  }

  console.log('Database initialization and seeding completed successfully!');
  console.log(`  ✓ ${categoriesData.length} categories`);
  console.log(`  ✓ ${productsData.length} products`);
  console.log(`  ✓ ${usersData.length} users`);
  console.log(`  ✓ ${ordersData.length} orders`);
  await connection.end();
}

main().catch((err) => {
  console.error('Error during database initialization:', err);
  process.exit(1);
});
