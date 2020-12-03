CREATE TABLE `User` (
  `UserID` varchar(10) NOT NULL,
  `Email` varchar(25) UNIQUE,
  `Name` varchar(25),
  `IsAuthor` boolean,
  `Password` varchar(25) CHECK (length(Password) >= 8),
  PRIMARY KEY (`UserID`)
);

CREATE TABLE `Paper` (
  `PaperID` varchar(10) NOT NULL,
  `Title` varchar(100) NOT NULL,
  `Category` varchar(25) CHECK ( Category IN (
        "Mathematics", 
        "Physics", 
        "Computer Science", 
        "Chemistry", 
        "Biology", 
        "Economics", 
        "Other"
    )),
  `UserID` varchar(10) NOT NULL,
  PRIMARY KEY (`PaperID`),
  FOREIGN KEY(`UserID`) REFERENCES User(`UserID`) 
                                    ON DELETE CASCADE
                                    ON UPDATE CASCADE
);

CREATE TABLE `Sessions` (
  `SessionID` varchar(64) NOT NULL,
  `UserID` varchar(10) NOT NULL,
  PRIMARY KEY (`SessionID`),
  FOREIGN KEY(`UserID`) REFERENCES User(`UserID`) 
                                    ON DELETE CASCADE
                                    ON UPDATE CASCADE
);

CREATE TABLE `Reply` (
  `ReplyID` varchar(10) NOT NULL,
  `Reply` varchar(4700) NOT NULL,
  `UserID` varchar(10) NOT NULL,
  `PaperID` varchar(10) NOT NULL,
  `ParentID` varchar(10),
  `Date` Date,
  PRIMARY KEY (`ReplyID`),
  FOREIGN KEY(`PaperID`) REFERENCES Paper(`PaperID`)
                                    ON DELETE CASCADE
                                    ON UPDATE CASCADE,
  FOREIGN KEY(`UserID`) REFERENCES User(`UserID`)
                                    ON DELETE CASCADE
                                    ON UPDATE CASCADE,
  FOREIGN KEY(`ParentID`) REFERENCES Reply(`ReplyID`) 
                                    ON DELETE CASCADE
                                    ON UPDATE CASCADE
);

CREATE TABLE `Publishes` (
  `UserID` varchar(10) NOT NULL,
  `PaperID` varchar(10) NOT NULL,
  `UploaderID` varchar(10) NOT NULL,
  `Date` Date,
  `Conference` varchar(25),
  PRIMARY KEY (`PaperID`, `UserID`),
  FOREIGN KEY(`PaperID`) REFERENCES Paper(`PaperID`)
                                    ON DELETE CASCADE
                                    ON UPDATE CASCADE,
  FOREIGN KEY(`UserID`) REFERENCES User(`UserID`)
                                    ON DELETE CASCADE
                                    ON UPDATE CASCADE,
  FOREIGN KEY(`UploaderID`) REFERENCES User(`UserID`) 
                                    ON DELETE CASCADE
                                    ON UPDATE CASCADE
);

CREATE VIEW IF NOT EXISTS FullPaper[(Title, Category, Conference, Authors)] AS SELECT Title, Category, Conference, Name FROM (Paper LEFT JOIN User) LEFT JOIN Publishes
