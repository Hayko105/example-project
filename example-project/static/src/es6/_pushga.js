import { getCookie } from './_getcookie';


export const pushGAEvent = ({
    event_category,
    event_action,
    event_label,
    event_value
}) => {
    if (typeof gtag !== 'undefined') {
        gtag('event', event_action, {
            event_category,
            event_label,
            value: event_value,
            adid,
            userid: getCookie('tracking_session_id'),
        });
    }
};

export const pushGAPageView = ({
    page_title,
    page_path,
    event_category,
    event_value,
}) => {
    // sending pageview and setting custom dimentions
    if (typeof gtag !== 'undefined') {
        gtag('config', ga_tracking_id, {
            page_title,
            page_path,
            'custom_map': {
                'dimension1': 'adid',
                'dimension2': 'userid'
            },
            adid,
            userid: getCookie('tracking_session_id'),
        });
    }
    // sending enchanced click view event with customs dimentions data set earlier
    pushGAEvent({
        event_category,
        event_action: 'view',
        event_value
    });
};