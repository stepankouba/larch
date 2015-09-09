import fs from 'fs';

fs.readdir('./', (err, files) => {
	if (err) {
		console.log(err);
		process.exit(1);
	}

	files.forEach(f => {
		if (f === 'larch.package.json' || f === 'package.json') {
			fs.createReadStream(f)
				.pipe(fs.createWriteStream(`./_temp/${f}`))
				.on('error', err => console.log(err));
		}
	});
});
