let md = new Remarkable();

const chatroom = window.location.href;
const id = chatroom.split("-")[1];

setTitle("Chatroom " + id + " | FireChat");

addNewLine();

let settingsButton = addButton("chat settings", getCookie("theme") !== "light" ? "dark" : "light", "right");
settingsButton.setStyle("margin-right: 1%;");

addNewLine();
createAlertField();

const splitter = "||splitter||";

setCookie("tempUsername" + id, "");

let messageField = addMessageField("Type a message");
messageField.classes = "messageField";
messageField.position = "center";
messageField.update();

messageField.outerElement.style.position = "fixed";
messageField.outerElement.style.top = "90%";
messageField.outerElement.style.left = "50%";
messageField.outerElement.style.marginLeft = "-45%";

messageField.element.innerHTML = messageField.element.innerHTML.replaceAll("<input", "<textarea");

let joined = false;
let messages;
let messages_text = [];
let line_breaks = [];
let multiLineMode = false;
let chatroom_name;

firebase.database().ref("/chatrooms").on("value", snapshot => {
	// if the chatroom was already created
	if (snapshot.val()[id]) {
		// making the user join the chatroom
		if (!joined) {
			joined = true;
			const created_by = snapshot.val()[id]["Created_by"];
			const members = snapshot.val()[id]["Members"].split(splitter);
			const number_of_messages = snapshot.val()[id]["Number_of_messages"];
			const messages = snapshot.val()[id]["Messages"];
			const number_of_members = snapshot.val()[id]["Number_of_members"];
			chatroom_name = snapshot.val()[id]["Name"];
			let username;
			if (checkCookie("username")) {
				username = getCookie("username");
				setCookie("tempUsername" + id, username);
			} else if (checkCookie("tempUsername" + id)) {
				username = getCookie("tempUsername" + id);
			} else {
				username = "Guest " + (number_of_members + 1);
				setCookie("tempUsername" + id, username);
			}
			if (!members.includes(getCookie("username")) && !members.includes(getCookie("tempUsername" + id))) {
				firebase.database().ref("/chatrooms/" + id).set({
					Created_by: created_by,
					Members: snapshot.val()[id]["Members"] + splitter + username,
					Number_of_members: number_of_members + 1,
					Number_of_messages: number_of_messages,
					Messages: messages ? messages : {}
				});
			}
		}

		remove_messages();
		load_messages(snapshot.val()[id]);

	} else {
		setCookie("tempUsername" + id, "Guest 1", 100);
		copy_to_clipboard(chatroom);
		addAlert("Invite link has been copied to your clipboard! Share it with your friends and once they accept the invitation you will be able to chat with them.", "info");
		let username = checkCookie("username") ? getCookie("username") : "Guest " + 1;
		firebase.database().ref("/chatrooms/" + id).set({
			Created_by: username,
			Members: username,
			Number_of_members: 1,
			Number_of_messages: 0
		});
	}

});

document.onkeydown = async (e) => {
	messageField.element.focus();
	if (!e) e = windows.event;
	if (e.key === "Enter" && !multiLineMode) {
		send_message(messageField.element.value);
		messageField.element.value = "";
		messageField.element.blur();
	} else if (e.key === "Escape") {
		messageField.element.blur();
		multiLineMode = !multiLineMode;
	}
}

let get_info = () => {
	let number_of_messages, created_by, members, number_of_members, messages;
	firebase.database().ref("/chatrooms/" + id).on("value", (snapshot) => {
		number_of_messages = snapshot.val()["Number_of_messages"];
		created_by = snapshot.val()["Created_by"];
		members = snapshot.val()["Members"];
		number_of_members = snapshot.val()["Number_of_members"];
		messages = snapshot.val()["Messages"];
	});
	return [number_of_messages, created_by, members, number_of_members, messages];
}

