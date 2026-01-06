import { pgTable, text, varchar, integer, boolean, timestamp, decimal, json, serial, jsonb } from "drizzle-orm/pg-core"
import { type InferSelectModel, type InferInsertModel, relations } from "drizzle-orm"

// Admin Users Table
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).default("admin"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Hero Slider Table
export const heroSliders = pgTable("hero_sliders", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 500 }),
  image: varchar("image", { length: 500 }).notNull(),
  order: integer("order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// About Section Table
// export const aboutSections = pgTable("about_sections", {
//   id: serial("id").primaryKey(),
//   title: varchar("title", { length: 255 }).notNull(),
//   subtitle: varchar("subtitle", { length: 500 }),
//   description: text("description").notNull(),
//   image: varchar("image", { length: 500 }),
//   points: json("points").$type<string[]>().default([]),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// })

// Services Table
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  url: text("url").unique().notNull(),
  icon: text("icon").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  bulletPoints: jsonb("bulletPoints").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Package Table
export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").references(() => services.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  bulletPoints: jsonb("bulletPoints").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});


// Blog Posts Table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: varchar("excerpt", { length: 500 }),
  category: varchar("category", { length: 100 }).notNull(),
  content: text("content").notNull(),
  image: varchar("image", { length: 500 }),
  author: varchar("author", { length: 255 }).default("Mumo Travels"),
  featured: boolean("featured").default(false),
  readTime: varchar("read_time", { length: 50 }).default("5 min read"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// FAQ Table
export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: varchar("question", { length: 500 }).notNull(),
  answer: text("answer").notNull(),
  category: varchar("category", { length: 100 }),
  order: integer("order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Testimonials Table
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }),
  content: text("content").notNull(),
  rating: integer("rating").default(5),
  image: varchar("image", { length: 500 }),
  order: integer("order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// SEO Management Table
export const seoPages = pgTable("seo_pages", {
  id: serial("id").primaryKey(),
  pagePath: varchar("page_path", { length: 255 }).unique().notNull(),
  pageTitle: varchar("page_title", { length: 255 }).notNull(),
  metaDescription: varchar("meta_description", { length: 160 }),
  keywords: varchar("keywords", { length: 500 }),
  ogTitle: varchar("og_title", { length: 255 }),
  ogDescription: varchar("og_description", { length: 160 }),
  ogImage: varchar("og_image", { length: 500 }),
  canonicalUrl: varchar("canonical_url", { length: 500 }),
  schema: json("schema"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const metadata = pgTable("metadata", {
  id: serial("id").primaryKey(),
  siteUrl: text("site_url"),
  titleDefault: text("title_default"),
  titleTemplate: text("title_template"),
  description: text("description"),
  siteName: text("site_name"),
  logoUrl: text("logo_url"),
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  ogImageUrl: text("og_image_url"),
  twitterTitle: text("twitter_title"),
  twitterDescription: text("twitter_description"),
  canonicalUrl: text("canonical_url"),
  category: text("category"),
  creator: text("creator"),
  publisher: text("publisher"),
  keywords: json("keywords").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})
// Types definitions
export type Metadata = InferSelectModel<typeof metadata>
export type NewMetadata = InferInsertModel<typeof metadata>


export const servicesRelations = relations(services, ({ many }) => ({
  packages: many(packages)
}));

export const packagesRelations = relations(packages, ({ one }) => ({
  services: one(services, {
    fields: [packages.serviceId],
    references: [services.id],
  })
}))

// Type definitions
export type AdminUser = InferSelectModel<typeof adminUsers>
export type NewAdminUser = InferInsertModel<typeof adminUsers>

export type HeroSlider = InferSelectModel<typeof heroSliders>
export type NewHeroSlider = InferInsertModel<typeof heroSliders>

export type Service = InferSelectModel<typeof services>
export type NewService = InferInsertModel<typeof services>

export type Package = InferSelectModel<typeof packages>
export type NewPackage = InferInsertModel<typeof packages>

export type BlogPost = InferSelectModel<typeof blogPosts>
export type NewBlogPost = InferInsertModel<typeof blogPosts>

export type FAQ = InferSelectModel<typeof faqs>
export type NewFAQ = InferInsertModel<typeof faqs>

export type Testimonial = InferSelectModel<typeof testimonials>
export type NewTestimonial = InferInsertModel<typeof testimonials>

export type SEOPage = InferSelectModel<typeof seoPages>
export type NewSEOPage = InferInsertModel<typeof seoPages>
