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

if __name__ == "__main__":
	app.run(debug=True) 
