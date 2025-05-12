import { body, validationResult, ValidationChain } from "express-validator";
import { Request, Response, NextFunction } from "express";
import statusCodes from "../../utils/constants/statusCodes";

/* ============================ */
/*        Express Regex         */
/* ============================ */
const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
const phoneRegex = /^(\+?[1-9]\d{0,2}\s?)?(\(?\d{2,3}\)?[\s-]?)?\d{4,5}[\s-]?\d{4}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/* ============================ */
/*       Validações Usuário     */
/* ============================ */

// Validação de e-mail
function emailValidation(optional = true): ValidationChain {
  let validator = body("email");
  if (optional) {
    validator = validator.optional({ checkFalsy: true });
  }
  return validator
  .notEmpty()
  .withMessage("Insira seu e-mail!")
  .isEmail()
  .withMessage("Email inválido!");
}

// Validação de nome
function nameValidation(optional = true): ValidationChain {
  let validator = body("name");
  if (optional) {
    validator = validator.optional({ checkFalsy: true });
  }
  return validator
  .notEmpty()
  .withMessage("Insira seu nome!");
}

// Validação de senha (padrão)
function passwordValidation(optional = false): ValidationChain {
  let validator = body("password");
  if (optional) {
    validator = validator.optional({ checkFalsy: true });
  }
  return validator
  .notEmpty()
  .withMessage("Insira sua senha!")
  .matches(passwordRegex)
  .withMessage(
    "Senha inválida, deve conter no mínimo 8 dígitos. Dentre eles um número, uma letra maiúscula, uma letra minúscula e 1 caractere especial."
  );
}

// Validação de senha para redefinição (reset)
function resetPasswordValidation(optional = false): ValidationChain {
  let validator = body("newPassword");
  if (optional) {
    validator = validator.optional({ checkFalsy: true });
  }
  return validator
  .notEmpty()
  .withMessage("Insira sua senha!")
  .matches(passwordRegex)
  .withMessage(
    "Senha inválida, deve conter no mínimo 8 dígitos, 1 número, 1 letra maiúscula e 1 caractere especial."
  );
}

// Validação de telefone
function cellphoneValidation(optional = true): ValidationChain {
  let validator = body("cellphone");
  if (optional) {
    validator = validator.optional({ checkFalsy: true });
  }
  return validator
  .notEmpty()
  .withMessage("Insira seu telefone!")
  .matches(phoneRegex)
  .withMessage("Número de telefone deve estar no formato XX (XX) YYYYYY-YYYY.");
}

// Validação de data de nascimento
function birthValidation(optional = true): ValidationChain {
  let validator = body("birth");
  if (optional) {
    validator = validator.optional({ checkFalsy: true });
  }
  return validator
  .notEmpty()
  .withMessage("Insira sua data de nascimento")
  .matches(dateRegex)
  .withMessage("Data de nascimento deve estar no formato DD/MM/YYYY");
}
/* ============================ */
/*      Validações Contratos    */
/* ============================ */

function titleValidation(optional = true): ValidationChain {
  let validator = body("title");
  if (optional) {
      validator = validator.optional({ checkFalsy: true });
  }
  return validator
      .isString()
      .withMessage("O título deve está em formato de string!")
      .notEmpty()
      .withMessage("Insira o título!");
}

function nameClientValidation(optional = true): ValidationChain {
  let validator = body("nameClient");
  if (optional) {
      validator = validator.optional({ checkFalsy: true });
  }
  return validator
      .isString()
      .withMessage("O nome do cliente deve está em formato de string!")
      .notEmpty()
      .withMessage("Insira o nome do cliente!");
}

function valueValidate(opcional = true): ValidationChain {
  let validador = body("value");
  if (opcional) {
      validador = validador.optional({ checkFalsy: true });
  }
  return validador
      .isFloat({ min: 0.01 })  
      .withMessage("O valor do contrato deve ser um número positivo!")
      .notEmpty()
      .withMessage("Insira o valor do contrato!");
}

function dateValidation(optional = true): ValidationChain {
  let validator = body("date");
  if (optional) {
      validator = validator.optional({ checkFalsy: true });
  }
  return validator
      .notEmpty()
      .withMessage("Insira a data da venda!")
      .matches(dateRegex)
      .withMessage("Data da venda deve estar no formato DD/MM/YYYY")
}

/* ============================ */
/*      Validações Projetos    */
/* ============================ */

function nameProjectValidationUpdate(optional = true): ValidationChain {
  let validator = body("name");
  if (optional) {
    validator = validator.optional({ checkFalsy: true });
  }
  return validator
  .isString()
  .withMessage("Insira um nome para o projeto, que deve estar em formato de string!")

}

function contractProjectValidationUpdate(optional = true): ValidationChain {
  let validator = body("contractId");
  if (optional) {
    validator = validator.optional({ checkFalsy: true });
  }
  return validator
  .custom((value) => {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error("Insira um id de contrato, que deve ser um número inteiro positivo!");
    }
    return true;
  });
  
}

function projectDateValidationUpdate(optional = true): ValidationChain {
  let validator = body("date");
  if (optional) {
    validator = validator.optional({ checkFalsy: true });
  }
  return validator
  .matches(dateRegex)
  .withMessage("Data da venda deve estar no formato DD/MM/YYYY ou nula!")

}


