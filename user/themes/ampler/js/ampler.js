
(function (w, $) {
    'use strict';

    $('a[rel="lightbox"]').fluidbox();
    $('.js-gallery-alt').galleryAlt();
    $('.js-features-btn').click(toggleExtraFeatures);
    $('.js-fancy-scroll').click(scrollTo);

    // The video tags should only be replaced on mobile devices. Note that this
    // also applies in cases where upon the initial page load the browser screen
    // is less than the threshold.
    if (isScreenLargerThan(w, 401)) {
        return;
    }

    $('video').replaceWith(function () {
        var $video = $(this);
        var $div = $('<div />', {html: $video.html()});
        // @todo get this CSS out of here!
        $div.css('height', '100%');

        $.each(this.attributes, function (attr) {
            $div.attr(attr.name, attr.value);
        });

        return $div;
    });

    function toggleExtraFeatures(e) {
        e.preventDefault();

        var $btn = $(e.currentTarget);
        var $target = $('.' + $btn.attr('data-target-class'));
        var opened = 'button-features-opened';
        var closed = 'button-features-closed';

        if ($btn.hasClass(opened)) {
            $btn.removeClass(opened).addClass(closed);
            $target.hide();
        } else if ($btn.hasClass(closed)) {
            $btn.removeClass(closed).addClass(opened);
            $target.show();
        } else {
            throw 'The button is missing a ".features-(open|closed)" class.';
        }
    }

    /**
     * @param {Window} w    The window object
     * @param {Number} size Threshold size in pixels
     *
     * @return {Boolean}
     */
    function isScreenLargerThan(w, size)
    {
        if (w.matchMedia) {
            return !w.matchMedia('(max-device-width: ' + size + 'px)').matches;
        }

        return ((w.innerWidth > 0) ? w.innerWidth : w.width) > size;
    }

    /**
     * Smoothly scrolls down or up to the given element specified by the anchor.
     *
     * @param {jQuery.Event} e
     */
    function scrollTo(e) {
        var id = $(e.target).attr('href').split('#')[1];
        // Regex modified, by adding "'" also to the list of characters to escape,
        // more info at https://learn.jquery.com/using-jquery-core/faq/how-do-i-select-an-element-by-an-id-that-has-characters-used-in-css-notation/
        var $target = $('#' + id.replace(/(:|\.|\[|\]|,|')/g, "\\$1"));

        $('html, body').animate({scrollTop: $target.offset().top}, 'slow', 'swing');

        e.preventDefault();
    }

})(window, jQuery);