let send_message = (message) => {

	if (!message.trim()) return;

	let number_of_messages, created_by, members, number_of_members, messages;
	firebase.database().ref("/chatrooms/" + id).on("value", snapshot => {
		number_of_messages = snapshot.val()["Number_of_messages"];
		created_by = snapshot.val()["Created_by"];
		members = snapshot.val()["Members"];
		number_of_members = snapshot.val()["Number_of_members"];
	});
	firebase.database().ref("/chatrooms/" + id + "/Messages/message" + (number_of_messages + 1)).set({
		Message: message,
		Sent_by: getCookie("tempUsername" + id)
	});
	firebase.database().ref("/chatrooms/" + id).on("value", snapshot => {
		messages = snapshot.val()["Messages"];
	});
	firebase.database().ref("/chatrooms/" + id).set({
		Created_by: created_by,
		Members: members,
		Number_of_members: number_of_members,
		Number_of_messages: number_of_messages + 1,
		Messages: messages
	});

}

let remove_messages = () => {
	messages_text.forEach((message) => {
		message.remove();
	});
	messages_text = [];
	line_breaks.forEach((line_break) => {
		line_break.remove();
	});
	line_breaks = [];
}

let load_messages = (snapshot) => {
	if (snapshot["Messages"] !== messages) {
		const number_of_messages = snapshot["Number_of_messages"];
		for (let i = 1; i <= number_of_messages; i++) {
			const msg = snapshot["Messages"]["message" + i];
			if (msg) {
				const message = addText(msg["Message"]);
				message.classes = "message";
				if (msg["Sent_by"] === getCookie("username") || msg["Sent_by"] === getCookie("tempUsername" + id)) {
					message.classes += " myMessage";
				}
				message.update();
				message.element.innerHTML = md.render(msg["Message"]).replaceAll("<p>", "").replaceAll("</p>", "");
				messages_text = [...messages_text, message];
				messages = snapshot["Messages"];
				let br = document.createElement("br");
				br.style.clear = "both";
				document.body.appendChild(br);
				line_breaks = [...line_breaks, br];
			}
		}
	}
	window.scrollTo(0, document.body.scrollHeight);
}

let add_chatroom = () => {
	let name, number_of_chatrooms, password, username, recent_chatrooms;
	let done1 = false, done2 = false, done3 = false, done4 = false;
	firebase.database().ref("/users/" + getCookie("username")).on("value", snapshot => {
		if (!done1) {
			done1 = true;
			name = snapshot.val()["Name"];
			number_of_chatrooms = snapshot.val()["Number_of_chatrooms"];
			password = snapshot.val()["Password"];
			username = snapshot.val()["Username"];
			recent_chatrooms = snapshot.val()["Chatrooms"];

			for (let key in recent_chatrooms) {
				if (recent_chatrooms[key]["Id"] === id) {
					[done2, done3, done4] = [true, true, true];
				}
			}

			if (!done2) {
				done2 = false;
				firebase.database().ref("/users/" + getCookie("username") + "/Chatrooms/chatroom" + (number_of_chatrooms + 1)).set({
					Id: id,
					Name: chatroom_name ? chatroom_name : id
				});
			}

			if (!done3) {
				done3 = false;
				firebase.database().ref("/users/" + getCookie("username")).on("value", snpshot => {
					recent_chatrooms = snpshot.val()["Chatrooms"];

					if (!done4) {
						done4 = true;
						firebase.database().ref("/users/" + getCookie("username")).set({
							Chatrooms: recent_chatrooms,
							Name: name,
							Number_of_chatrooms: number_of_chatrooms + 1,
							Password: password,
							Username: username
						});
					}
				});
			}
		}
	});
}

if (checkCookie("username")) {
	add_chatroom();
}

const [messageInColor, messageOutColor] = getCookie("theme") === "light" ? ["#c9c9c9", "#e3e3e3"] : ["var(--bs-dark)", "var(--bs-gray)"];

addStyle(`

.messageField {
	width: 90% !important;
}

body {
	margin-bottom: 17.5vh;
}

.message {
	display: inline-block;
	background-color: ${messageInColor};
	border-radius: 18px;
	padding: 8px 20px;
	max-width: 40%;
	margin-left: 5%;
	margin-right: 5%;
	margin-bottom: 0.1%;
}

.myMessage {
	background-color: ${messageOutColor};
	float: right;
}

`);
