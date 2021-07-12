class Link extends basicUIObject {
	constructor(text, link, position = "left") {
		super();
		this.text = text;
		this.link = link;
		this.position = position;
		this.color = "";
		this.theme = websiteTheme;
		this.hiddenId = "text-" + textCount++;
		let positions = [" left", " right", " center"];
		if (!positions.includes(" " + position)) {
			throw `Position ${position} is not recognized. Here is a list of available positions:${positions}`;
		}
		if (!["light", "dark"].includes(this.theme)) {
			throw `Theme can only be "light" or "dark"`;
		}
	}

	// this function adds text to the body
	add(visible = true) {
		if (!this.added) {
			this.wrapper = this.wrap();
			this.element = document.createElement("a");
			this.wrapper.appendChild(this.element);
			if (visible) body.appendChild(this.wrapper);
			this.added = true;
		} else {
			this.outerElement.style.display = "block";
		}
		this.removed = false;

		manageTheme(this.element, this.theme, false);
		this.element.className += " " + this.classes;
		this.element.id = this.id;
		this.element.innerText = this.text;
		this.element.href = this.link;
		this.outerElement = this.element;
		this.setStyle(this.style + `color: ${this.color} !important; text-align: ${this.position} !important;`);
	}
}

let addLink = (text, link, position = "left", color = "") => {
	let element = new Link(text, link, position, color ? color : fontColor);
	element.add();
	return element;
}
