import sqlite3
from contextlib import closing
from flask import Flask, render_template

app = Flask(__name__, static_folder="../static/dist",
            template_folder="../static")


@app.route("/")
def index():
    return render_template("./build/index.html")


@app.route("/hello")
def hello():
    return "Hello World!"


if __name__ == "__main__":
    with closing(sqlite3.connect("openacademia.db")) as db:
        cursor = db.cursor()
    app.run()
