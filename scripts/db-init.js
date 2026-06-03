import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.NUXT_DB_HOST || '127.0.0.1',
    port: Number(process.env.NUXT_DB_PORT || '3306'),
    user: process.env.NUXT_DB_USER || 'root',
    password: process.env.NUXT_DB_PASSWORD || '',
  });

  console.log('Connected to MySQL server.');

  // Create database
  await connection.query('CREATE DATABASE IF NOT EXISTS hamro3d;');
  console.log('Database "hamro3d" ensured.');

  await connection.query('USE hamro3d;');

  // Drop tables in order
  console.log('Cleaning up existing tables...');
  await connection.query('DROP TABLE IF EXISTS products;');
  await connection.query('DROP TABLE IF EXISTS categories;');
  await connection.query('DROP TABLE IF EXISTS orders;');
  await connection.query('DROP TABLE IF EXISTS users;');

  // Create users table
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

  // Create categories table
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

  // Create products table
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
      material JSON NOT NULL,
      size JSON NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'Active',
      stock INT DEFAULT 0,
      related_product_ids JSON NULL,
      category_id INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );
  `);

  // Create orders table
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

  // Seed categories
  console.log('Seeding categories...');
  const categoriesData = [
    { name: 'Personalized Piece', slug: 'personalized-piece', description: 'Gifts and figurines made for the people you cannot forget.' },
    { name: 'Crafted Identity', slug: 'crafted-identity', description: 'Nameplates and icons carrying meaningful statements.' },
    { name: 'Memory You Can Touch', slug: 'memory-you-can-touch', description: 'Small everyday keepsakes and pocket memories.' },
    { name: 'Piece By Piece', slug: 'piece-by-piece', description: 'Puzzles and interactive builds crafted in physical form.' },
    { name: 'Time In Physical Form', slug: 'time-in-physical-form', description: 'Sculptures representing milestones and quiet memories.' },
  ];

  const categorySlugToId = {};
  for (const c of categoriesData) {
    const [result] = await connection.query(
      'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
      [c.name, c.slug, c.description]
    );
    categorySlugToId[c.slug] = result.insertId;
  }

  // Seed products
  console.log('Seeding products...');
  const productsData = [
    {
      id: 0,
      rank: 2,
      head: 'FOR YOUR LOVE · PERSONALIZED PIECE',
      title: 'Custom Human Figurine',
      subtitle: 'It is a moment made permanent.',
      descriptions: [
        'A figurine is not a product. It is a moment made permanent — a person you love, rendered in physical form so they are never truly out of reach.',
        'Send us one clear photograph. Our artisans study your image, understand the person, and craft a piece that holds the feeling of them — not just their likeness.',
        'Every figurine is hand-finished and painted. No two are identical. Each arrives in our signature gift packaging with a handwritten commission card.'
      ],
      processes: [
        { title: 'Commission:', description: 'Place your order and share your reference photograph and any details about the person.' },
        { title: 'Craft:', description: 'Our team prints, refines, and hand-finishes your figurine over 2–3 weeks.' },
        { title: 'Deliver:', description: 'Your piece arrives gift-ready, wrapped with care. Ringroad delivery free of charge.' }
      ],
      care: [
        'Keep away from direct sunlight to preserve the finish. Dust gently with a soft dry cloth. Do not expose to moisture or extreme heat.',
        'Your figurine is a precious object — treat it as one. Store on a flat, stable surface.'
      ],
      price: 1950,
      price_note: '25% prepayment required . Includes gift-ready packaging · Free delivery within Kathmandu·',
      images: ['/images/products/custom-human-figurine/1.png'],
      material: ['PLA'],
      size: { unit: 'cm', value: [10, 15, 17] },
      related_product_ids: [8, 0, 3, 14],
      category_slug: 'personalized-piece',
      status: 'Active',
      stock: 12
    },
    {
      id: 3,
      rank: 3,
      head: 'NAMEPLATE MEANING · CRAFTED IDENTITY',
      title: 'Custom Nameplate',
      subtitle: 'A name, made permanent.',
      descriptions: [
        'A nameplate is more than decoration. It is an acknowledgment — of a person, a place, a moment. We craft custom nameplates in materials that last.',
        'Tell us the name, the style, the space it will occupy. We design it to feel intentional, not mass-made.',
        'Every nameplate is hand-finished and inspected. It arrives ready to mount, with care instructions and a note about why it matters.'
      ],
      processes: [
        { title: 'Design Choice:', description: 'Select font, and layout from our options or request custom design.' },
        { title: 'Preview:', description: 'We send a digital mockup for your approval before production.' },
        { title: 'Craft:', description: 'Printed and finished over 1-2 weeks. Each piece is unique.' },
        { title: 'Deliver:', description: 'Your piece arrives gift-ready, wrapped with care. Ringroad delivery free of charge.' }
      ],
      care: [
        'Keep away from direct sunlight to prevent fading. Wipe with a soft, damp cloth.'
      ],
      price: 1500,
      price_note: '100% prepayment required . Includes gift-ready packaging · Free delivery within Kathmandu·',
      images: ['/images/products/custom-human-figurine/1.png'],
      material: ['PLA'],
      size: { unit: 'cm', value: [10, 15, 17] },
      related_product_ids: [8, 0, 3, 14],
      category_slug: 'crafted-identity',
      status: 'Active',
      stock: 18
    },
    {
      id: 14,
      rank: 4,
      head: 'IN YOUR POCKET · MEMORY YOU CAN TOUCH',
      title: 'Keychain Figurine',
      subtitle: 'A small piece you carry everywhere.',
      descriptions: [
        'A keychain is the last thing you touch before you leave, and the first thing you touch when you return. Make it meaningful.',
        'We 3D print and hand-finish a custom charm from a photo, a sketch, or a memory. Small enough to carry. Significant enough to matter.',
        'Each keychain is made with durable PLA and attached to a quality metal ring. It arrives in a small velvet pouch, ready to become part of your daily ritual.'
      ],
      processes: [
        { title: 'Share Your Idea:', description: 'Send us a photo, sketch, or description of what matters to you.' },
        { title: 'Design:', description: 'We create a 3D model and send it for your approval.' },
        { title: 'Print & Finish:', description: 'We print, sand, paint, and finish your keychain over 1 week.' },
        { title: 'Deliver:', description: 'Your piece arrives gift-ready, wrapped with care. Ringroad delivery free of charge.' }
      ],
      care: [
        'Keep away from direct sunlight to preserve the finish. Dust gently with a soft dry cloth. Do not expose to moisture or extreme heat.'
      ],
      price: 1200,
      price_note: '25% prepayment required . Includes gift-ready packaging · Free delivery within Kathmandu·',
      images: ['/images/products/custom-human-figurine/1.png'],
      material: ['PLA'],
      size: { unit: 'cm', value: [10, 15, 17] },
      related_product_ids: [8, 0, 3, 14],
      category_slug: 'memory-you-can-touch',
      status: 'Active',
      stock: 42
    },
    {
      id: 4,
      rank: 12,
      head: 'IN YOUR POCKET · MEMORY YOU CAN TOUCH',
      title: 'Memory Keychain',
      subtitle: 'A small piece you carry everywhere.',
      descriptions: [
        'A keychain is the last thing you touch before you leave, and the first thing you touch when you return. Make it meaningful.',
        'We 3D print and hand-finish a custom charm from a photo, a sketch, or a memory. Small enough to carry. Significant enough to matter.',
        'Each keychain is made with durable PLA and attached to a quality metal ring. It arrives in a small velvet pouch, ready to become part of your daily ritual.'
      ],
      processes: [
        { title: 'Share Your Idea:', description: 'Send us a photo, sketch, or description of what matters to you.' },
        { title: 'Design:', description: 'We create a 3D model and send it for your approval.' },
        { title: 'Print & Finish:', description: 'We print, sand, paint, and finish your keychain over 1 week.' },
        { title: 'Deliver:', description: 'Your piece arrives gift-ready, wrapped with care. Ringroad delivery free of charge.' }
      ],
      care: [
        'Keep away from direct sunlight to preserve the finish. Dust gently with a soft dry cloth. Do not expose to moisture or extreme heat.'
      ],
      price: 350,
      price_note: '100% prepayment required . Includes gift-ready packaging · Free delivery within Kathmandu·',
      images: ['/images/products/custom-human-figurine/1.png'],
      material: ['PLA'],
      size: { unit: 'cm', value: [10, 15, 17] },
      related_product_ids: [8, 0, 3, 14],
      category_slug: 'memory-you-can-touch',
      status: 'Active',
      stock: 35
    },
    {
      id: 5,
      rank: 6,
      head: 'PUZZLE OF A MOMENT · PIECE BY PIECE',
      title: '3D Dinosaur Puzzle',
      subtitle: 'Build a memory together.',
      descriptions: [
        'A puzzle is a conversation. Building it together is the gift. We create custom 3D puzzles that turn memories into playtime.',
        'Choose a theme — dinosaurs, animals, landmarks, or a custom design. We 3D print each puzzle piece with precision so they fit together perfectly.',
        'Each puzzle arrives in a beautiful box with an illustration of the finished piece and a note about why it matters.'
      ],
      processes: [
        { title: 'Choose Theme:', description: 'Pick from our designs or request a custom creation.' },
        { title: 'Customize:', description: "Tell us who this is for and why it matters. We'll include it in the box." },
        { title: 'Print & Prepare:', description: 'We print each piece, sand them smooth, and pack them carefully over 1-2 weeks.' },
        { title: 'Deliver:', description: 'Your piece arrives gift-ready, wrapped with care. Ringroad delivery free of charge.' }
      ],
      care: [
        'Store pieces in the provided box. Keep away from moisture and heat. Each piece is durable but handle gently during building. Do not force pieces together.'
      ],
      price: 2500,
      price_note: '100% prepayment required . Includes gift-ready packaging · Free delivery within Kathmandu·',
      images: ['/images/products/custom-human-figurine/1.png'],
      material: ['PLA'],
      size: { unit: 'cm', value: [10, 15, 17] },
      related_product_ids: [8, 0, 3, 14],
      category_slug: 'piece-by-piece',
      status: 'Active',
      stock: 11
    },
    {
      id: 8,
      rank: 1,
      head: 'MILESTONE MARKED · TIME IN PHYSICAL FORM',
      title: 'Anniversary Sculpture',
      subtitle: 'Years together, made tangible.',
      descriptions: [
        'An anniversary is a moment to acknowledge: we chose each other again, and again. We turn that choice into a sculpture.',
        'We design a custom piece that represents your years together — could be years stacked, intertwined lines, or a moment from your story, rendered in stone or bronze.',
        'Each sculpture is hand-carved or cast. It arrives with a certificate explaining its meaning and a space to add your names.'
      ],
      processes: [
        { title: 'Share Your Story:', description: 'Tell us how many years, what matters most, any symbols that resonate.' },
        { title: 'Design:', description: 'We sketch 3-4 design options for your approval.' },
        { title: 'Craft:', description: 'Stone carving or bronze casting takes 3-5 weeks. Hand-finished with care.' },
        { title: 'Deliver:', description: 'Your piece arrives gift-ready, wrapped with care. Ringroad delivery free of charge.' }
      ],
      care: [
        'Stone and bronze are durable. Keep away from direct sunlight to preserve color. Dust gently with a soft cloth. Do not expose to harsh weather if kept outdoors. Store safely.'
      ],
      price: 15000,
      price_note: '100% prepayment required . Includes gift-ready packaging · Free delivery within Kathmandu·',
      images: ['/images/products/custom-human-figurine/1.png'],
      material: ['PLA'],
      size: { unit: 'cm', value: [10, 15, 17] },
      related_product_ids: [8, 0, 3, 14],
      category_slug: 'time-in-physical-form',
      status: 'Active',
      stock: 6
    }
  ];

  for (const p of productsData) {
    const catId = categorySlugToId[p.category_slug] || null;
    await connection.query(
      `INSERT INTO products (id, \`rank\`, head, title, subtitle, descriptions, processes, care, price, price_note, images, material, size, status, stock, related_product_ids, category_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        p.price_note,
        JSON.stringify(p.images),
        JSON.stringify(p.material),
        JSON.stringify(p.size),
        p.status,
        p.stock,
        JSON.stringify(p.related_product_ids),
        catId
      ]
    );
  }

  // Seed users
  console.log('Seeding users...');
  const usersData = [
    { role: 'admin', name: 'John Cena', email: 'admin@gmail.com', password: 'admin', phone: '9800000000', address: 'Kapan, Kathmandu, Nepal', status: 'Active' },
    { role: 'customer', name: 'Priya Khadka', email: 'priya.k@example.com', password: 'password', phone: '9811111111', address: 'Thamel, Kathmandu, Nepal', status: 'Active' },
    { role: 'customer', name: 'Sameer Thapa', email: 'sameer.t@example.com', password: 'password', phone: '9822222222', address: 'Patan, Lalitpur, Nepal', status: 'Active' },
    { role: 'customer', name: 'Anita Sharma', email: 'anita.s@example.com', password: 'password', phone: '9833333333', address: 'New Baneshwor, Kathmandu, Nepal', status: 'Active' },
    { role: 'customer', name: 'Rajan Basnet', email: 'rajan.b@example.com', password: 'password', phone: '9844444444', address: 'Budhanilkantha, Kathmandu, Nepal', status: 'Active' },
    { role: 'customer', name: 'Mina Lama', email: 'mina.l@example.com', password: 'password', phone: '9855555555', address: 'Jhamsikhel, Lalitpur, Nepal', status: 'Invited' }
  ];

  for (const u of usersData) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    await connection.query(
      'INSERT INTO users (role, name, email, password, phone, address, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [u.role, u.name, u.email, hashedPassword, u.phone, u.address, u.status]
    );
  }

  // Seed orders
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
      subtotal: 12700,
      shipping: 0,
      total: 12700,
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
      ]
    },
    {
      id: 'H3D-24088',
      customer_name: 'Sameer Tamang',
      customer_email: 'sameer.t@example.com',
      customer_phone: '+977 98XXXXXXXX',
      delivery_address: 'Patan Dhoka\nLalitpur 44700\nNepal',
      status: 'Shipped',
      payment_method: 'Cash on Delivery',
      subtotal: 4000,
      shipping: 200,
      total: 4200,
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
      ]
    },
    {
      id: 'H3D-24087',
      customer_name: 'Anita Shrestha',
      customer_email: 'anita.s@example.com',
      customer_phone: '+977 98XXXXXXXX',
      delivery_address: 'New Baneshwor\nKathmandu 44600\nNepal',
      status: 'Awaiting review',
      payment_method: 'Khalti',
      subtotal: 17200,
      shipping: 0,
      total: 17200,
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
      ]
    },
    {
      id: 'H3D-24086',
      customer_name: 'Rajan Basnet',
      customer_email: 'rajan.b@example.com',
      customer_phone: '+977 98XXXXXXXX',
      delivery_address: 'Budhanilkantha-4\nKathmandu 44600\nNepal',
      status: 'In craft',
      payment_method: 'eSewa',
      subtotal: 3600,
      shipping: 200,
      total: 3800,
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
      ]
    },
    {
      id: 'H3D-24085',
      customer_name: 'Mina Lama',
      customer_email: 'mina.l@example.com',
      customer_phone: '+977 98XXXXXXXX',
      delivery_address: 'Jhamsikhel\nLalitpur 44700\nNepal',
      status: 'Delivered',
      payment_method: 'Cash on Delivery',
      subtotal: 26550,
      shipping: 0,
      total: 26550,
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
      ]
    }
  ];

  for (const o of ordersData) {
    await connection.query(
      `INSERT INTO orders (id, customer_name, customer_email, customer_phone, delivery_address, status, payment_method, subtotal, shipping, total, \`lines\`, timeline)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        o.id,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.delivery_address,
        o.status,
        o.payment_method,
        o.subtotal,
        o.shipping,
        o.total,
        JSON.stringify(o.lines),
        JSON.stringify(o.timeline)
      ]
    );
  }

  console.log('Database initialization and seeding completed successfully!');
  await connection.end();
}

main().catch((err) => {
  console.error('Error during database initialization:', err);
  process.exit(1);
});
