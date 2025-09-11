import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// 1. Пользователи 
export const users = sqliteTable("users", {
    id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
    username: text('username', { length: 65 }).notNull(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
})

// 2. Клиенты
export const clients = sqliteTable('clients', {
    id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
    username: text('username').notNull(),
    email: text('email').notNull().unique(),
    role: text('role', { enum: ['client', 'admin'] }).notNull().default('client'),
    phone: text('phone').notNull(),
    fullName: text('full_name').notNull(),
    driverLicense: text('driver_license'),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
});

// 3. Автомобили
export const cars = sqliteTable('cars', {
    id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
    licensePlate: text('license_plate').notNull().unique(),
    brand: text('brand').notNull(),
    model: text('model').notNull(),
    year: integer('year').notNull(),
    color: text('color').notNull(),
    category: text('category', { enum: ['economy', 'comfort', 'business'] }).notNull(),
    dailyPrice: real('daily_price').notNull(),
    isAvailable: integer('is_available', { mode: 'boolean' }).notNull().default(true),
    currentMileage: real('current_mileage').notNull().default(0),
    status: text('status', { enum: ['available', 'rented', 'maintenance'] }).notNull().default('available'),
    location: text('location').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
});

// 4. Бронирования
export const bookings = sqliteTable('bookings', {
    id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
    userId: integer('client_id').notNull().references(() => clients.id),
    carId: integer('car_id').notNull().references(() => cars.id),
    startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
    endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
    totalDays: integer('total_days').notNull(),
    totalPrice: real('total_price').notNull(),
    status: text('status', { enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'] }).notNull().default('pending'),
    pickupLocation: text('pickup_location').notNull(),
    paymentStatus: text('payment_status', { enum: ['pending', 'paid', 'refunded'] }).notNull().default('pending'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
});

// 5. Обслуживание
export const maintenance = sqliteTable('maintenance', {
    id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
    carId: integer('car_id').notNull().references(() => cars.id),
    description: text('description').notNull(),
    cost: real('cost').notNull().default(0),
    date: integer('date', { mode: 'timestamp' }).notNull(),
    mileage: real('mileage').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
});

// 6. Платежи
export const payments = sqliteTable('payments', {
    id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
    bookingId: integer('booking_id').notNull().references(() => bookings.id),
    userId: integer('user_id').notNull().references(() => users.id),
    amount: real('amount').notNull(),
    status: text('status', { enum: ['pending', 'completed', 'failed', 'refunded'] }).notNull().default('pending'),
    transactionId: text('transaction_id').unique(),
    cardLastDigits: text('card_last_digits'),
    paymentDate: integer('payment_date', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
});


// Типы TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Car = typeof cars.$inferSelect;
export type NewCar = typeof cars.$inferInsert;

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;

export type Maintenance = typeof maintenance.$inferSelect;
export type NewMaintenance = typeof maintenance.$inferInsert;