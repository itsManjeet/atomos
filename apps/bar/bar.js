const fs = require('fs').promises, path = require("path");
let registry = new Registry("taskbar");
if(!Registry.get("taskbar.items"))
	Registry.set('taskbar.items', ["start", "launcher", "tasker", "tray"]);
let autoHide = Registry.get("taskbar.autoHide") || false;
registry.on("changed", updatePosition);
render();

function render() {
	Elements.Bar = document.createElement("taskbar");
	Elements.BarItems = {};
	loadPlugins();
	Elements.Bar.className = "px-2 pt-1 pb-2 d-flex flex-nowrap mt-auto w-100";
	Elements.Bar.transition = "bottom 1s ease";
	updatePosition();
	new ResizeObserver(updatePosition).observe(Elements.Bar);
	Elements.Bar.menu = new Menu(null, [{
		type: "checkbox",
		label: "Automatically hide taskbar",
		checked: autoHide || false,
		click(checked) {
			Registry.set("taskbar.autoHide", !autoHide)
		}
	}]);
	Elements.Bar.addEventListener("contextmenu", () => {
		Elements.Bar.menu.popup();
	});
	root.appendChild(Elements.Bar);
}

function showBar() {
	Elements.Bar.style.bottom = CSS.px(0);
}

function hideBar() {
	Elements.Bar.style.bottom = "-" + CSS.px(Elements.Bar.offsetHeight - 4);
}

function updatePosition() {
	autoHide = Registry.get("taskbar.autoHide") || false;
	Elements.Bar.classList.toggle("position-absolute", autoHide);
	if (autoHide) {
		hideBar();
		Elements.Bar.addEventListener("mouseenter", showBar);
		Elements.Bar.addEventListener("mouseleave", hideBar);
	}
	else {
		showBar();
		Elements.Bar.removeEventListener("mouseenter", showBar);
		Elements.Bar.removeEventListener("mouseleave", hideBar);
	}
}

async function loadPlugins() {
	let items = Registry.get("taskbar.items");
	for(const id of items.values()) {
		let file = await fs.readFile(path.join(osRoot, "apps", id, "package.json"), "utf-8");
		let pkg = JSON.parse(file)
		if(pkg.type !== "bar-plugin")
			return;
		try {
			let script = await fs.readFile(path.join(osRoot, "apps", id, pkg.main), "utf-8");
			let plugin = document.createElement("plugin");
			Elements.BarItems[id] = await new AsyncFunction("root", "__dirname", script)
			(plugin, path.join(osRoot, "apps", id));
			plugin.id = id;
			Elements.Bar.appendChild(plugin);
		} catch(e) {
			console.error(id, "was not loaded.", e);
		}
	}
}