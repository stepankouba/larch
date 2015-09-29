const DataSrvc = function(HTTPer, Logger) {
	const logger = Logger.create('service.Data');

	const srvc = {
		getData(widget, settings) {
			logger.log(`request to /api/widget/${widget.id} sent`);

			const user = {
				settings: {
					source: {
						token: '38687522b17c1f25c50f79e6f7eacfc5fa0c3bc7'
					}
				}
			};

			const postData = {
				widget,
				user,
				settings
			};

			return HTTPer.post(`https://localhost:9101/api/data/${widget.id}`, postData, {json: true})
				.catch(data => {
					logger.error('hey, HTTPer raised an error', data);
					if (data.statusCode === 202) {
						setTimeout(this.getData.bind(this, widget), 1000);
					} else {
						Promise.reject(data);
					}
				});
		}
	};

	return srvc;
};
DataSrvc.$injector = ['larch.HTTPer', 'larch.Logger'];

export default {
	name: 'service.Data',
	type: 'singleton',
	functor: DataSrvc
};