function isEnabled(mod, options) {
	if(!options.enabled && !options.disabled) return true;
	else if(options.disabled && !~options.disabled.indexOf(mod)) return true;
	else if(options.enabled && ~options.enabled.indexOf(mod)) return true;
	else return false;
}

function addAddition(addition, Eris, options = {}) {
	if(!isEnabled(addition, options)) return;

	let mod = require(`./lib/${addition.replace(".", "/")}`);
	mod(Eris);
	mod.deps.forEach(dep => addAddition(dep, Eris));
}

const fs = require("fs");
const libdir = require("path").resolve("lib");
module.exports = (Eris, options = {}) => {
	let structs = fs.readdirSync(libdir);
	structs.forEach(struct => {
		let additions = fs.readdirSync(`${libdir}/${struct}/`);
		additions.forEach(addition => addAddition(`${struct}.${addition}`, Eris, options));
	});

	return Eris;
};
