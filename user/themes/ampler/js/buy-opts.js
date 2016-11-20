
(function ($) {
    'use strict';

    // Hooks up the event listener to switch choices, if the user changes a choice.
    var $options = $('.js-buy-opts__choice');
    $options.on('change', switchChoice.bind(null, $('.snipcart-add-item'), $options));

    // Makes sure first choice from each type is selected by default.
    var $optionsFirstOfAKind = $($options.get().reduce(addIfFirstOfAKind, []));
    $optionsFirstOfAKind.trigger('click');

    /**
     * Changes the option from one to the other. Basically each choice within
     * a single group has a radio button. When selected, all the others must
     * be unselected and the current one marked as selected. The selected choice
     * must be also updated in the SnipCart button so that when the user clicks
     * on it, the item will be added with correct choices.
     *
     * @param {jQuert} $snipcart
     * @param {jQuery} $options
     * @param {jQuery.Event} e
     */
    function switchChoice($snipcart, $options, e) {
        var $option = $(e.target);

        $options
            .filter(function (_, option) { return hasSameName(option, $option.get()); })
            .closest('label')
            .each(removeSelectedClass)
        ;

        $option
            .closest('label')
            .each(addSelectedClass)
        ;

        $('.js-' + $option.attr('name')).html($option.val());

        $snipcart
            .attr($option.attr('name'), $option.val())
        ;
    }

    /**
     * Removes the selected class from the given element. The class is specified
     * in the element's "data-selected-class" attribute.
     *
     * @param {mixed} _
     * @param {HTMLElement} element
     */
    function removeSelectedClass(_, element) {
        $(element).removeClass($(element).attr('data-selected-class'));
    }

    /**
     * Adds the selected class from the given element. The class is specified
     * in the element's "data-selected-class" attribute.
     *
     * @param {mixed} _
     * @param {HTMLElement} element
     */
    function addSelectedClass(_, option) {
        $(option).addClass($(option).attr('data-selected-class'));
    }

    /**
     * Adds the element to the given list of elements, if no previous element
     * has appeared in the list with the same name. I.e. given the following
     * elements only "1." and "3." would appear in the list:
     *
     *   <input name="foo" type="radio" /> <!-- 1. -->
     *   <input name="foo" type="radio" /> <!-- 2. -->
     *   <input name="bar" type="radio" /> <!-- 3. -->
     *
     * @param {Array<HTMLElement>} elements
     * @param {HTMLElement}        element
     *
     * @returns {Array<HTMLElement>}
     */
    function addIfFirstOfAKind(elements, element) {
        return elements.concat(elements.some(hasSameName.bind(null, element)) ? [] : [element])
    }

    /**
     * @param {HTMLElement} elementA
     * @param {HTMLElement} elementB
     *
     * @return {Boolean} Whether the two elements have the same name
     */
    function hasSameName(elementA, elementB) {
        return $(elementA).attr('name') === $(elementB).attr('name');
    }

})(jQuery);
