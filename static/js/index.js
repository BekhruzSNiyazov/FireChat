setTitle("Welcome to FireChat");

let heading;

if (!checkCookie("username")) {
	heading = addHeading("Welcome to FireChat", 6, "center");
} else {
	heading = addHeading("Hello, " + getCookie("name") + "!", 6, "center");
}

heading.setStyle("margin-top: 20vh");
