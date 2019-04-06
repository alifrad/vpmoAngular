/**
 * Default Fuse Configuration
 *
 * You can edit these options to change the default options. All these options also can be changed per component
 * basis. See `app/main/content/pages/authentication/login/login.component.ts` constructor method to learn more
 * about changing these options per component basis.
 */

export const fuseConfig = {
    colorTheme      : 'theme-default',
    layout          : {
        navigation      : 'left', // 'right', 'left', 'top', 'none',
        // navigationFolded: false, // true, false
        toolbar         : 'below', // 'above', 'below', 'none'
        mode            : 'fullwidth', // 'boxed', 'fullwidth'
        style    : 'vertical-layout-1',
        width    : 'fullwidth',
        navbar   : {
            primaryBackground  : 'fuse-navy-700',
            secondaryBackground: 'fuse-navy-900',
            folded             : false,
            hidden             : false,
            position           : 'left',
            variant            : 'vertical-style-1'
        },
        topicPanel: {
            primaryBackground  : 'fuse-white-bg',
            secondaryBackground: 'fuse-white-50-bg',
            folded             : true,
            hidden             : false,
            position           : 'right',
            variant            : 'vertical-style-1'
        },
        footer   : {
            customBackgroundColor: true,
            background           : 'fuse-navy-900',
            hidden               : false,
            position             : 'below-fixed'
        },
        sidepanel: {
            hidden  : true,
            position: 'right'
        }
    },
    colorClasses    : {
        toolbar: 'primary-50-bg',
        navbar : 'primary-700-bg',
        footer : 'primary-900-bg'
    },
    customScrollbars: false,
    routerAnimation : 'fadeIn' // fadeIn, slideUp, slideDown, slideRight, slideLeft, none
};


