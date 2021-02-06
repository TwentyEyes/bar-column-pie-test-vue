export default {
	methods: {
		autoBrightness: function (hex, percent) {

			if (typeof hex != 'undefined') {

				hex = hex.replace(/^\s*#|\s*$/g, '');

			if (hex.length == 3) {
				hex = hex.replace(/(.)/g, '$1$1');
			}

			var r = parseInt(hex.substr(0, 2), 16),
				g = parseInt(hex.substr(2, 2), 16),
				b = parseInt(hex.substr(4, 2), 16);

			return '#' +
				((0 | (1 << 8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
				((0 | (1 << 8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
				((0 | (1 << 8) + b + (256 - b) * percent / 100).toString(16)).substr(1);

			} else {
				return ''
			}
    },
    convertHexToRgb: function (hexColor, opacity){
      let hex = hexColor.replace('#', '');
      let r = parseInt(hex.substring(0,2), 16)
      let g = parseInt(hex.substring(2,4), 16)
      let b = parseInt(hex.substring(4,6), 16)

      return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')'
    }
	}
}
