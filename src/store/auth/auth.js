import produce from "immer";

// action types
/* -------------------------------------------------------------------------- */
const SET_EMAIL_INPUT_VALUE = "auth/email_input_value";
const SET_SUBMIT_BUTTON_STATE = "auth/submit_button_state";
const SET_FORM_TYPE = "auth/set_form_type";
/* -------------------------------------------------------------------------- */

// actions
/* -------------------------------------------------------------------------- */
export const setEmailInputValue = (payload) => ({
	type: SET_EMAIL_INPUT_VALUE,
	payload,
});

export const setSubmitButtonState = (payload) => ({
	type: SET_SUBMIT_BUTTON_STATE,
	payload,
});

export const setFormType = (payload) => ({
	type: SET_FORM_TYPE,
	payload,
});
/* -------------------------------------------------------------------------- */

// initial state
/* -------------------------------------------------------------------------- */
const authState = {
	emailInputValue: "",
	formType: "signup",
	submitButton: false,
};
/* -------------------------------------------------------------------------- */

// reducer
/* -------------------------------------------------------------------------- */
export function authReducer(state = authState, action) {
	switch (action.type) {
		case SET_EMAIL_INPUT_VALUE:
			return produce(state, (draft) => {
				draft.emailInputValue = action.payload;
			});
		case SET_SUBMIT_BUTTON_STATE:
			return produce(state, (draft) => {
				draft.submitButton = action.payload;
			});
		case SET_FORM_TYPE:
			return produce(state, (draft) => {
				draft.formType = action.payload;
			});
		default:
			return state;
	}
}
/* -------------------------------------------------------------------------- */
