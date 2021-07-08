// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
	apiKey: "AIzaSyB2mYDspBjZUl6d5T3X4bOLGGVR-u3S1zs",
	authDomain: "firechat-a8cc6.firebaseapp.com",
	databaseURL: "https://firechat-a8cc6-default-rtdb.firebaseio.com",
	projectId: "firechat-a8cc6",
	storageBucket: "firechat-a8cc6.appspot.com",
	messagingSenderId: "515510745905",
	appId: "1:515510745905:web:8b48b1c862271f62670e10",
	measurementId: "G-VBMN7C30S3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const navbar = createNavBar();
navbar.setTitle("FireChat");

navbar.addItem("home", "Home");
navbar.addItem("link", ["Settings", "/settings"]);

if (!checkCookie("username")) {
	navbar.addItem("button", ["primary", "register", "window.location.replace(`register`)"], "right", "nav-button");
	navbar.addItem("button", ["primary", "sign in", "window.location.replace(`sign-in`)"], "right", "nav-button");
}

navbar.addItem("button", ["primary", "create chatroom", "window.location.replace(`create-chatroom`)"], "right");

addStyle(`
.nav-button { margin-right: 1vw !important; }

* {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
}

h1, h2, h3, h4, h5, h6 {
	font-weight: 900 !important;
}
`);

let copy_to_clipboard = (text) => {
	const copy = document.createElement("textarea");
	document.body.appendChild(copy);
	copy.value = text;
	copy.select();
	document.execCommand("copy");
	document.body.removeChild(copy);
}

let generate_id = () => {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

if (getCookie("theme") !== "light" || !getCookie("theme")) {
	toggleTheme();
}
