const chatroom = window.location.href;
const id = chatroom.split("-")[1];

setTitle("Chatroom " + id + " | FireChat");

addNewLine();
createAlertField();

const splitter = "||splitter||";

setCookie("tempUsername" + id, "");

let messageField = addInput("text", "Type a message");
messageField.classes = "messageField";
messageField.position = "center";
messageField.update();

messageField.outerElement.style.position = "fixed";
messageField.outerElement.style.top = "90%";
messageField.outerElement.style.left = "50%";
messageField.outerElement.style.marginLeft = "-45%";

let notified_about = [];
let joined = false;
let messages;
let received_messages = [];

let messages_text = [];

firebase.database().ref("/chatrooms").on("value", (snapshot) => {
	// if the chatroom was already created
	if (snapshot.val()[id]) {

		// notifying if a new user has joined the chatroom
		let number_of_members = snapshot.val()[id]["Number_of_members"];
		const lastJoined = snapshot.val()[id]["Members"].split(splitter)[number_of_members - 1];
		if (!notified_about.includes(lastJoined)) {
			addAlert(`${lastJoined} has joined the chatroom`, "info");
			notified_about = [...notified_about, lastJoined];
		}

		// making the user join the chatroom
		if (!joined) {
			const created_by = snapshot.val()[id]["Created_by"];
			const members = snapshot.val()[id]["Members"].split(splitter);
			const number_of_messages = snapshot.val()[id]["Number_of_messages"];
			let username;
			if (checkCookie("username")) {
				username = getCookie("username");
				setCookie("tempUsername" + id, username);
			} else if (checkCookie("tempUsername" + id)) username = getCookie("tempUsername" + id);
			else {
				username = "Guest " + (number_of_members + 1);
				setCookie("tempUsername" + id, username);
			}
			if (!members.includes(getCookie("username")) && !members.includes(getCookie("tempUsername" + id))) {
				firebase.database().ref("/chatrooms/" + id).set({
					Created_by: created_by,
					Members: snapshot.val()[id]["Members"] + splitter + username,
					Number_of_members: number_of_members + 1,
					Number_of_messages: number_of_messages
				});
			}
			joined = true;
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
	let keyCode = e.code || e.key;
	if (keyCode === "Enter") {
		send_message(messageField.element.value);
		messageField.element.value = "";
	}
}

let send_message = (message) => {

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
}

let load_messages = (snapshot) => {
	if (snapshot["Messages"] !== messages) {
		const number_of_messages = snapshot["Number_of_messages"];
		for (let i = 0; i < number_of_messages; i++) {
			const msg = Object.values(snapshot["Messages"])[i];
			const message = addText(msg["Message"], "center");
			messages_text = [...messages_text, message];
			messages = snapshot["Messages"];
		}
	}
}

addStyle(`
.messageField {
	width: 90% !important;
}`);
