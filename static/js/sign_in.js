setTitle("Sign in | FireChat");

addNewLine();

addHeading("Sign in", 6, "center");

addNewLine();

let usernameField = addInput("text", "Username");
let passwordField = addInput("password", "Password");

const inputFields = [usernameField, passwordField];
inputFields.forEach((inputField) => {
	inputField.position = "center";
	inputField.classes = "form-input";
	inputField.update();
});

let signInButton = addButton("sign in", "primary", "center");
signInButton.onclick = () => {
	if (checkCookie("username")) {
        alert("You are already signed in!");
        window.location.replace("/");
    }

	let username = usernameField.element.value;
	let password = passwordField.element.value;

    if (username === "" || password === "") {
        alert("You must fill in all input fields!")
    } else {
        firebase.database().ref("/users/" + username).on("value", snapshot => {
            if (!snapshot.val()) {
                alert("Username or password is incorrect. Try again.");
            } else {
                if (snapshot.val()["Password"] === password) {
                    setCookie("username", username, 100);
                    setCookie("name", snapshot.val()["Name"], 100);
					window.location.replace("/");
                } else {
                    alert("Username or password is incorrect. Try again.");
                }
            }
        });
    }
};
signInButton.update();

addStyle(".form-input { margin-bottom: 2vh !important; }");
