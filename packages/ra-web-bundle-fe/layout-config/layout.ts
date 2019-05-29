export const defaultLayouts = {
    default: {
        settings: {
            hasHeaders: true,
            constrainDragToContainer: true,
            reorderEnabled: true,
            selectionEnabled: false,
            popoutWholeStack: false,
            blockedPopoutsThrowError: true,
            closePopoutsOnUnload: true,
            showPopoutIcon: false,
            showMaximiseIcon: false,
            showCloseIcon: true
        },
        content: [{
            type: "row",
            content: [{
                type: "column",
                content: [{
                    type: "component",
                    componentName: "default-component",
                }]
            }]
        }]
    }
};
