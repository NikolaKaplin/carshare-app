import { sqliteTable, text, integer, real} from 'drizzle-orm/sqlite-core';

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

// 7. Бэкапы
export const backups = sqliteTable('backups', {
    id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
    fileSize: text('file_size', { mode: "text", length: 16 }).notNull(),
    saveFolder: text('save_folder', { mode: "text" }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
})

// 8. Точки компаний
export const points = sqliteTable('points', {
    id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
    address: text('address', { mode: "text" }).notNull(),
    fullAddress: text('full_address', { mode: "text" }).notNull(),
    latitude: text('full_address', { mode: "text" }).notNull(),
    longitude: text('full_address', { mode: "text" }).notNull(),
})

// 9. Угоны и дтп
export const hijacking = sqliteTable("hijacking", {
    id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
    description: text('hijacking_description', { mode: "text" }).notNull(),
    closed: integer('closed', { mode: 'boolean' }).notNull().default(false),
    userId: integer('client_id').notNull().references(() => clients.id),
    carId: integer('car_id').notNull().references(() => cars.id),
    createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
})

// 10. Отзывы пользователей
export const comments = sqliteTable('comments', {
    id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
    userId: integer('client_id').notNull().references(() => clients.id),
    comment: text('comment').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
})




// Типы TypeScript
export type TUser = typeof users.$inferSelect;
export type TNewUser = typeof users.$inferInsert;

export type TClient = typeof clients.$inferSelect;
export type TNewClient = typeof clients.$inferInsert;

export type TCar = typeof cars.$inferSelect;
export type TNewCar = typeof cars.$inferInsert;

export type TBooking = typeof bookings.$inferSelect;
export type TNewBooking = typeof bookings.$inferInsert;

export type TMaintenance = typeof maintenance.$inferSelect;
export type TNewMaintenance = typeof maintenance.$inferInsert;

export type TPayments = typeof payments.$inferSelect;
export type TNewPayments = typeof payments.$inferInsert;

export type TBackup = typeof backups.$inferSelect;
export type TNewBackup = typeof backups.$inferInsert;
export type TUpdateBackup = Partial<Omit<TNewBackup, 'id'>>;

export type TPoint = typeof points.$inferSelect;
export type TNewPoint = typeof points.$inferInsert;
export type TUpdatePoint = Partial<Omit<TNewPoint, 'id'>>;

export type THijacking = typeof hijacking.$inferSelect
export type TNewHijacking = typeof hijacking.$inferInsert
export type TUpdateHijacking = Partial<Omit<TNewHijacking, 'id'>>;

export type TComment = typeof comments.$inferSelect;
export type TNewComment = typeof comments.$inferInsert
export type TUpdateComment = Partial<Omit<TNewComment, 'id'>>;