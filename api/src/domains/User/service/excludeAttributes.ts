const itensPermitidos = ["id", "email", "name", "photo", "cellphone","birth","status","role"]; // Removido 'projects' daqui também se for só relação

export const selectItems = Object.fromEntries(
    itensPermitidos.map(item => [item, true])
);

// Corrigido: Removido github, idGoogle. 'projects' tratado separadamente se necessário.
const itensPermitidos2 = ["id", "email", "name", "photo", "cellphone","birth","status","role"]; 

export const selectItems2 = Object.fromEntries(
    itensPermitidos2.map(item => [item, true])
);

// Se alguem precisar incluir projetos em readMyUser, use 'include' na query do service,
// não tente colocar 'projects' em selectItems2. Exemplo:
// const user = await prisma.user.findUnique({
//     where: { id },
//     select: selectItems2, // Seleciona campos escalares
//     include: { projects: true } // Inclui a relação
// });