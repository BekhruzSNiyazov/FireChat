let chatroom = window.location.href;
let id = chatroom.split("-")[1];

setTitle("Chatroom " + id + " | FireChat");

addNewLine();
createAlertField();

let splitter = "||splitter||";

setCookie("tempUsername" + id, "");

firebase.database().ref("/chatrooms").on("value", function(snapshot) {
	// if the chatroom was already created
	if (snapshot.val()[id]) {
		let numberOfMembers = snapshot.val()[id]["NumberOfMembers"];
		const lastJoined = snapshot.val()[id]["Members"].split(splitter)[numberOfMembers - 1];
		addAlert(`${lastJoined} has joined the chatroom`, "primary");
		const started = snapshot.val()[id]["Started"];
		const members = snapshot.val()[id]["Members"].split(splitter);
		let username;
		if (checkCookie("username")) username = getCookie("username");
		else if (checkCookie("tempUsername" + id)) username = getCookie("tempUsername" + id);
		else {
			username = "Guest " + (numberOfMembers + 1);
			setCookie("tempUsername" + id, username);
		}
		if (!members.includes(getCookie("username")) && !members.includes(getCookie("tempUsername" + id))) {
			firebase.database().ref("/chatrooms/" + id).set({
				Started: started,
				Members: snapshot.val()[id]["Members"] + splitter + username,
				NumberOfMembers: numberOfMembers + 1
			});
		}
	} else {
		setCookie("tempUsername" + id, "Guest 1", 100);
		copy_to_clipboard(chatroom);
		addAlert("Invite link has been copied to your clipboard! Share it with your friends and once they accept the invitation you will be able to chat with them.", "primary");
		let username = checkCookie("username") ? getCookie("username") : "Guest " + 1;
		firebase.database().ref("/chatrooms/" + id).set({
			Started: username,
			Members: username,
			NumberOfMembers: 1
		});
	}
});
