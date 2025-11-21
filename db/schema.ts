import { pgTable, serial, varchar, text, timestamp, integer, boolean, decimal, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullname: varchar('fullname', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 50 }).notNull().unique(),
  password: text('password').notNull(),
  plan: varchar('plan', { length: 50 }).notNull().default('free'),
  userType: varchar('user_type', { length: 50 }).notNull().default('regular'),
  totalEarnings: decimal('total_earnings', { precision: 10, scale: 2 }).default('0.00'),
  currentBalance: decimal('current_balance', { precision: 10, scale: 2 }).default('0.00'),
  tasksCompleted: integer('tasks_completed').default(0),
  referralCode: varchar('referral_code', { length: 50 }).unique(),
  referredBy: integer('referred_by'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  taskType: varchar('task_type', { length: 100 }).notNull(),
  reward: decimal('reward', { precision: 10, scale: 2 }).notNull(),
  planRequired: varchar('plan_required', { length: 50 }),
  isActive: boolean('is_active').default(true),
  maxCompletionsPerUser: integer('max_completions_per_user').default(1),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
  createdBy: integer('created_by')
});

export const userTasks = pgTable('user_tasks', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  taskId: integer('task_id').notNull().references(() => tasks.id),
  status: varchar('status', { length: 50 }).default('pending'),
  completedAt: timestamp('completed_at'),
  rewardPaid: decimal('reward_paid', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
  uniqueUserTask: unique().on(table.userId, table.taskId)
}));

export const earnings = pgTable('earnings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  type: varchar('type', { length: 100 }).notNull(),
  description: text('description'),
  referenceId: integer('reference_id'),
  createdAt: timestamp('created_at').defaultNow()
});

export const referrals = pgTable('referrals', {
  id: serial('id').primaryKey(),
  referrerId: integer('referrer_id').notNull().references(() => users.id),
  referredUserId: integer('referred_user_id').notNull().references(() => users.id),
  commission: decimal('commission', { precision: 10, scale: 2 }).default('0.00'),
  isPaid: boolean('is_paid').default(false),
  createdAt: timestamp('created_at').defaultNow()
});

export const withdrawals = pgTable('withdrawals', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  method: varchar('method', { length: 100 }).notNull(),
  accountDetails: text('account_details'),
  status: varchar('status', { length: 50 }).default('pending'),
  processedAt: timestamp('processed_at'),
  createdAt: timestamp('created_at').defaultNow()
});

export const shareLinks = pgTable('share_links', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  taskId: integer('task_id').notNull().references(() => tasks.id),
  trackingCode: varchar('tracking_code', { length: 50 }).notNull().unique(),
  platform: varchar('platform', { length: 50 }),
  shareUrl: text('share_url'),
  clickCount: integer('click_count').default(0),
  isVerified: boolean('is_verified').default(false),
  verifiedAt: timestamp('verified_at'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow()
});

export const shareClicks = pgTable('share_clicks', {
  id: serial('id').primaryKey(),
  linkId: integer('link_id').notNull().references(() => shareLinks.id),
  userId: integer('user_id').notNull().references(() => users.id),
  platform: varchar('platform', { length: 50 }),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  ipAddress: varchar('ip_address', { length: 50 }),
  clickedAt: timestamp('clicked_at').defaultNow()
});

export const socialVerifications = pgTable('social_verifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  taskId: integer('task_id').notNull().references(() => tasks.id),
  platform: varchar('platform', { length: 50 }).notNull(),
  accessToken: text('access_token'),
  verificationMethod: varchar('verification_method', { length: 100 }),
  isVerified: boolean('is_verified').default(false),
  verifiedAt: timestamp('verified_at'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow()
});

export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(userTasks),
  earnings: many(earnings),
  referrals: many(referrals),
  withdrawals: many(withdrawals),
  shareLinks: many(shareLinks),
  socialVerifications: many(socialVerifications)
}));

export const tasksRelations = relations(tasks, ({ many }) => ({
  userTasks: many(userTasks)
}));

export const userTasksRelations = relations(userTasks, ({ one }) => ({
  user: one(users, {
    fields: [userTasks.userId],
    references: [users.id]
  }),
  task: one(tasks, {
    fields: [userTasks.taskId],
    references: [tasks.id]
  })
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;
export type UserTask = typeof userTasks.$inferSelect;
export type Earning = typeof earnings.$inferSelect;
export type Referral = typeof referrals.$inferSelect;
export type Withdrawal = typeof withdrawals.$inferSelect;
