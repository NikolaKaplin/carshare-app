CREATE TABLE `bookings` (
	`id` text(255) NOT NULL,
	`client_id` text(255) NOT NULL,
	`car_id` text(255) NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`total_days` integer NOT NULL,
	`total_price` real NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`pickup_location` text NOT NULL,
	`payment_status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`car_id`) REFERENCES `cars`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_id_unique` ON `bookings` (`id`);--> statement-breakpoint
CREATE TABLE `cars` (
	`id` text(255) NOT NULL,
	`license_plate` text NOT NULL,
	`brand` text NOT NULL,
	`model` text NOT NULL,
	`year` integer NOT NULL,
	`color` text NOT NULL,
	`category` text NOT NULL,
	`daily_price` real NOT NULL,
	`is_available` integer DEFAULT true NOT NULL,
	`current_mileage` real DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'available' NOT NULL,
	`location` text NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cars_id_unique` ON `cars` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `cars_license_plate_unique` ON `cars` (`license_plate`);--> statement-breakpoint
CREATE TABLE `clients` (
	`id` text(255) NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`role` text DEFAULT 'client' NOT NULL,
	`phone` text NOT NULL,
	`full_name` text NOT NULL,
	`driver_license` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `clients_id_unique` ON `clients` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `clients_email_unique` ON `clients` (`email`);--> statement-breakpoint
CREATE TABLE `maintenance` (
	`id` text(255) NOT NULL,
	`car_id` integer NOT NULL,
	`description` text NOT NULL,
	`cost` real DEFAULT 0 NOT NULL,
	`date` integer NOT NULL,
	`mileage` real NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`car_id`) REFERENCES `cars`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `maintenance_id_unique` ON `maintenance` (`id`);--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text(255) NOT NULL,
	`booking_id` text(255) NOT NULL,
	`user_id` text(255) NOT NULL,
	`amount` real NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`transaction_id` text,
	`card_last_digits` text,
	`payment_date` integer,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payments_id_unique` ON `payments` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `payments_transaction_id_unique` ON `payments` (`transaction_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text(255) NOT NULL,
	`username` text(65) NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);