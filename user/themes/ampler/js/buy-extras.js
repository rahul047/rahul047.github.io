(function ( $, window, document, undefined ) {
    'use strict';

    // Hooks up the event listener to toggle extras
    var $options = $('.js-buy-extras__choice');
    $options.prop('checked', false); // Reset checkboxes after JS is loaded
    $options.on('change', onExtraInputChange.bind(null));

    // Binds to extra info icon click
    $('.js-buy-extras__info').on('click', openExtraModal);

    // Binds to extra modal "Add" button click
    $(document).on('click', '.extra-modal__button', onExtraAddButtonClick);

    // Binds to Snipcart item.adding event
    window.Snipcart.subscribe('item.adding', onItemAdding);

    // Binds to Snipcart item.removed event
    window.Snipcart.subscribe('item.removed', onItemRemoved);

    // List of extras which can be added exclusively into cart
    // @TODO: Move to config
    var exclusiveExtras = [
        'front-basket',
        'front-cargo-carrier',
        'front-cargo-carrier-wooden'
    ];

    // List of main products
    // @TODO: Move to config
    var mainProducts = [
        'bilberry-ladies',
        'bilberry-mens',
        'hawk-ladies',
        'hawk-mens',
        'pennon-ladies',
        'pennon-mens'
    ];

    /**
     * Handles Snipcart item.removed event
     *
     * @param  {object} item  Product object currently added
     */
    function onItemRemoved(item) {
        if ($.inArray(item.id, mainProducts) === -1) {
            return;
        }

        // @TODO: Handle last removed main product from cart
    }

    /**
     * Handles Snipcart item.adding event
     *
     * @param  {object} ev    Event object
     * @param  {object} item  Product object currently added
     * @param  {array}  items Products already in cart
     */
    function onItemAdding(ev, item, items) {
        // console.log(item.id);

        if ($.inArray(item.id, mainProducts) === -1) {
            return;
        }

        addItemsToCart(getItemsToAdd());
    }

    /**
     * Gets list of extras from DOM which are marked as active
     *
     * @param {array} items List of items to be added to cart
     */
    function getItemsToAdd() {
        var $extras = $('.js-buy-extras__extra-wrapper'),
            itemsToAdd = [];

        $extras.each(function(i, el) {
            var $el = $(el),
                isChecked = $el.find('.js-buy-extras__choice').prop('checked');

            if (!isChecked) {
                return;
            }

            var $btn = $el.find('.js-buy-extras__button');

            itemsToAdd.push({
                id: $btn.data('item-id'),
                name: $btn.data('item-name'),
                image: $btn.data('item-image'),
                url: $btn.data('item-url'),
                price: $btn.data('item-price')
            });
        });

        return itemsToAdd;
    }

    /**
     * Adds provided array of items to Snipcart cart
     *
     * @param {array} items List of items to be added to cart
     */
    function addItemsToCart(items) {
        window.Snipcart.api.cart.start().then(function() {
            $.each(items, function(i, item) {
                // console.log(item.id);

                checkExtraCartExclusivity(item);

                window.Snipcart.api.items.add({
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    description: item.description,
                    url: item.url,
                    price: item.price
                }).then (function (addedItem) {
                    // console.log('addedItem', addedItem);
                });
            });
        });
    }

    /**
     * Checks for exclusive extras in cart and removes them
     *
     * @param  {object} item Extra item data
     */
    function checkExtraCartExclusivity(item) {
        if ($.inArray(item.id, exclusiveExtras) !== -1) {
            $.each(exclusiveExtras.filter(function(id) {
                return item.id !== id;
            }), function(i, id) {
                Snipcart.api.items.remove(id)
                    .then(function (removedItem) {
                        // console.log('removedItem', removedItem);
                    });
            });
        }
    }

    /**
     * Checks if extras are exclusive and removes active state from other exclusive extras
     *
     * @param  {jQuery.Element} $input jQuery instance of input element which is marked active
     */
    function checkExtraExclusivity($input) {
        var itemId = $input.attr('name');

        if ($input.prop('checked') && $.inArray(itemId, exclusiveExtras) !== -1) {
            $.each(exclusiveExtras.filter(function(id) {
                return itemId !== id;
            }), function(i, id) {
                var $exclusiveInput = $('input[name=' + id + ']'),
                    $exclusiveExtra = $exclusiveInput.closest('label');

                $exclusiveExtra.removeClass($exclusiveExtra.attr('data-selected-class'));
                $exclusiveInput.prop('checked', false);
                $('.js-buy-summary__line[data-item-id="' + id + '"]').remove();
            });
        }
    }

    /**
     * Handles "Only extras" input change
     *
     * @param  {jQuery.Element} $input jQuery instance of input element which is marked active
     */
    function handleOnlyExtrasInputChange($input) {
        var onlyExtraValue = $input.prop('checked') ? 'Yes' : 'No';

        if ($input.attr('name') === 'only-extras') {
            $('.buy-summary__button-buy').data('item-custom2-value', onlyExtraValue);
        }
    }

    /**
     * Handles extras adding & removing in summary list
     *
     * @param  {jQuery.Element} $input jQuery instance of input element which is marked active
     */
    function handleExtrasInSummary($input) {
        var $itemsWrap = $('.js-buy-summary__lines'),
            $items = $itemsWrap.find('.js-buy-summary__line'),
            $extraWrapper = $input.closest('.js-buy-extras__extra-wrapper'),
            id = $extraWrapper.data('item-id'),
            itemHTML = getSummaryExtraContent($extraWrapper);

        if ($input.prop('checked') === true) {
            $itemsWrap.append(itemHTML);
        } else {
            $items.filter('[data-item-id="' + id + '"]').remove();
        }
    }

    /**
     * Returns extra html content for summary list
     *
     * @param  {jQuery.Element} $extraWrapper jQuery instance of extra element
     * @return {string}                       HTML content for summary line
     */
    function getSummaryExtraContent($extraWrapper) {
        var $input = $extraWrapper.find('.js-buy-extras__choice'),
            $button = $extraWrapper.find('.js-buy-extras__button'),
            itemHTML = '',
            id, name, price;

        if ($input.attr('name') === 'only-extras') {
            id = $input.attr('name');
            name = $input.data('item-name');
            price = $input.data('item-price');
        } else {
            id = $button.data('item-id');
            name = $button.data('item-name');
            price = $button.data('item-price');
        }

        itemHTML += '<li class="buy-summary__line js-buy-summary__line" data-item-id="' + id + '" data-item-price="' + price + '">';
        itemHTML += '<p class="buy-summary__desc">' + name + '</p>';
        itemHTML += '<p class="buy-summary__price">'+ price + ' €</p>';
        itemHTML += '</li>';

        return itemHTML;
    }

    /**
     * Calculates the total sum for product
     */
    function calculateTotalSum() {
        var $items = $('.js-buy-summary__line'),
            $total = $('.js-buy-summary__total__price'),
            total = 0;

        $items.each(function(i, el) {
            total = total + parseInt($(el).data('item-price'));
        });

        $total.text(total);
    }

    /**
     * Toggles the selected class from the given element. The class is specified
     * in the element's "data-selected-class" attribute.
     *
     * @param {mixed} _
     * @param {HTMLElement} element
     */
    function toggleSelectedClass(_, option) {
        $(option).toggleClass($(option).attr('data-selected-class'));
    }

    /**
     * Handles extra checkbox value change
     *
     * @param {jQuery.Event} e
     */
    function onExtraInputChange(e) {
        var $input = $(e.target),
            $extra = $input.closest('label'),
            $wrapper = $extra.closest('.js-buy-extras__extra-wrapper');

        handleExtrasInSummary($input);
        checkExtraExclusivity($input);
        handleOnlyExtrasInputChange($input);
        $extra.each(toggleSelectedClass);
        calculateTotalSum();
    }

    /**
     * Handles extra modal add button click
     *
     * @param {jQuery.Event} e
     */
    function onExtraAddButtonClick(e) {
        var $this = $(e.target),
            id = $this.data('target-id'),
            $extra = $('[data-item-id="' + id + '"]' + ' label'),
            $input = $extra.find('.js-buy-extras__choice');

        $input.prop('checked', !$input.prop('checked'));
        $input.trigger('change');
        closeExtraModal();
    }

    /**
     * Opens extra modal
     *
     * @param {jQuery.Event} e
     */
    function openExtraModal(e) {
        var $wrapper = $(e.target).closest('.js-buy-extras__extra-wrapper'),
            contentHTML = getExtraModalContent($wrapper);

        window.vex.open({
            unsafeContent: contentHTML,
            className: 'vex-theme-wireframe',
            contentClassName: 'extra-modal',
            showCloseButton: false,
            escapeButtonCloses: true,
            overlayClosesOnClick: true,
            appendLocation: 'body',
            // overlayClassName: '',
            // closeClassName: ''
        });
    }

    /**
     * Returns extra modal content based on extra element provided
     *
     * @param  {jQuery.Element} $extraWrapper jQuery instance of extra element
     * @return {string}                       HTML content for extra modal
     */
    function getExtraModalContent($extraWrapper) {
        var id = $extraWrapper.data('item-id'),
            img = $extraWrapper.find('.js-buy-extras__image').attr('src'),
            title = $extraWrapper.find('.js-buy-extras__name').text(),
            price = $extraWrapper.find('.js-buy-extras__price').text(),
            desc = $extraWrapper.find('.js-buy-extras__info').data('desc'),
            isChecked = $extraWrapper.find('.js-buy-extras__choice').prop('checked'),
            buttonText = isChecked ? 'Remove' : 'Add',
            contentHTML = '';

        contentHTML += '<button class="extra-modal__button" data-target-id="' + id + '">' + buttonText + '</button>';
        contentHTML += '<h2 class="extra-modal__title">' + title + '</h2>';
        contentHTML += '<p class="extra-modal__price">' + price + '</p>';
        contentHTML += '<img class="extra-modal__image" src="' + img + '" alt="' + title +'">';
        contentHTML += desc;

        return contentHTML;
    }

    /**
     * Closes extra modal
     */
    function closeExtraModal() {
        window.vex.closeAll();
    }

})(jQuery, window, document );
