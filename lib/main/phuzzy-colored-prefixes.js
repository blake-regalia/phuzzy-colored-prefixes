const color_scheme = require('color-scheme');

module.exports = function(h_settings, h_args) {
	let {
		palettes: n_palettes=12,
	} = h_args;

	let n_steps = 360 / n_palettes;
	let k_scheme = new color_scheme();

	let s_css = `.value.named-node:before {
		content: "■";
		margin-right: 4px;
	}
	`;
	let c_group = 0;
	for(let i_hue=0; i_hue<360; i_hue+=n_steps) {
		k_scheme.from_hue(i_hue)
			.scheme('analogic')
			.distance(0.25)
			.colors().forEach((s_hex, i_item) => {
				s_css += `.phuzzy-colored-prefixes_group-${c_group}_item-${i_item}:before {
					color: #${s_hex};
				}
				`;
			});

		c_group += 1;
	}

	let d_previous_style = document.getElementById('phuzzy-colored-prefixes');
	if(d_previous_style) {
		d_previous_style.parentNode.removeChild(d_previous_style);
	}

	let d_style = document.createElement('style');
	d_style.id = 'phuzzy-colored-prefixes';
	d_style.innerHTML = s_css;
	document.head.appendChild(d_style);

	let h_domains = {};
	let c_domains = 0;

	return {
		named_node(h_node, d_cell, k_phuzzy) {
			let s_tt = k_phuzzy.terse(h_node.value);
			if('<' !== s_tt[0]) {
				let s_prefix = s_tt.split(':', 1)[0];

				let p_prefix_iri = k_phuzzy.verbose(s_prefix+':');
				let s_domain = p_prefix_iri.replace(/^(.+?\.\w+)\/.*$/, '$1');
				let h_map = {};
				let i_domain = 0;
				let c_items = 0;
				let h_domain;

				// domain does not yet exist
				if(!h_domains[s_domain]) {
					i_domain = c_domains++;
					h_domain = h_domains[s_domain] = {
						index: i_domain,
						map: h_map,
						items: 0,
					};
				}
				// domain already exists
				else {
					h_domain = h_domains[s_domain];
					i_domain = h_domain.index;
					h_map = h_domain.map;
					c_items = h_domain.items;
				}

				let i_prefix = 0;
				if(!(s_prefix in h_map)) {
					h_map[s_prefix] = i_prefix = c_items;
					h_domain.items += 1;
				}
				else {
					i_prefix = h_map[s_prefix];
				}

				d_cell.classList.add(`phuzzy-colored-prefixes_group-${i_domain % 12}_item-${i_prefix % 12}`);
			}
		},
	};
};
