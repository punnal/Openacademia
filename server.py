import sqlite3
from contextlib import closing
from flask import Flask, render_template, jsonify

app = Flask(__name__, static_folder="../static/dist",
            template_folder="../static")

DB = sqlite3.connect("openacademia.db")
CURSOR = DB.cursor()

def getID():
    return 1234567

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
def parse_request():
    data = request.data
    print("data: ", data)
    resp = CURSOR.execute(data.query).fetchall()
    print("response: ", resp)
    return jsonify(resp)

# @app.route('/signup', methods=['GET', 'POST'])
# def parse_request():
#     data = request.data
#     print("data: ", data)
    
#     result = CURSOR.execute(f"
#         SELECT email FROM 
#                             "
#     )

#     userID = getID()

#     resp = CURSOR.execute(f"
#         INSERT INTO User [(UserID, Email, Name, IsAuthor, Password)]
#         VALUES ({userID}, {data.email}, {data.name}, 0, {data.password});
#         ").fetchall()

#     resp = {"Success": True}
#     print("response: ", resp)
#     return jsonify(resp)
   

if __name__ == "__main__":
    app.run()
