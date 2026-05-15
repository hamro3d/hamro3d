// CREATE TABLE users (
//   u_id       UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
//   role       VARCHAR(20)  NOT NULL DEFAULT 'customer',
//   name       VARCHAR(100)  NOT NULL,
//   email      VARCHAR(255) NOT NULL UNIQUE,
//   password   VARCHAR(255) NOT NULL,
//   phone      VARCHAR(20),
//   address    TEXT,
//   status     VARCHAR(20)  NOT NULL DEFAULT 'active',
//   created_at TIMESTAMP    NOT NULL DEFAULT now(),
//   updated_at TIMESTAMP    NOT NULL DEFAULT now()
// );
const user = [
  {
    u_id: '1',
    role: 'admin',
    email: 'admin@gmail.com',
    password: 'admin',
    name: 'John Cena',
    address: 'Kapan; Kathmandu; Nepal; Asia',
    phone: '9800000000',
    created_date: '2021-01-01',
    updated_date: '2021-01-01',
  }
]

// CREATE TABLE products (
//   p_id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
//   rank                INT,
//   category            VARCHAR(50),
//   head                TEXT,
//   title               VARCHAR(255) NOT NULL,
//   subtitle            TEXT,
//   descriptions        JSONB,       -- string[]
//   processes           JSONB,       -- {title, description}[]
//   care                JSONB,       -- string[]
//   price               DECIMAL(10,2) NOT NULL,
//   price_note          TEXT,
//   images              JSONB,       -- string[]
//   material            JSONB,       -- string[]
//   size                JSONB,       -- {unit, value[]}
//   status              VARCHAR(20)  NOT NULL DEFAULT 'active',
//   related_product_ids JSONB,       -- UUID[]
//   created_at          TIMESTAMP    NOT NULL DEFAULT now(),
//   updated_at          TIMESTAMP    NOT NULL DEFAULT now()
// );
const products = [
  {
    p_id: '',           // UUID
    rank: 1,            // manual curation order
    category: '',       // 'figurine' | 'portrait' | etc — for filtering
    head: '',           // marketing headline (display only)
    title: '',
    subtitle: '',
    descriptions: [''],
    processes: [
      {
        title: '',
        description: '',
      }
    ],
    care: [''],
    price: 0,
    price_note: '',     // '50% prepayment required · Includes gift-ready packaging · Free delivery within Kathmandu'
    images: [''],       // filenames only, base URL from config
    material: [''],     // ['PLA', 'Resin']
    size: {
      unit: '',         // 'cm' | 'inch'
      value: [0],       // [10, 15, 20]
    },
    status: '',         // 'active' | 'inactive' | 'discontinued'
    related_product_ids: [''],
  },
  {
    p_id: 0,
    rank: 1,
    head: 'FOR YOUR LOVE · PERSONALIZED PIECE',
    title: 'Custom Human Figurine',
    subtitle: 'It is a moment made permanent.',
    descriptions: [
      'A figurine is not a product. It is a moment made permanent — a person you love, rendered in physical form so they are never truly out of reach.',
      'Send us one clear photograph. Our artisans study your image, understand the person, and craft a piece that holds the feeling of them — not just their likeness.',
      'Every figurine is hand-finished and painted in our Kathmandu studio. No two are identical. Each arrives in our signature gift packaging with a handwritten commission card.',
    ],
    processes: [
      {
        title: 'Commission:',
        description:
          'Place your order and share your reference photograph and any details about the person.',
      },
      {
        title: 'Sculpt Preview:',
        description: 'We share a 3D preview for your approval before production begins.',
      },
      {
        title: 'Craft:',
        description:
          'Our team prints, refines, and hand-finishes your figurine over 2–4 weeks.',
      },
      {
        title: 'Deliver:',
        description:
          'Your piece arrives gift-ready, wrapped with care. Kathmandu delivery free of charge.',
      },
    ],
    care: [
      'Keep away from direct sunlight to preserve the finish. Dust gently with a soft dry cloth. Do not expose to moisture or extreme heat.',
      'Your figurine is a precious object — treat it as one. Store on a flat, stable surface. Each piece is warrantied against manufacturing defects for 90 days.',
    ],
    price: 8500,
    priceNote:
      '50% prepayment required . Includes gift-ready packaging · Free delivery within Kathmandu·',
    images: [
      '/images/products/custom-human-figurine-1.jpg',
      '/images/products/custom-human-figurine-2.jpg',
      '/images/products/custom-human-figurine-3.jpg',
      '/images/products/custom-human-figurine-4.jpg',
    ],
    material: ['PLA', 'Resin'],
    size: { unit: 'cm', value: [10, 15, 20] },
    relatedProductIds: [4, 8, 1, 3],
  }
]

