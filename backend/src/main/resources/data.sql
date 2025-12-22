-- Insert 10 hospitals into the system
INSERT IGNORE INTO hospitals (hospital_id, name, street_address, city, state, zip_code, phone_number, website, status) VALUES
('HOSP001', 'City General Hospital', '123 Main Street', 'New York', 'NY', '10001', '(212) 555-0100', 'www.citygeneralhospital.com', 'OPERATIONAL'),
('HOSP002', 'St. Mary Medical Center', '456 Oak Avenue', 'Los Angeles', 'CA', '90210', '(323) 555-0200', 'www.stmarymedical.com', 'OPERATIONAL'),
('HOSP003', 'Metropolitan Health System', '789 Pine Road', 'Chicago', 'IL', '60601', '(312) 555-0300', 'www.metrohealth.com', 'OPERATIONAL'),
('HOSP004', 'Riverside Community Hospital', '321 River Drive', 'Houston', 'TX', '77001', '(713) 555-0400', 'www.riversidecommunity.com', 'OPERATIONAL'),
('HOSP005', 'Phoenix Valley Medical', '654 Desert Blvd', 'Phoenix', 'AZ', '85001', '(602) 555-0500', 'www.phoenixvalley.com', 'OPERATIONAL'),
('HOSP006', 'Atlantic Coast Regional', '987 Coastal Highway', 'Miami', 'FL', '33101', '(305) 555-0600', 'www.atlanticcoast.com', 'OPERATIONAL'),
('HOSP007', 'Mountain View Hospital', '147 Summit Street', 'Denver', 'CO', '80201', '(303) 555-0700', 'www.mountainviewhosp.com', 'OPERATIONAL'),
('HOSP008', 'Pacific Northwest Medical', '258 Forest Lane', 'Seattle', 'WA', '98101', '(206) 555-0800', 'www.pacificnwmed.com', 'OPERATIONAL'),
('HOSP009', 'Sunshine State Hospital', '369 Palm Avenue', 'Orlando', 'FL', '32801', '(407) 555-0900', 'www.sunshinestate.com', 'OPERATIONAL'),
('HOSP010', 'Great Lakes Medical Center', '741 Lakeshore Drive', 'Detroit', 'MI', '48201', '(313) 555-1000', 'www.greatlakesmed.com', 'OPERATIONAL');
