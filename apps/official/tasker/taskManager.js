const Shell = require(`@api/Shell`);
const Registry = require(`@api/Registry`);
const Menu = require("@api/Menu");
const AppWindow = require("@api/WindowManager");
let tasks = document.createElement("div");
tasks.style.cssText = "background: rgba(0,0,0,0.8); height: calc(100% - 90px); top: 29px; left:0;z-index:990";
tasks.className = "w-100 position-fixed fade px-3 d-none";
document.body.append(tasks);
try {
	body.className = "flex-grow-1 py-1";
} catch (e) {
}

class TaskManager {
	constructor(wID) {
		let _this = this;
		this.window = AppWindow.fromId(wID);
		this.task = document.createElement('button');
		if (Shell.isMobile) {
			this.mtask = document.createElement("div");
			this.mtask.className = "d-inline-flex flex-column text-white mt-2 mr-2";
			this.mtask.icon = document.createElement("icon");
			this.mtask.icon.className = "mdi mdi-24px lh-24 d-flex text-white mdi-" + this.window.options.icon;
			this.mtask.appName = document.createElement("div");
			this.mtask.appName.className = "flex-grow-1 text-center";
			this.mtask.header = document.createElement("div");
			this.mtask.header.className = "d-flex";
			this.mtask.dataset.id = this.window.id;
			this.mtask.thumb = new Image();
			this.mtask.thumb.style.width = "200px";
			this.mtask.thumb.className = "rounded";
			this.mtask.header.className = "d-flex mb-2";
			this.mtask.onclick = () => {
				this.window.show();
				TaskManager.hide();
			};
			this.mtask.header.append(this.mtask.icon, this.mtask.appName);
			this.mtask.append(this.mtask.header, this.mtask.thumb);
			tasks.append(this.mtask)
		}
		this.setTitle(this.window.options.title);
		this.task.className = "btn mr-3 position-relative shadow border-0 fade show rounded-max mdi mdi-24px lh-24 d-inline-flex text-white p-2 active";
		this.task.dataset.id = this.window.id;
		this.task.style.background = this.window.options.color;
		this.setIcon(this.window.options.icon);
		this.window.on("title-updated", title => this.setTitle(title));
		this.window.on("icon-updated", icon => this.setIcon(icon));
		(Elements.BarItems["official/tasker"] || body).appendChild(this.task);
		new Tooltip(this.task, {
			delay: 250
		});
		this.menu = new Menu([{
			label: "Maximize",
			id: "max",
			icon: "window-maximize",
			enabled: () => !this.window.isMaximized() && this.window.isMaximizable(),
			click: () => this.window.maximize()
		}, {
			label: "Restore",
			id: "res",
			icon: "window-restore",
			enabled: () => this.window.isMaximized() || this.window.isMinimized(),
			click: () => this.window.restore()
		}, {
			label: "Minimize",
			icon: "window-minimize",
			enabled: () => !this.window.isMinimized() && this.window.isMinimizable(),
			click: () => this.window.minimize()
		}, {
			type: "separator"
		}, {
			label: "Close",
			icon: "window-close",
			enabled: () => this.window.isClosable(),
			click: () => this.window.close()
		}]);
		this.task.addEventListener("contextmenu", function (e) {
			e.stopPropagation();
			_this.menu.renderMenu();
			_this.menu.popup({
				x: (_this.task.offsetLeft + _this.task.offsetWidth) / 2,
				y: window.innerHeight - _this.task.offsetHeight - 16
			});
			Elements.Bar.keepOpen(true);
			_this.menu.once("menu-will-close", () => Elements.Bar.keepOpen(false));
		});
		this.window.ui.header.addEventListener("contextmenu", function (e) {
			e.stopPropagation();
			_this.menu.renderMenu();
			_this.menu.popup();
		});
		this.window.ui.buttons.addEventListener("contextmenu", e => e.stopPropagation());
		this.task.addEventListener("click", function (e) {
			e.stopPropagation();
			_this.menu.closePopup();
			_this.window.show()
		});
		this.window.on('closed', function () {
			document.body.click();
			_this.task.classList.remove("show");
			setTimeout(() => _this.destroy(), Shell.ui.fadeAnimation)
		});
		this.window.on('blur', () => this.task.classList.remove("active"));
		this.window.on('focus', () => this.task.classList.add("active"));
		this.window.on('thumbnail-changed', () => this.setTitle());
		this.task.classList.add("active")
	}

	static show() {
		tasks.classList.remove("d-none");
		tasks.classList.add("show");
	}

	static toggle() {
		if (tasks.classList.contains("show")) TaskManager.hide(); else TaskManager.show();
	}

	static hide() {
		tasks.classList.remove("show");
		setTimeout(() => tasks.classList.add("d-none"), Shell.ui.fadeAnimation)
	}

	destroy() {
		this.task.remove();
		if (this.mtask) this.mtask.remove();
	}

	setTitle(title = this.window.ui.title.innerText) {
		let thumbnail = Registry.get("system.enableThumbnails");
		let markup = "";
		if (thumbnail === undefined) Registry.set("system.enableThumbnails", false);
		if (thumbnail) {
			markup = `
		<div style='max-width: 250px; max-height: 200px; margin: -0.25rem -0.5rem' class='text-left rounded scrollable-0'>
			<img class='w-100 mb-1' src='${this.window.thumbnail}'/>
			<div class='mb-1 ml-1 text-truncate'>${title}</div>
		</div>`;
			if (Shell.isMobile) {
				this.mtask.thumb.src = this.window.thumbnail;
				this.mtask.appName.innerText = title;
			}
		} else {
			markup = title;
		}
		this.task.dataset.originalTitle = markup;
	}

	setIcon(iconURL) {
		if (iconURL) {
			this.task.className = "btn mr-3 position-relative shadow border-0 fade show rounded-max mdi mdi-24px lh-24 d-inline-flex text-white p-2 mdi-" + this.window.options.icon;
			if (Shell.isMobile)
				this.mtask.icon.className = "mdi mdi-24px lh-24 d-flex text-white mdi-" + this.window.options.icon;
		}
	}

	focus() {
		this.task.classList.add("active");
	}

	blur() {
		this.task.classList.remove("active");
	}
}

module.exports = window.TaskManager = TaskManager;
if (typeof body !== 'undefined') {
	return body;
}