// normalized junction table with one row per (user, product) pair.
// CREATE TABLE wishlist (
//   u_id  UUID NOT NULL REFERENCES users(u_id),
//   p_id  UUID NOT NULL REFERENCES products(p_id),
//   PRIMARY KEY (u_id, p_id)
// );
const wishlist = [{ u_id:'1', p_id:[1, 2, 3] }]

// A single flat normalized junction table
// CREATE TABLE cart (
//   u_id     UUID NOT NULL REFERENCES users(u_id),
//   p_id     UUID NOT NULL REFERENCES products(p_id),
//   quantity INT  NOT NULL DEFAULT 1 CHECK (quantity >= 1),
//   PRIMARY KEY (u_id, p_id)
// );
const cart = [{u_id:'1', products: [{p_id:'1', quantity:1}, {p_id:'2', quantity:2}, {p_id:'3', quantity:3}]}]

// CREATE TABLE orders (
//   o_id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
//   u_id              UUID         NOT NULL REFERENCES users(u_id),

//   -- who placed the order
//   u_name            VARCHAR(100) NOT NULL,
//   u_phone           VARCHAR(20)  NOT NULL,
//   u_address         TEXT         NOT NULL,
//   u_email           VARCHAR(255) NOT NULL,

//   -- who receives it (NULL = same as above)
//   receiver_name     VARCHAR(100),
//   receiver_contact  VARCHAR(20),
//   receiver_address  TEXT,

//   payment_method    VARCHAR(20)  NOT NULL,
//   status            VARCHAR(20)  NOT NULL DEFAULT 'pending',
//   created_at        TIMESTAMP    NOT NULL DEFAULT now(),
//   settled_at        TIMESTAMP
// );

// CREATE TABLE order_items (
//   id         UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
//   o_id       UUID          NOT NULL REFERENCES orders(o_id),
//   p_id       UUID          NOT NULL REFERENCES products(p_id),
//   name       VARCHAR(255)  NOT NULL,
//   material   VARCHAR(100),
//   size_unit  VARCHAR(10),
//   size_value DECIMAL(10,2),
//   unit_price DECIMAL(10,2) NOT NULL,
//   quantity   INT           NOT NULL CHECK (quantity >= 1)
//   -- no subtotal column either, same reasoning — derived from unit_price × quantity
// );
const order = [
  {
    o_id: '',
    u_id: '',

    // user snapshot — who placed the order
    u_name: '',
    u_phone: '',
    u_address: '',

    // delivery snapshot — who receives it (null = same as above)
    delivery: {
      receiver_name: '',
      receiver_contact: '',
      receiver_address: '',
      receiver_email: '',
    } || null,

    products: [
      {
        p_id: '',
        name: '',
        material: '',
        size: { unit: '', value: 0 },
        unit_price: 0,
        quantity: 0,
      }
    ],

    payment_method: '',   // 'cash' | 'card' | 'esewa' | 'khalti'
    status: '',           // 'pending' | 'progress' | 'delivered' | 'cancelled'
    created_at: '',
    settled_at: null,     // set when status → delivered or cancelled
  },
];

// const resolveDelivery = (order) => ({
//   receiver_name:    order.receiver_name    ?? order.u_name,
//   receiver_contact: order.receiver_contact ?? order.u_phone,
//   receiver_address: order.receiver_address ?? order.u_address,
//   receiver_email: order.receiver_email ?? order.u_email,
// });