// Validação para o campo "function" dentro do array "team"
function projectFunctionValidationUpdate(optional = true): ValidationChain {
  let validator = body('team')
  if (optional) {
    validator = validator.optional({ checkFalsy: true });
  }
  return validator
  .isArray({ min: 1 })
  .withMessage('O array de equipe deve conter pelo menos um item.')
  .custom((team) => {
    for (const userProject of team) {
      if (typeof userProject.function !== 'string' || !userProject.function.trim()) {
        throw new Error('A função deve estar em formato de string e não pode estar vazia.');
      }
    }
    return true;
  });
}

// Validação para o campo "userId" dentro do array "team"
function userIdProjectValidationUpdate(optional = true): ValidationChain {
  let validator = body('team')
  if (optional) {
    validator = validator.optional({ checkFalsy: true });
  }
  return validator
  .isArray({ min: 1 })
  .withMessage('O array de equipe deve conter pelo menos um item.')
  .custom((team) => {
    for (const userProject of team) {
      if (!Number.isInteger(userProject.userId) || userProject.userId <= 0) {
        throw new Error('Seu ID deve ser um número inteiro positivo.');
      }
    }
    return true;
  });
}

function nameProjectValidation(optional = false): ValidationChain {
  let validator = body("name");
  if (optional) {
    validator = validator.optional({ checkFalsy: true });
  }
  return validator
  .isString()
  .withMessage("Insira um nome para o projeto, que deve estar em formato de string!")

}

function contractProjectValidation(optional = false): ValidationChain {
  let validator = body("contractId");
  if (optional) {
    validator = validator.optional({ checkFalsy: true });
  }
  return validator
  .custom((value) => {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error("Insira um id de contrato, que deve ser um número inteiro positivo!");
    }
    return true;
  });
  

}

function projectDateValidation(optional = true): ValidationChain {
  let validator = body("date");
  if (optional) {
    validator = validator.optional({ checkFalsy: true });
  }
  return validator
  .matches(dateRegex)
  .withMessage("Data da venda deve estar no formato DD/MM/YYYY ou nulo")

}

function projectFunctionValidation(): ValidationChain {
  return body('team')
  .isArray({ min: 1 })
  .withMessage('O array de equipe deve conter pelo menos um item.')
  .custom((team) => {
    for (const userProject of team) {
      if (typeof userProject.function !== 'string' || !userProject.function.trim()) {
        throw new Error('A função deve estar em formato de string e não pode estar vazia.');
      }
    }
    return true;
  });

}

// Validação para o campo "userId" dentro do array "team"
function userIdProjectValidation(): ValidationChain {
  return body('team')
  .isArray({ min: 1 })
  .withMessage('O array de equipe deve conter pelo menos um item.')
  .custom((team) => {
    for (const userProject of team) {
      if (!Number.isInteger(userProject.userId) || userProject.userId <= 0) {
        throw new Error('Seu ID deve ser um número inteiro positivo.');
      }
    }
    return true;
  });

}

function confirmPasswordValidation(fieldName = "confirmPassword"): ValidationChain {
  return body(fieldName)
    .notEmpty()
    .withMessage("Confirmação de senha é obrigatória!");
    // A checagem se é igual a newPassword é feita no service/controller
}

// --- NOVA FUNÇÃO DE VALIDAÇÃO PARA 'oldPassword' (opcional, só checa se existe) ---
function oldPasswordValidation(): ValidationChain {
  return body("oldPassword")
    .notEmpty()
    .withMessage("Senha antiga é obrigatória!");
}

/* ============================ */
/*      Rotas de Validação      */
/* ============================ */

// Função que retorna as validações de acordo com a rota solicitada
function getEngineerValidations(route: string) {
  switch (route) {
    case "create":
    return [
      emailValidation(),
      nameValidation(),
      passwordValidation(),
      cellphoneValidation(),
      birthValidation(),
    ];
    case "update":
    return [
      emailValidation(),
      nameValidation(),
      cellphoneValidation(),
      birthValidation(),
    ];
    case 'createContract':
      return [
        titleValidation(),
        nameClientValidation(),
        valueValidate(),
        dateValidation(),
      ];
    
    case 'updateContract':
    return [
      titleValidation(),
      nameClientValidation(),
      valueValidate(),
      dateValidation(),
    ];
    
    case 'createProject':
    return [
      projectDateValidation(),
      contractProjectValidation(),
      nameProjectValidation(),
      projectFunctionValidation(),
      userIdProjectValidation(),
    ];
    case 'updateProject':
    return[
      projectDateValidationUpdate(),
      contractProjectValidationUpdate(),
      nameProjectValidationUpdate(),
      projectFunctionValidationUpdate(),
      userIdProjectValidationUpdate(),
    ];
    case "updateAccountPassword": 
      return [
        oldPasswordValidation(),       
        resetPasswordValidation(),    
        confirmPasswordValidation()  
      ];
      case "adminUpdatePassword":
      return [
        resetPasswordValidation(),   
        confirmPasswordValidation()   
      ];
    default:
    return [];

  }
}

// Middleware que executa as validações para a rota do engenheiro
export function validateEngineerRoute(route: string) {

  const validations = getEngineerValidations(route);
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!validations || validations.length === 0) {
      return next();
    }

    for (const validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    return res.status(statusCodes.BAD_REQUEST).json({ errors: errors.array() });

  };
}