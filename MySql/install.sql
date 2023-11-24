-- CREATE DATABASE DATADOCTORS;
USE datadoctors;

CREATE TABLE HOSPITAL
(
	Id		 	INT				NOT NULL, 
	Address		VARCHAR(255)	NOT NULL,
	City     	VARCHAR(255) 	NOT NULL,
	Zip_code    CHAR(5)			NOT NULL,
	State       CHAR(2) 		NOT NULL,
	Phone       Char(10)		NOT NULL,
	PRIMARY KEY (Id)
);

CREATE TABLE DEPARTMENT
(
	Dnum		INT				NOT NULL,
	Dname		VARCHAR(255)	NOT NULL,
	PRIMARY KEY (Dnum),
	UNIQUE(Dname)
);

CREATE TABLE EMPLOYEE
(
	Emp_id		CHAR(8)			NOT NULL,
    Pass        VARCHAR(255)    NOT NULL,
	Fname		VARCHAR(255)	NOT NULL,
	Lname 		VARCHAR(255)	NOT NULL,
    Ssn 		CHAR(9)			NOT NULL,
    Emp_Type 	VARCHAR(255)    NOT NULL,
	Department	INT 			NOT NULL,
	Start_date	DATE			NOT NULL,
	Pay			Decimal(10,2)   NOT NULL,
	PRIMARY KEY(Emp_id),
    FOREIGN KEY (Department) REFERENCES DEPARTMENT(Dnum)
);

CREATE TABLE PATIENT
(
	Ssn			CHAR(9)			NOT NULL,
	Fname		VARCHAR(255)	NOT NULL,
	Lname		VARCHAR(255)	NOT NULL,
	Phone		CHAR(10)		NOT NULL,
	Dob			DATE			NOT NULL,
	Email		VARCHAR(255)	NOT NULL,
	Address		VARCHAR(255)	NOT NULL,
	City		VARCHAR(255)	NOT NULL,
	State		CHAR(2)			NOT NULL,
	Zip_code	INT				NOT NULL,
	PRIMARY KEY(Ssn)
);

CREATE TABLE APPOINTMENTS
(
	App_id		CHAR(8)			NOT NULL,
	Date_time	TIMESTAMP		NOT NULL,
	Symptoms	VARCHAR(255)	NOT NULL,
	Pssn		CHAR(9)			NOT NULL,
	Emp_id		CHAR(8)			NOT NULL,
	Department  INT				NOT NULL,
	PRIMARY KEY (App_id),
	FOREIGN KEY (Pssn) REFERENCES PATIENT(Ssn),
	FOREIGN KEY (Emp_id) REFERENCES EMPLOYEE(Emp_id),
    FOREIGN KEY (Department) REFERENCES DEPARTMENT(Dnum)
);

CREATE TABLE PATIENTQUEUE
(
	Pssn		CHAR(9)			NOT NULL,
	App_flg    	CHAR(1)			DEFAULT 'N', 
	Check_in    TIMESTAMP		NOT NULL,
    Symptoms    VARCHAR(255)    NOT NULL,
    PRIMARY KEY(Pssn),
    FOREIGN KEY(Pssn) REFERENCES PATIENT(Ssn)
);

CREATE TABLE MEDICALHISTORY
(
	Pssn		CHAR(9)			NOT NULL, 
	Allergies	VARCHAR(255),
	Surgeries   VARCHAR(255),
    FOREIGN KEY(Pssn) REFERENCES PATIENT(Ssn)
);

CREATE TABLE BILLING
(
	Tran_id 	CHAR(8)			NOT NULL,
	Pssn		CHAR(9)			NOT NULL,
	Paid		CHAR(1)			NOT NULL,
	PRIMARY KEY (Tran_id),
	FOREIGN KEY (Pssn) REFERENCES PATIENT(Ssn)
);
