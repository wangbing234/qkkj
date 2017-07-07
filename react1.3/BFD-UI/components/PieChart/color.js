export default (type, length) => {
	if (length > 16) {
		return;
	}

	let colors = [
		'#e84035', '#e01d5f', '#9c28b1', '#673bb7', //色系1--------  1     (0 )
		'#4050b2', '#2196f3', '#01aaf8', '#00bcd5', //色系2--------  2     (4 )
		'#009784', '#4caf53', '#87c148', '#cddc39', //色系3--------  3     (8 )
		'#ffee58', '#f8Cf1d', '#ff9803', '#f5511e'  //色系4--------  4     (12)     
	];

	switch (type) {
		case 1:
			break;
		case 2:
			var arr = colors.splice(0, 4);
			colors = colors.concat(arr);
			break;
		case 3:
			var arr = colors.splice(0, 8);
			colors = colors.concat(arr);
			break;
		case 4:
			var arr = colors.splice(0, 12);
			colors = colors.concat(arr);
			break;
		default:
			break;
	}
	return colors.splice(0, length);
}