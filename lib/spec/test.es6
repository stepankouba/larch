import transform from './transform.es6';
const source = [{"days":[0,0,0,0,0,0,0],"total":0,"week":1413676800},{"days":[0,0,0,0,0,0,0],"total":0,"week":1414281600},{"days":[0,0,0,0,0,0,0],"total":0,"week":1414886400},{"days":[0,0,0,0,0,0,0],"total":0,"week":1415494800},{"days":[0,0,0,0,0,0,0],"total":0,"week":1416099600},{"days":[0,0,0,0,0,0,0],"total":0,"week":1416704400},{"days":[0,0,0,0,0,0,0],"total":0,"week":1417309200},{"days":[0,0,0,0,0,0,0],"total":0,"week":1417914000},{"days":[0,0,0,0,0,0,0],"total":0,"week":1418518800},{"days":[0,0,0,0,0,0,0],"total":0,"week":1419123600},{"days":[0,0,0,0,0,0,0],"total":0,"week":1419728400},{"days":[0,0,0,0,0,0,0],"total":0,"week":1420333200},{"days":[0,0,0,0,0,0,0],"total":0,"week":1420938000},{"days":[0,0,0,0,0,0,0],"total":0,"week":1421542800},{"days":[0,0,0,0,0,0,0],"total":0,"week":1422147600},{"days":[0,0,0,0,0,0,0],"total":0,"week":1422752400},{"days":[0,0,0,0,0,0,0],"total":0,"week":1423357200},{"days":[0,0,0,0,0,0,0],"total":0,"week":1423962000},{"days":[0,0,0,0,0,0,0],"total":0,"week":1424566800},{"days":[0,0,0,0,0,0,0],"total":0,"week":1425171600},{"days":[0,0,0,0,0,0,0],"total":0,"week":1425776400},{"days":[0,0,0,0,0,0,0],"total":0,"week":1426377600},{"days":[0,0,0,0,0,0,0],"total":0,"week":1426982400},{"days":[0,0,0,0,0,0,0],"total":0,"week":1427587200},{"days":[0,0,0,0,0,0,0],"total":0,"week":1428192000},{"days":[0,0,0,0,0,0,0],"total":0,"week":1428796800},{"days":[0,0,0,0,0,0,0],"total":0,"week":1429401600},{"days":[0,0,0,0,0,0,0],"total":0,"week":1430006400},{"days":[0,0,0,0,0,0,0],"total":0,"week":1430611200},{"days":[0,0,0,0,0,0,0],"total":0,"week":1431216000},{"days":[0,0,0,0,0,0,0],"total":0,"week":1431820800},{"days":[0,0,0,0,0,0,0],"total":0,"week":1432425600},{"days":[0,0,0,0,0,0,0],"total":0,"week":1433030400},{"days":[0,0,0,0,0,0,0],"total":0,"week":1433635200},{"days":[0,0,0,2,0,1,1],"total":4,"week":1434240000},{"days":[2,4,0,1,0,0,0],"total":7,"week":1434844800},{"days":[0,3,1,0,0,0,0],"total":4,"week":1435449600},{"days":[0,0,1,0,2,0,5],"total":8,"week":1436054400},{"days":[5,3,0,4,8,1,3],"total":24,"week":1436659200},{"days":[3,0,0,0,0,0,0],"total":3,"week":1437264000},{"days":[2,0,0,1,0,0,0],"total":3,"week":1437868800},{"days":[0,6,1,0,0,0,0],"total":7,"week":1438473600},{"days":[0,0,1,0,0,0,0],"total":1,"week":1439078400},{"days":[0,0,0,0,2,7,0],"total":9,"week":1439683200},{"days":[0,1,2,8,11,1,0],"total":23,"week":1440288000},{"days":[0,0,0,0,10,6,2],"total":18,"week":1440892800},{"days":[0,2,14,7,5,5,0],"total":33,"week":1441497600},{"days":[0,6,0,3,7,0,0],"total":16,"week":1442102400},{"days":[0,10,4,8,1,8,0],"total":31,"week":1442707200},{"days":[0,3,17,1,10,3,14],"total":48,"week":1443312000},{"days":[0,6,25,1,0,6,0],"total":38,"week":1443916800},{"days":[0,0,0,0,0,0,0],"total":0,"week":1444521600}];

const template = {
	key: 'Commits avg per week',
	area: true,
	values: ['$.*', {
		x: '$.week',
		y: '$..(*round)'
	}]
};

console.log(JSON.stringify(transform(source, template, {
	round([value]) {
		return [Math.round(value.total / value.days.length * 100) / 100];
	}
}), null, 4));
