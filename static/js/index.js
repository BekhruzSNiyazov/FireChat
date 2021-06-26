setTitle("Welcome to FireChat");

addNewLine();

if (!checkCookie("username")) {
	addHeading("Welcome to FireChat", 6, "center");
} else {
	addHeading("Hello, " + getCookie("name") + "!", 6, "center");
}
