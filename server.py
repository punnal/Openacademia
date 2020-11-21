import sqlite3
from contextlib import closing
from flask import Flask, render_template, jsonify

app = Flask(__name__, static_folder="../static/dist",
            template_folder="../static")

DB = sqlite3.connect("openacademia.db")
CURSOR = DB.cursor()


@app.route("/")
def index():
    return render_template("./build/index.html")


@app.route("/table/<table>")
def getTable(table):
    print("Fetching ", table)
    resp = CURSOR.execute(f"SELECT * FROM {table}").fetchall()
    print(resp)
    return jsonify(resp)


if __name__ == "__main__":
    app.run()
