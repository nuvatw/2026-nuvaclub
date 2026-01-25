/**
 * Admin Database - Server-side JSON file persistence for admin operations.
 * This provides a simple persistent storage for admin CRUD operations.
 */

import { promises as fs } from 'fs';
import path from 'path';

// Types for admin-managed data
export interface AdminProduct {
  id: string;
  type: 'event' | 'merchandise' | 'plan';
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCourse {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnailUrl: string;
  level: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserRelationship {
  userId: string;
  nunuId: string | null;
  vavaIds: string[];
  updatedAt: string;
}

export interface AdminDBData {
  products: AdminProduct[];
  courses: AdminCourse[];
  deletedMatchingPosts: string[];
  deletedForumPosts: string[];
  userRelationships: UserRelationship[];
}

const DB_PATH = path.join(process.cwd(), 'data', 'admin-db.json');

// Simple file lock to prevent concurrent write issues
let isWriting = false;
const writeQueue: Array<() => Promise<void>> = [];

async function processWriteQueue() {
  if (isWriting || writeQueue.length === 0) return;
  isWriting = true;
  const task = writeQueue.shift();
  if (task) {
    await task();
  }
  isWriting = false;
  processWriteQueue();
}

/**
 * Read the admin database
 */
export async function readAdminDB(): Promise<AdminDBData> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data) as AdminDBData;
  } catch (error) {
    // If file doesn't exist, return default structure
    const defaultData: AdminDBData = {
      products: [],
      courses: [],
      deletedMatchingPosts: [],
      deletedForumPosts: [],
      userRelationships: [],
    };
    await writeAdminDB(defaultData);
    return defaultData;
  }
}

/**
 * Write to the admin database
 */
export async function writeAdminDB(data: AdminDBData): Promise<void> {
  return new Promise((resolve, reject) => {
    writeQueue.push(async () => {
      try {
        // Ensure directory exists
        const dir = path.dirname(DB_PATH);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
        resolve();
      } catch (error) {
        reject(error);
      }
    });
    processWriteQueue();
  });
}

// ==========================================
// PRODUCTS CRUD
// ==========================================

export async function getProducts(): Promise<AdminProduct[]> {
  const db = await readAdminDB();
  return db.products;
}

export async function createProduct(product: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdminProduct> {
  const db = await readAdminDB();
  const newProduct: AdminProduct = {
    ...product,
    id: `admin-product-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.products.push(newProduct);
  await writeAdminDB(db);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<AdminProduct>): Promise<AdminProduct | null> {
  const db = await readAdminDB();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  db.products[index] = {
    ...db.products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await writeAdminDB(db);
  return db.products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await readAdminDB();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return false;

  db.products.splice(index, 1);
  await writeAdminDB(db);
  return true;
}

// ==========================================
// COURSES CRUD
// ==========================================

export async function getCourses(): Promise<AdminCourse[]> {
  const db = await readAdminDB();
  return db.courses;
}

export async function createCourse(course: Omit<AdminCourse, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdminCourse> {
  const db = await readAdminDB();
  const newCourse: AdminCourse = {
    ...course,
    id: `admin-course-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.courses.push(newCourse);
  await writeAdminDB(db);
  return newCourse;
}

export async function updateCourse(id: string, updates: Partial<AdminCourse>): Promise<AdminCourse | null> {
  const db = await readAdminDB();
  const index = db.courses.findIndex((c) => c.id === id);
  if (index === -1) return null;

  db.courses[index] = {
    ...db.courses[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await writeAdminDB(db);
  return db.courses[index];
}

export async function deleteCourse(id: string): Promise<boolean> {
  const db = await readAdminDB();
  const index = db.courses.findIndex((c) => c.id === id);
  if (index === -1) return false;

  db.courses.splice(index, 1);
  await writeAdminDB(db);
  return true;
}

// ==========================================
// MATCHING POSTS MODERATION
// ==========================================

export async function getDeletedMatchingPosts(): Promise<string[]> {
  const db = await readAdminDB();
  return db.deletedMatchingPosts;
}

export async function deleteMatchingPost(postId: string): Promise<boolean> {
  const db = await readAdminDB();
  if (!db.deletedMatchingPosts.includes(postId)) {
    db.deletedMatchingPosts.push(postId);
    await writeAdminDB(db);
  }
  return true;
}

export async function restoreMatchingPost(postId: string): Promise<boolean> {
  const db = await readAdminDB();
  const index = db.deletedMatchingPosts.indexOf(postId);
  if (index !== -1) {
    db.deletedMatchingPosts.splice(index, 1);
    await writeAdminDB(db);
  }
  return true;
}

// ==========================================
// FORUM POSTS MODERATION
// ==========================================

export async function getDeletedForumPosts(): Promise<string[]> {
  const db = await readAdminDB();
  return db.deletedForumPosts;
}

export async function deleteForumPost(postId: string): Promise<boolean> {
  const db = await readAdminDB();
  if (!db.deletedForumPosts.includes(postId)) {
    db.deletedForumPosts.push(postId);
    await writeAdminDB(db);
  }
  return true;
}

export async function restoreForumPost(postId: string): Promise<boolean> {
  const db = await readAdminDB();
  const index = db.deletedForumPosts.indexOf(postId);
  if (index !== -1) {
    db.deletedForumPosts.splice(index, 1);
    await writeAdminDB(db);
  }
  return true;
}

// ==========================================
// USER RELATIONSHIPS
// ==========================================

export async function getUserRelationships(): Promise<UserRelationship[]> {
  const db = await readAdminDB();
  return db.userRelationships;
}

export async function updateUserRelationship(
  userId: string,
  updates: { nunuId?: string | null; vavaIds?: string[] }
): Promise<UserRelationship> {
  const db = await readAdminDB();
  let relationship = db.userRelationships.find((r) => r.userId === userId);

  if (!relationship) {
    relationship = {
      userId,
      nunuId: null,
      vavaIds: [],
      updatedAt: new Date().toISOString(),
    };
    db.userRelationships.push(relationship);
  }

  if (updates.nunuId !== undefined) {
    relationship.nunuId = updates.nunuId;
  }
  if (updates.vavaIds !== undefined) {
    relationship.vavaIds = updates.vavaIds;
  }
  relationship.updatedAt = new Date().toISOString();

  await writeAdminDB(db);
  return relationship;
}
