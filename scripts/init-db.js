// Database initialization script for PocketBase
// This script creates the collections and initial data

const collections = [
  {
    name: "users",
    type: "auth",
    schema: [
      {
        name: "full_name",
        type: "text",
        required: true
      },
      {
        name: "phone_number",
        type: "text",
        required: true
      },
      {
        name: "role",
        type: "select",
        required: true,
        options: {
          values: ["guest", "admin", "staff", "housekeeping", "pos"]
        }
      }
    ]
  },
  {
    name: "rooms",
    type: "base",
    schema: [
      {
        name: "name",
        type: "text",
        required: true
      },
      {
        name: "type",
        type: "text",
        required: true
      },
      {
        name: "price_per_night",
        type: "number",
        required: true
      },
      {
        name: "status",
        type: "select",
        required: true,
        options: {
          values: ["available", "occupied", "maintenance"]
        }
      },
      {
        name: "description",
        type: "text"
      },
      {
        name: "amenities",
        type: "json"
      },
      {
        name: "image",
        type: "text"
      },
      {
        name: "size",
        type: "text"
      }
    ]
  },
  {
    name: "bookings",
    type: "base",
    schema: [
      {
        name: "user_id",
        type: "relation",
        required: true,
        options: {
          collectionId: "users"
        }
      },
      {
        name: "room_id",
        type: "relation",
        required: true,
        options: {
          collectionId: "rooms"
        }
      },
      {
        name: "check_in_date",
        type: "date",
        required: true
      },
      {
        name: "check_out_date",
        type: "date",
        required: true
      },
      {
        name: "total_amount",
        type: "number"
      },
      {
        name: "status",
        type: "select",
        required: true,
        options: {
          values: ["pending", "confirmed", "cancelled", "completed"]
        }
      },
      {
        name: "guest_count",
        type: "number"
      },
      {
        name: "special_requests",
        type: "text"
      }
    ]
  },
  {
    name: "invoices",
    type: "base",
    schema: [
      {
        name: "booking_id",
        type: "relation",
        required: true,
        options: {
          collectionId: "bookings"
        }
      },
      {
        name: "guest_id",
        type: "relation",
        required: true,
        options: {
          collectionId: "users"
        }
      },
      {
        name: "total_amount",
        type: "number",
        required: true
      },
      {
        name: "tax_amount",
        type: "number"
      },
      {
        name: "status",
        type: "select",
        required: true,
        options: {
          values: ["pending", "paid", "cancelled"]
        }
      },
      {
        name: "payment_method",
        type: "text"
      }
    ]
  },
  {
    name: "housekeeping_tasks",
    type: "base",
    schema: [
      {
        name: "room_id",
        type: "relation",
        required: true,
        options: {
          collectionId: "rooms"
        }
      },
      {
        name: "assigned_to",
        type: "relation",
        required: true,
        options: {
          collectionId: "users"
        }
      },
      {
        name: "status",
        type: "select",
        required: true,
        options: {
          values: ["pending", "in_progress", "completed"]
        }
      },
      {
        name: "task_type",
        type: "select",
        required: true,
        options: {
          values: ["cleaning", "maintenance", "inspection"]
        }
      },
      {
        name: "description",
        type: "text"
      },
      {
        name: "priority",
        type: "select",
        required: true,
        options: {
          values: ["low", "medium", "high"]
        }
      },
      {
        name: "due_date",
        type: "date"
      }
    ]
  },
  {
    name: "reviews",
    type: "base",
    schema: [
      {
        name: "guest_id",
        type: "relation",
        required: true,
        options: {
          collectionId: "users"
        }
      },
      {
        name: "booking_id",
        type: "relation",
        required: true,
        options: {
          collectionId: "bookings"
        }
      },
      {
        name: "rating",
        type: "number",
        required: true
      },
      {
        name: "comment",
        type: "text"
      },
      {
        name: "status",
        type: "select",
        required: true,
        options: {
          values: ["pending", "published", "rejected"]
        }
      }
    ]
  },
  {
    name: "pos_orders",
    type: "base",
    schema: [
      {
        name: "booking_id",
        type: "relation",
        options: {
          collectionId: "bookings"
        }
      },
      {
        name: "items",
        type: "json",
        required: true
      },
      {
        name: "total_price",
        type: "number",
        required: true
      },
      {
        name: "status",
        type: "select",
        required: true,
        options: {
          values: ["pending", "preparing", "served", "cancelled"]
        }
      }
    ]
  },
  {
    name: "gallery_media",
    type: "base",
    schema: [
      {
        name: "type",
        type: "select",
        required: true,
        options: {
          values: ["image", "video"]
        }
      },
      {
        name: "url",
        type: "text",
        required: true
      },
      {
        name: "tags",
        type: "json"
      },
      {
        name: "title",
        type: "text"
      },
      {
        name: "category",
        type: "text"
      }
    ]
  },
  {
    name: "settings",
    type: "base",
    schema: [
      {
        name: "property_name",
        type: "text",
        required: true
      },
      {
        name: "contact_number",
        type: "text",
        required: true
      },
      {
        name: "email",
        type: "email",
        required: true
      },
      {
        name: "address",
        type: "text"
      },
      {
        name: "tax_percentage",
        type: "number",
        required: true
      }
    ]
  }
];

// Sample data
const sampleRooms = [
  {
    name: "Forest Villa",
    type: "Villa",
    price_per_night: 18500,
    status: "available",
    description: "Elevated among ancient trees, this spacious villa offers panoramic forest views with handcrafted teak interiors and a private meditation deck.",
    amenities: ["Private Deck", "Forest View", "Teak Interiors", "King Bed", "Meditation Space"],
    image: "/images/room-bed.jpg",
    size: "65 sqm"
  },
  {
    name: "Canopy Suite",
    type: "Suite",
    price_per_night: 22800,
    status: "available",
    description: "Suspended within the forest canopy, experience luxury living among the treetops with floor-to-ceiling windows and artisan stone bathrooms.",
    amenities: ["Canopy Views", "Stone Bath", "Floor-to-ceiling Windows", "Premium Bedding", "Mini Bar"],
    image: "/images/room-bed-table.jpg",
    size: "80 sqm"
  },
  {
    name: "Sanctuary Loft",
    type: "Loft",
    price_per_night: 28900,
    status: "available",
    description: "Our signature accommodation featuring a two-story design with private terrace, outdoor rainfall shower, and curated nature experiences.",
    amenities: ["Two-story", "Private Terrace", "Outdoor Shower", "Nature Guide", "Premium Service"],
    image: "/images/room-chairs.jpg",
    size: "120 sqm"
  }
];

const sampleSettings = {
  property_name: "Trails of Teak Resort",
  contact_number: "+91 XXXXX XXXXX",
  email: "info@trailsofteak.com",
  address: "Forest Reserve Road, Pristine Wilderness, Nature Valley",
  tax_percentage: 18
};

console.log('Database schema and sample data ready for PocketBase initialization');
console.log('Collections:', collections.map(c => c.name).join(', '));
console.log('Sample rooms:', sampleRooms.length);

module.exports = { collections, sampleRooms, sampleSettings };