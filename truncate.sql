USE datadoctors;
SET FOREIGN_KEY_CHECKS=0;  # turn off foreign key checks
TRUNCATE TABLE HOSPITAL;  # truncate tables
TRUNCATE TABLE EMPLOYEE;
TRUNCATE TABLE DEPARTMENT;
TRUNCATE TABLE DOCTOR;
TRUNCATE TABLE NURSES;
TRUNCATE TABLE STAFF;
TRUNCATE TABLE PATIENT;
TRUNCATE TABLE APPOINTMENTS;
TRUNCATE TABLE PATIENTQUEUE;
TRUNCATE TABLE MEDICALHISTORY;
TRUNCATE TABLE BILLING;
SET FOREIGN_KEY_CHECKS=1;  # turn on foreign key checks
