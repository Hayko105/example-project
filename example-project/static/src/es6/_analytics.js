import { pushGAEvent } from './_pushga';


export function GA_SubmitFail() {
    pushGAEvent({
        event_category: 'form',
        event_action: 'submit',
        event_label: 'fail',
    });
}

export function GA_SubmitSuccess() {
    pushGAEvent({
        event_category: 'form',
        event_action: 'submit',
        event_label: 'success'
    });
}