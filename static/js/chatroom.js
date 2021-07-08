class MsgField extends basicUIObject {
	constructor(placeholder) {
		super();
		this.placeholder = placeholder;
		this.value = "";
		this.position = "left";
		this.theme = websiteTheme;
		this.hiddenId = "input-" + inputCount++;
		if (!["light", "dark"].includes(this.theme)) {
			throw `Theme can only be "light" or "dark"`;
		}
	}

	// this function adds input to the body
	add(visible = true) {
		this.classes = " " + this.classes + " ";
		let createOuter = false;
		if (!this.added) {
			this.wrapper = this.wrap();
			this.element = document.createElement("textarea");
			this.element.rows = 1;
			this.outerElement = document.createElement("div");
			this.outerElement.id = this.hiddenId + "Outer";
			if (visible) body.appendChild(this.wrapper);
			createOuter = true;
			this.added = true;
		} else {
			this.outerElement.style.display = "block";
		}
		this.removed = false;

		this.outerElement.className = "form-outline" + (!this.width ? " short-input " : "");
		if (this.position === "center")
			this.outerElement.style.margin = "auto";
		else if (this.position === "right") {
			this.outerElement.style.marginRight = "0";
			this.outerElement.style.marginLeft = "auto";
		}
		this.outerElement.className += " " + this.classes;

		this.element.id = this.id + " " + this.hiddenId + "forLabel for";
		this.element.value = this.value;
		if (!this.width) {
			this.element.className += " short-input";
		} else {
			this.element.style.width = this.width;
		}
		this.element.className += " form-control " + this.classes;

		this.label = document.createElement("label");
		this.label.className = "form-label";
		this.label.htmlFor = this.hiddenId + "forLabel";
		this.label.innerHTML = this.placeholder;

		if (createOuter) {
			this.outerElement.appendChild(this.element);
			this.outerElement.appendChild(this.label);
			this.wrapper.appendChild(this.outerElement);
		}

		manageTheme(this.outerElement, this.theme);
		if (this.theme === "light") {
			this.outerElement.removeChild(this.outerElement.getElementsByTagName("label")[0]);
			this.label.className += " text-dark";
			this.outerElement.appendChild(this.label);
			this.element.className += " text-dark";
		} else {
			this.outerElement.removeChild(this.outerElement.getElementsByTagName("label")[0]);
			this.label.className += " text-light";
			this.outerElement.appendChild(this.label);
			this.element.className += " text-light";
		}

		this.setStyle(this.style);
	}
}

let addMessageField = (placeholder = "") => {
	let msgField = new MsgField(placeholder);
	msgField.add();
	return msgField;
}

let md = new Remarkable();

const chatroom = window.location.href;
const id = chatroom.split("-")[1];

setTitle("Chatroom " + id + " | FireChat");

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
let received_messages = [];
let messages_text = [];
let line_breaks = [];
let multiLineMode = false;

firebase.database().ref("/chatrooms").on("value", (snapshot) => {
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
	firebase.database().ref("/chatrooms/" + id).on("value", (snapshot) => {
		number_of_messages = snapshot.val()["Number_of_messages"];
		created_by = snapshot.val()["Created_by"];
		members = snapshot.val()["Members"];
		number_of_members = snapshot.val()["Number_of_members"];
	});
	firebase.database().ref("/chatrooms/" + id + "/Messages/message" + (number_of_messages + 1)).set({
		Message: message,
		Sent_by: getCookie("tempUsername" + id)
	});
	firebase.database().ref("/chatrooms/" + id).on("value", (snapshot) => {
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
	line_breaks.forEach((line_break) => {
		line_break.remove();
	});
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
