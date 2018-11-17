//const fs = require("fs");
const path = require("path");
setTitle("Display")
let main = document.createElement("main");
root.append(main)

let list = document.createElement("section");
list.className = "list-group flex-shrink-0 rounded-0";
list.wallpaper = newSmallListItem({
	color: "var(--success)",
	icon: "image-filter-hdr",
	label: "Wallpaper",
	click: e => openSection("display-wallpaper")
});
list.themes = newSmallListItem({
	color: "var(--warning)",
	icon: "brush",
	label: "Themes"
});
list.wm = newSmallListItem({
	color: "var(--primary)",
	icon: "transition",
	label: "Effects"
});
list.generalLabel = newSmallListItem({
	label: "General settings",
	type: "header"
});
list.darkMode = newSmallListItem({
	label: "Dark mode",
	sublabel: "EXPERIMENTAL. Restart needed.",
	type: "checkbox",
	checked: Registry.get("system.isDarkMode") || false,
	click(checked) {
		Registry.set("system.isDarkMode", checked);
		new Snackbar({
			message: "UI restart is needed to apply changes",
			buttonText: "Restart",
			buttonColor: "var(--danger)",
			timeout: 1000 * 60 * 60 * 24,
			click() {
				require("electron").remote.getCurrentWindow().reload();
			}
		})
	}
});
list.thumbEnabled = newSmallListItem({
	label: "Thumbnails",
	sublabel: "View small shots of running apps",
	type: "checkbox",
	checked: Registry.get("system.enableThumbnails"),
	click(checked) {
		Registry.set("system.enableThumbnails", checked);
	}
});
list.menuIcons = newSmallListItem({
	label: "Show icons in menus",
	type: "checkbox",
	checked: Registry.get('system.showMenuIcons') !== false,
	click(checked) {
		Registry.set("system.showMenuIcons", checked);
	}
});
list.append(list.wallpaper, list.generalLabel, list.darkMode, list.thumbEnabled, list.menuIcons);
main.append(list);