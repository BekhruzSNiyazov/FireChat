setTitle("Settings | FireChat");

addNewLine();

addHeading("Settings", 6);

addHTML("<hr>");

addHeading("Theme", 5);

addNewLine();

let text = "change the app theme to ";
let themeButton = addButton(getCookie("theme") === "light" ? text + "dark" : text + "light", getCookie("theme") === "light" ? "dark" : "light");
themeButton.onclick = () => {
	toggleTheme();
	const currentTheme = getCookie("theme") !== "" ? getCookie("theme") : "light";
	const theme = currentTheme === "dark" ? "light" : "dark";
	themeButton.text = `change the app theme to ${currentTheme}`;
	themeButton.type = currentTheme;
	themeButton.update();
	setCookie("theme", theme);
};
themeButton.classes = " button";
themeButton.update();

if (checkCookie("username")) {
	addHTML("<hr>");

	addHeading("Account", 5);

	addNewLine();

	let signOutButton = addButton("sign out", "danger");
	signOutButton.onclick = () => {
		setCookie("username", "");
		setCookie("name", "");
		setCookie("tempUsername", "");
		window.location.replace("/");
	}
	signOutButton.classes = " button";
	signOutButton.update();
}

addStyle(`

h1, h2 {
	margin-left: 5%;
}

.button {
	margin-left: 10%;
}

`);
