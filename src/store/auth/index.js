import produce from "immer";

const SET_EMAIL_INPUT_VALUE = "auth/email_input_value";
const SET_USER = "auth/set_user";
const SET_FORM_TYPE = "auth/set_form_type";

export const setEmailInputValue = (payload) => ({
	type: SET_EMAIL_INPUT_VALUE,
	payload,
});

export const setUser = (payload) => ({
	type: SET_USER,
	payload,
});

export const setFormType = (payload) => ({
	type: SET_FORM_TYPE,
	payload,
});

const authInputValues = {
	email: "",
	user: null,
	formType: "signin",
};

export function authReducer(state = authInputValues, action) {
	switch (action.type) {
		case SET_EMAIL_INPUT_VALUE:
			return produce(state, (draft) => {
				draft.email = action.payload;
			});
		case SET_USER:
			return produce(state, (draft) => {
				draft.user = action.payload;
			});
		case SET_FORM_TYPE:
			return produce(state, (draft) => {
				draft.formType = action.payload;
			});
		default:
			return state;
	}
}
