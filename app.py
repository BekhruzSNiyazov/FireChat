from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
	return render_template("index.html")

@app.route("/register")
def register():
	return render_template("register.html")

@app.route("/sign-in")
def sign_in():
	return render_template("sign_in.html")

@app.route("/create-chatroom")
def create_chatroom():
	return render_template("create_chatroom.html")

@app.route("/chat-<_id>")
def chatroom(_id):
	return render_template("chatroom.html");

@app.route("/settings")
def settings():
	return render_template("settings.html")

if __name__ == "__main__":
	app.run(debug=True) 
