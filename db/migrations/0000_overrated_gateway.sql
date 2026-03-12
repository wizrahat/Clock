CREATE TABLE `alarms` (
	`id` text NOT NULL,
	`label` text NOT NULL,
	`isActive` integer DEFAULT false NOT NULL,
	`createdAt` integer NOT NULL,
	`time` text NOT NULL,
	`specificDates` text DEFAULT '[]' NOT NULL,
	`scheduleType` text DEFAULT 'once' NOT NULL,
	`repeatDays` text DEFAULT '[]' NOT NULL
);
