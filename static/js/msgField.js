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
