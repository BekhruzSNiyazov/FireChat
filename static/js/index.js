let chatrooms_list = [];

let display_chatrooms = () => {
	remove_chatrooms();
	let heading = addHeading("Recent Chatrooms", 5);
	heading.setStyle("margin-left: 5%;");
	firebase.database().ref("/users/" + getCookie("username")).on("value", snapshot => {
		const chatrooms = snapshot.val()["Chatrooms"];
		const number_of_chatrooms = snapshot.val()["Number_of_chatrooms"];

		for (let i = number_of_chatrooms; i > 0; i--) {
			const chatroom = chatrooms["chatroom" + i];
			if (chatroom) {
				if (!chatrooms_list.includes(chatroom["Id"])) {
					let chatroom_link = addLink(chatroom["Name"], "chat-" + chatroom["Id"]);
					chatroom_link.setStyle("margin-left: 10%;");
					chatrooms_list = [...chatrooms_list, chatroom["Id"]];
					addNewLine();
				}
			}
		}
		addHTML("<hr>");
	});
}

let remove_chatrooms = () => {
	chatrooms_list.forEach(chatroom => {
		chatroom.remove();
	});
	chatrooms_list = [];
}

let heading;
if (!checkCookie("username")) {
	setTitle("Welcome to FireChat");
	heading = addHeading("Welcome to FireChat", 6, "center");
	heading.setStyle("margin-top: 20vh");
} else {
	setTitle("Recent Chatrooms | FireChat");
	addNewLine();
	heading = addHeading("Hello, " + getCookie("name") + "!", 6, "center");
	addHTML("<hr>");
	display_chatrooms();
}
