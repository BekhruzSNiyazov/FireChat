setTitle("Create Chatroom | FireChat");

addNewLine();

addHeading("Create Chatroom", 6, "center");

addNewLine();

let inviteLinkButton = addButton("get invite link", "primary", "center");

inviteLinkButton.onclick = () => {
	window.location.replace("chat-" + generate_id());
}

inviteLinkButton.update();
