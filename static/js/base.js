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

if (!checkCookie("username")) {
	navbar.addItem("button", ["primary", "register", "window.location.replace(`register`)"], "right", "nav-button");
	navbar.addItem("button", ["primary", "sign in", "window.location.replace(`sign-in`)"], "right", "nav-button");
} else {
	navbar.addItem("button", [
		"danger",
		"sign out",
		"setCookie(`username`, ``); setCookie(`name`, ``); window.location.replace(`/`);"
	], "right", "nav-button");
}

navbar.addItem("button", ["primary", "create chatroom", "window.location.replace(`create-chat-room`)"], "right");

addStyle(".nav-button { margin-right: 1vw !important; }");
