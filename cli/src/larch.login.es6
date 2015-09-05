const login = {
	subcommands: false,
	argsLength: 0,

	usage() {
		const text = [
			'',
			'larch login - is used for login user to registry',
			''].join('\n');
		return text;
	}
};

export default login;