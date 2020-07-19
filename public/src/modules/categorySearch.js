define('categorySearch', function () {
	var categorySearch = {};

	categorySearch.init = function (el) {
		if (utils.isTouchDevice()) {
			return;
		}
		var searchEl = el.find('[data-component="category-selector-search"]');
		if (!searchEl.length) {
			return;
		}

		var toggleVisibility = searchEl.parent('[data-component="category/dropdown"]').length > 0 ||
			searchEl.parent('[data-component="category-selector"]').length > 0;
		var categoryEls = el.find('[data-component="category/list"] [data-cid]');

		el.on('show.bs.dropdown', function () {
			function revealParents(cid) {
				var parentCid = el.find('[data-component="category/list"] [data-cid="' + cid + '"]').attr('data-parent-cid');
				if (parentCid) {
					el.find('[data-component="category/list"] [data-cid="' + parentCid + '"]').removeClass('hidden');
					revealParents(parentCid);
				}
			}

			function revealChildren(cid) {
				var els = el.find('[data-component="category/list"] [data-parent-cid="' + cid + '"]');
				els.each(function (index, el) {
					var $el = $(el);
					$el.removeClass('hidden');
					revealChildren($el.attr('data-cid'));
				});
			}

			function updateList() {
				var val = searchEl.val().toLowerCase();
				var noMatch = true;
				var cids = [];
				categoryEls.each(function () {
					var liEl = $(this);
					var isMatch = liEl.attr('data-name').toLowerCase().indexOf(val) !== -1;
					if (noMatch && isMatch) {
						noMatch = false;
					}
					if (isMatch && val) {
						cids.push(liEl.attr('data-cid'));
					}
					liEl.toggleClass('hidden', !isMatch).find('[data-component="category-markup"]').css({ 'font-weight': val && isMatch ? 'bold' : 'normal' });
				});

				cids.forEach(function (cid) {
					revealParents(cid);
					revealChildren(cid);
				});

				el.find('[data-component="category/list"] [data-component="category/no-matches"]').toggleClass('hidden', !noMatch);
			}
			if (toggleVisibility) {
				el.find('.dropdown-toggle').addClass('hidden');
				searchEl.removeClass('hidden');
			}

			searchEl.on('click', function (ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});
			searchEl.val('').on('keyup', updateList);
			updateList();
		});
		el.on('shown.bs.dropdown', function () {
			searchEl.focus();
		});

		el.on('hide.bs.dropdown', function () {
			if (toggleVisibility) {
				el.find('.dropdown-toggle').removeClass('hidden');
				searchEl.addClass('hidden');
			}

			searchEl.off('click');
			searchEl.off('keyup');
		});
	};

	return categorySearch;
});
