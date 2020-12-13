import sqlite3
from contextlib import closing
from flask import Flask, render_template, jsonify, request
import secrets
import json
from datetime import date


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


@app.route('/reply', methods=['GET', 'POST'])
def reply():
    data = request.data.decode('utf-8')
    data = (json.loads(data))["data"]
    print("data: ", data)

    replyID = getID()
    today = date.today()
    d1 = today.strftime("%Y-%m-%d")

    CURSOR.execute(
        f'INSERT INTO Reply VALUES ("{replyID}", "{data["reply"]}", "{data["userId"]}", "{data["paperID"]}", "{data["parentID"]}", "{d1}");').fetchall()
    resp = {"success": True}
    return jsonify(resp)

@app.route('/deletereply', methods=['GET', 'POST'])
def deleteReply():
    data = request.data.decode('utf-8')
    data = (json.loads(data))["data"]
    print("data: ", data)

    CURSOR.execute(
        f'DELETE FROM Reply WHERE ReplyID="{data["replyID"]}";').fetchall()
    resp = {"success": True}
    return jsonify(resp)

@app.route('/updatereply', methods=['GET', 'POST'])
def updateReply():
    data = request.data.decode('utf-8')
    data = (json.loads(data))["data"]
    print("data: ", data)

    CURSOR.execute(
        f'UPDATE Reply SET Reply="{data["Reply"]}" WHERE ReplyID="{data["replyID"]}";').fetchall()
    resp = {"success": True}
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

        resp = {"success": True, "sessionID": sessionID,
                "userID": userID, "name": data["name"]}
        print("response: ", resp)
        return jsonify(resp)
    resp = {"success": False, "msg": "User already exists"}
    return jsonify(resp)


@app.route('/signin', methods=['GET', 'POST'])
def signin():
    data = request.data.decode('utf-8')
    data = (json.loads(data))["data"]
    print("data: ", data)

    result = CURSOR.execute(
        f'SELECT * FROM User WHERE email="{data["email"]}" AND password="{data["password"]}"').fetchall()[0]

    print("result", result)
    if(result):
        resp = {"success": True,
                "name": result[2], "email": result[1], "userid": result[0]}
        print("response: ", resp)
        return jsonify(resp)
    else:
        resp = {"success": False,
                "msg": "Wrong password or account does not exists"}
        return jsonify(resp)

@app.route('/updatepassword', methods=['GET', 'POST'])
def updatePassword():
    data = request.data.decode('utf-8')
    data = (json.loads(data))["data"]
    print("data: ", data)

    # result = CURSOR.execute(
    #     f'SELECT sessionID FROM Sessions WHERE userID="{data["userID"]}"').fetchall()
    # print(result)

    # if(result and result == data["sessionID"]):
    result = CURSOR.execute(
        f'SELECT password FROM User WHERE userID="{data["userID"]}"').fetchall()[0][0]
    print(result)
    if(result and result == data["password"]):
        CURSOR.execute(
            f'UPDATE User SET password="{data["newPassword"]}" WHERE userID="{data["userID"]}";').fetchall()

        resp = {"success": True,
                "msg": "Sucess"}
        return jsonify(resp)

    resp = {"success": False,
            "msg": "Some error occured"}
    return jsonify(resp)

@app.route('/updatepaper', methods=['GET', 'POST'])
def updatePaper():
    data = request.data.decode('utf-8')
    data = (json.loads(data))["data"]
    print("data: ", data)
    today = date.today()
    d1 = today.strftime("%Y-%m-%d")

    CURSOR.execute(
        f'UPDATE Publishes SET Conference="{data["Conference"]}", Date="{d1}" WHERE PaperID="{data["PaperID"]}";').fetchall()
    
    CURSOR.execute(
        f'UPDATE Paper SET Title="{data["Title"]}, Category="{data["Category"]}" WHERE PaperID="{data["PaperID"]}";').fetchall()
    resp = {"success": True}
    return jsonify(resp)

@app.route('/deletepaper', methods=['GET', 'POST'])
def deletePaper():
    data = request.data.decode('utf-8')
    data = (json.loads(data))["data"]
    print("data: ", data)

    CURSOR.execute(
        f'DELETE FROM Publishes WHERE PaperID="{data["PaperID"]}";').fetchall()
    CURSOR.execute(
        f'DELETE FROM Paper WHERE PaperID="{data["PaperID"]}";').fetchall()
    
    resp = {"success": True}
    return jsonify(resp)

    
if __name__ == "__main__":
    app.run(threaded=False)
    resp = {"success": True}
    return jsonify(resp)

    
if __name__ == "__main__":
    app.run(threaded=False)
