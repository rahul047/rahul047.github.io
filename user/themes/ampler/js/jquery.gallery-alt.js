/**
 * A tiny gallery plugin. Usage:
 *
 *     $('.js-some-gallery').galleryAlt();
 *
 * The following options can be used:
 *
 *   * showcaseClass - element where the larger image should be portrayed;
 *   * thumbClass - elements acting as thumbnails;
 *
 * Note that each thumbnail *must* have a "data-gallery-alt-selected-class"
 * attribute set. The value will be used as the class indicating that the given
 * thumbnail is currently selected. You may optionally set a "data-gallery-alt-src"
 * attribute, which will be used in place of the "src" attribute (think using
 * a larger image for the showcase). Minimal HTML example:
 *
 *     <div class="js-some-gallery>
 *        <img class="js-gallery-alt-showcase" src="" />
 *
 *        <img src="..." data-gallery-alt-src="..." class="js-gallery-alt-thumb" data-gallery-alt-selected-class="selected" />
 *        <img src="..." data-gallery-alt-src="..." class="js-gallery-alt-thumb" data-gallery-alt-selected-class="selected" />
 *        <img src="..." data-gallery-alt-src="..." class="js-gallery-alt-thumb" data-gallery-alt-selected-class="selected" />
 *        <img src="..." data-gallery-alt-src="..." class="js-gallery-alt-thumb" data-gallery-alt-selected-class="selected" />
 *     </div>
 */

(function ($) {
    'use strict';

    function init($gallery, options) {
        var $showcase = $gallery.find('.' + options.showcaseClass);

        $gallery.on('click', '.' + options.thumbClass, switchShowcase.bind($gallery, options));
    }

    function switchShowcase(options, e) {
        var $showcase = $(e.delegateTarget).find('.' + options.showcaseClass);
        var $thumbs = $(e.delegateTarget).find('.' + options.thumbClass);
        var $thumb = $(e.target);

        // Deselect all other thumbnails.
        $thumbs.each(function (i, thumb) {
            $(thumb).removeClass($(thumb).attr(options.selectedAttr));
        });

        // Select the clicked thumbnail.
        $thumb.addClass($thumb.attr(options.selectedAttr));

        // Switch the image from the clicked thumbnail to the showcase. It makes
        // sure the inner elements also get the new image url. This comes in
        // handy in cases where some kind of lightbox plugin is used with a
        // link wrapping an image element.
        var src = $thumb.attr(options.srcAttr) || $thumb.attr('src');

        $showcase
            .find('a').addBack('a').attr('href', src).end().end()
            .find('img').addBack('img').attr('src', src).end().end()
        ;
    }

    $.fn.galleryAlt = function (options) {
        return this.each(function (i, gallery) {
            init($(gallery), $.extend({}, $.fn.galleryAlt.defaults, options));
        });
    };

    $.fn.galleryAlt.defaults = {
        showcaseClass: 'js-gallery-alt-showcase',
        thumbClass: 'js-gallery-alt-thumb',
        selectedAttr: 'data-gallery-alt-selected-class',
        srcAttr: 'data-gallery-alt-src',
    };

})(jQuery);
