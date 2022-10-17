import Sortable from 'sortablejs';

window.LwSortable = Sortable;

if (typeof window.Livewire === 'undefined') {
    throw 'Livewire Sortable.js Plugin: window.Livewire is undefined. Make sure @livewireScripts is placed above this script include';
}

window.Livewire.directive('lw-sortable', (el, directive, component) => {
    // Only fire this handler on the "root" directive.
    if (directive.modifiers.length > 0) {
        return;
    }

    let options = {};

    if (el.hasAttribute('wire:lw-sortable.options')) {
        options = (new Function(`return ${el.getAttribute('wire:lw-sortable.options')};`))();
    }

    el.livewire_sortable = window.LwSortable.create(el, {
        ...options,
        draggable: '[wire\\:lw-sortable\\.item]',
        handle: el.querySelector('[wire\\:lw-sortable\\.handle]') ? '[wire\\:lw-sortable\\.handle]' : null,
        sort: true,
        dataIdAttr: 'wire:lw-sortable.item',
        group: {
            name: el.getAttribute('wire:lw-sortable'),
            pull: false,
            put: false,
        },
        store: {
            set: function (sortable) {
                let items = sortable.toArray().map((value, index) => {
                    return {
                        order: index + 1,
                        value: value,
                    };
                });

                component.call(directive.method, items);
            },
        },
    });
});

window.Livewire.directive('lw-sortable-group', (el, directive, component) => {
    // Only fire this handler on the "root" group directive.
    if (!directive.modifiers.includes('item-group')) {
        return;
    }

    let options = {};

    if (el.hasAttribute('wire:lw-sortable-group.options')) {
        options = (new Function(`return ${el.getAttribute('wire:lw-sortable-group.options')};`))();
    }

    el.livewire_sortable = window.LwSortable.create(el, {
        ...options,
        draggable: '[wire\\:lw-sortable-group\\.item]',
        handle: el.querySelector('[wire\\:lw-sortable-group\\.handle]') ? '[wire\\:lw-sortable-group\\.handle]' : null,
        sort: true,
        dataIdAttr: 'wire:lw-sortable-group.item',
        group: {
            name: el.closest('[wire\\:lw-sortable-group]').getAttribute('wire:lw-sortable-group'),
            pull: true,
            put: true,
        },
        onSort: () => {
            let masterEl = el.closest('[wire\\:lw-sortable-group]');

            let groups = Array.from(masterEl.querySelectorAll('[wire\\:lw-sortable-group\\.item-group]')).map((el, index) => {
                return {
                    order: index + 1,
                    value: el.getAttribute('wire:lw-sortable-group.item-group'),
                    items: el.livewire_sortable.toArray().map((value, index) => {
                        return {
                            order: index + 1,
                            value: value
                        };
                    }),
                };
            });

            component.call(masterEl.getAttribute('wire:lw-sortable-group'), groups);
        },
    });
});
