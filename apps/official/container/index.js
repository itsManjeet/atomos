const Menu = require("@api/Menu"), Registry = require("@api/Registry"), Shell = require("@api/Shell");
let container = document.createElement("main");
container.className = "flex-grow-1";
container.addEventListener("mousedown", () => {
	const {AppWindow} = require(`@api`);
	if (AppWindow.getFocusedWindow()) AppWindow.getFocusedWindow().blur();
});
container.addEventListener("contextmenu", () => {
	let as = (Registry.get("system.autostart") || [])[0];
	new Menu([{
		icon: "image-outline",
		label: "Wallpapers",
		click() {
			Shell.openSettings("display-wallpaper");
		}
	}, {
		icon: "arrow-right",
		label: "Next wallpaper",
		visible: as ? as.src.includes("aclock") : false, //FIXME
		click() {
			new Worker(as.src);
		}
	}]).popup();
});
document.body.prepend(container);