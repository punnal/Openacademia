import sqlite3
from contextlib import closing
from flask import Flask, render_template, jsonify, request
import secrets
import json


app = Flask(__name__, static_folder="../static/dist",
            template_folder="../static")

DB = sqlite3.connect("openacademia.db")
CURSOR = DB.cursor()


def getID():
    return secrets.token_urlsafe(10)


def getSessionID():
    return secrets.token_urlsafe(64)


@app.route("/")
def index():
    return render_template("./build/index.html")


@app.route("/table/<table>")
def getTable(table):
    print("Fetching ", table)
    resp = CURSOR.execute(f"SELECT * FROM {table}").fetchall()
    print(resp)
    return jsonify(resp)


@app.route('/query', methods=['GET', 'POST'])
def exec_query():
    data = request.data.decode('utf-8')
    data = (json.loads(data))["data"]
    print("data: ", data)
    cursor = CURSOR.execute(data["query"])
    names = list(map(lambda x: x[0], cursor.description))
    rows = cursor.fetchall()
    resp = {"columns": names, "rows": rows}
    print("response: ", resp)
    return jsonify(resp)


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    data = request.data.decode('utf-8')
    data = (json.loads(data))["data"]
    print("data: ", data)

    result = CURSOR.execute(
        f'SELECT * FROM User WHERE email="{data["email"]}"').fetchall()

    userID = getID()

    if(not result):
        resp = CURSOR.execute(
            f'INSERT INTO User VALUES ("{userID}", "{data["email"]}", "{data["name"]}", "0", "{data["password"]}");').fetchall()

        sessionID = getSessionID()
        resp = CURSOR.execute(
            f'INSERT INTO Sessions VALUES ("{sessionID}", "{userID}");').fetchall()

        resp = {"Success": True, "SessionID": sessionID,
                "UserID": userID, "name": data["name"]}
        print("response: ", resp)
        return jsonify(resp)
    resp = {"Success": False, "Msg": "User already exists"}
    return jsonify(resp)


@app.route('/signin', methods=['GET', 'POST'])
def signin():
    data = request.data.decode('utf-8')
    data = (json.loads(data))["data"]
    print("data: ", data)

    result = CURSOR.execute(
        f'SELECT * FROM User WHERE email="{data["email"]}" AND password="{data["password"]}"').fetchall()

    if(result):
        resp = result
        print("response: ", resp)
        return jsonify(resp)
    else:
        resp = {"Success": False,
                "Msg": "Wrong password or account does not exists"}
        return jsonify(resp)


if __name__ == "__main__":
    app.run(threaded=False)
