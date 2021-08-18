export function displayToast(toast, id, type, description, onCloseComplete = null) {
	if (!toast.isActive(id)) {
		toast({
			id,
			position: "top",
			status: type,
			description,
			duration: 4000,
			isClosable: true,
			onCloseComplete,
		});
	}
}
