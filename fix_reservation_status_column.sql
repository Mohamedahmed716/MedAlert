-- Fix for reservation status column truncation issue
-- Run this in your MySQL database (phpMyAdmin or MySQL command line)

-- First, let's see the current column definition
DESCRIBE reservation;

-- Update the status column to allow longer values
ALTER TABLE reservation MODIFY COLUMN status VARCHAR(20) NOT NULL;

-- Verify the change
DESCRIBE reservation;