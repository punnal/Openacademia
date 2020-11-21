import sqlite3
from contextlib import closing

category = [
    "Mathematics",
    "Physics",
    "Computer Science",
    "Chemistry",
    "Biology",
    "Economics",
    "Other"
]

with closing(sqlite3.connect("openacademia.db")) as DB:
    CURSOR = DB.cursor()
    for i in range(10):
        CURSOR.execute(
            f"INSERT INTO Paper VALUES ('paper_{i}', 'title_{i}', '{category[i%7]}', 'id_{i}')"
        )
    DB.commit()
