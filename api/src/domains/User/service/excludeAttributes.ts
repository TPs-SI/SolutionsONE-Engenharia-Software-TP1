const itensPermitidos = ["id", "email", "name", "photo", "cellphone","birth","github","status","role", "projects"];

export const selectItems = Object.fromEntries(
	itensPermitidos.map(item => [item, true])
);

const itensPermitidos2 = ["id", "email", "name", "photo", "cellphone","birth","github","status","idGoogle","role", "projects"];

export const selectItems2 = Object.fromEntries(
	itensPermitidos2.map(item => [item, true])
);