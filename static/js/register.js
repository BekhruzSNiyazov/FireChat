setTitle("Register | FireChat");

addNewLine();

addHeading("Register", 6, "center");

addNewLine();

let usernameField = addInput("text", "Username");
let nameField = addInput("text", "Name");
let passwordField = addInput("password", "Password");
let confirmPasswordField = addInput("password", "Confirm password");

const inputFields = [usernameField, nameField, passwordField, confirmPasswordField];
inputFields.forEach((inputField) => {
	inputField.position = "center";
	inputField.classes = "form-input";
	inputField.update();
});

let registerButton = addButton("register", "primary", "center");
registerButton.onclick = () => {
	if (checkCookie("username")) {
		alert("You are already registered!");
		window.location.replace("/");
	}
	let done = false;
	let username = usernameField.element.value;
	let _name = nameField.element.value;
	let password = passwordField.element.value;
	let confirmPassword = confirmPasswordField.element.value;
	if (username !== "" && _name != "" && password != "" && confirmPassword != "") {
		if (password == confirmPassword) {
			firebase.database().ref("/").on("value", function(snapshot) {
				if (snapshot.val()["users"][username] == undefined) {
					done = true;
					firebase.database().ref("/users/" + username).set({
						Username: username,
						Name: _name,
						Password: password
					});
					setCookie("username", username, 100);
					setCookie("name", _name, 100);
					window.location.replace("/");
				} else {
					if (!done) {
						alert("A user with that username already exists! Try a different username.")
						usernameField.element.value = "";
					}
				}
			});
		} else {
			alert("Passwords do not match! Please, try again.");
		}
	} else {
		alert("You should fill in all input fields!");
	}
};
registerButton.update();

setCookie("theme", "light", 100);

addStyle(".form-input { margin-bottom: 2vh !important; }");
