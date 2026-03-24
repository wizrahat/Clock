PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_alarms` (
	`id` text NOT NULL,
	`label` text NOT NULL,
	`isActive` integer DEFAULT true NOT NULL,
	`createdAt` integer NOT NULL,
	`time` integer NOT NULL,
	`specificDates` text DEFAULT '[]' NOT NULL,
	`scheduleType` text DEFAULT 'once' NOT NULL,
	`repeatDays` text DEFAULT '[]' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_alarms`("id", "label", "isActive", "createdAt", "time", "specificDates", "scheduleType", "repeatDays") SELECT "id", "label", "isActive", "createdAt", "time", "specificDates", "scheduleType", "repeatDays" FROM `alarms`;--> statement-breakpoint
DROP TABLE `alarms`;--> statement-breakpoint
ALTER TABLE `__new_alarms` RENAME TO `alarms`;--> statement-breakpoint
PRAGMA foreign_keys=ON;