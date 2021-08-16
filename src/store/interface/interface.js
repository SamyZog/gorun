import produce from "immer";

const TOGGLE_EMAIL_TOOLTIP = "interface/email_tooltip";
const TOGGLE_DISABLED = "interface/toggle_disabled";
const TOGGLE_FORM_TYPE = "interface/form_type";

export const toggleEmailTooltip = (payload) => ({
	type: TOGGLE_EMAIL_TOOLTIP,
	payload,
});

export const toggleDisabled = (payload) => ({
	type: TOGGLE_SPINNER,
	payload,
});

const interfaceState = {
	toolTip: false,
	disabled: false,
};

export function interfaceReducer(state = interfaceState, action) {
	switch (action.type) {
		case TOGGLE_EMAIL_TOOLTIP:
			return produce(state, (draft) => {
				draft.toolTip = action.payload;
			});
		case TOGGLE_DISABLED:
			return produce(state, (draft) => {
				draft.disabled = action.payload;
			});
		default:
			return state;
	}
}
