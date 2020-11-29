import sqlite3
from contextlib import closing
from datetime import date

today = date.today()
d1 = today.strftime("%Y-%m-%d")


category = [
    "Mathematics",
    "Physics",
    "Computer Science",
    "Chemistry",
    "Biology",
    "Economics",
    "Other"
]

conference = [
    "ICLR",
    "ACM SIGMOD",
    "VLDB",
    "USENIX Security",
    "PoPETS",
    "ICML",
    "WWW"
]

with closing(sqlite3.connect("openacademia.db")) as DB:
    CURSOR = DB.cursor()
    for i in range(10):
        CURSOR.execute(
            f"INSERT INTO Publishes VALUES ('id_{i}', 'paper_{i}', 'id_{i}', '{d1}', '{conference[i%7]}')"
        )
    DB.commit()
