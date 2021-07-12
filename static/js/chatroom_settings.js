const id = window.location.href.split("/")[4];

setTitle("Chatroom Settings | FireChat");

addNewLine();

createAlertField();

let backButton = addButton("<i class=\"fas fa-arrow-left\"></i>", getCookie("theme") !== "light" ? "dark" : "light");
backButton.onclick = () => {
	window.location.replace("/chat-" + id);
}
backButton.update();
backButton.setStyle("margin-left: 5vw; margin-right: 1vw;");
backButton.wrapper.style.display = "inline-block";
backButton.wrapper.style.verticalAlign = "top";

let heading = addHeading("Chatroom Settings", 6);
heading.wrapper.style.display = "inline-block";
heading.wrapper.style.verticalAlign = "middle";

addHTML("<hr>");

addNewLine();

addHeading("Change the name of the chatroom", 5);

addNewLine();

let chatroom_name = addInput("text", "Enter the name of the chatroom");
chatroom_name.classes = "chatroomName";
chatroom_name.update();
chatroom_name.outerElement.style.marginLeft = "7vw";
chatroom_name.wrapper.style.display = "inline-block";

let save_button = addButton("save", "primary");
save_button.onclick = () => {
	if (checkCookie("username")) {
		let [done1, done2] = [false, false];
		firebase.database().ref("/users/" + getCookie("username") + "/Chatrooms").on("value", snapshot => {
			if (!done1) {
				done1 = true;
				let chatrooms = snapshot.val();
				for (let key in chatrooms) {
					if (chatrooms[key]["Id"] === id) {
						if (!done2) {
							done2 = true;
							firebase.database().ref("/users/" + getCookie("username") + "/Chatrooms/" + key).set({
								Id: id,
								Name: chatroom_name.element.value
							});
						}
						addAlert("Saved!", "info");
						break;
					}
				}
			}
		});
	}
}
save_button.update();
save_button.wrapper.style.display = "inline-block";
save_button.setStyle("margin-left: 1vw;");

addStyle(`

h2 {
	margin-left: 5%;
}

.button {
	margin-left: 7%;
}

.chatroomName {
	width: 25vw;
}

`);
