import { body, validationResult, ValidationChain } from "express-validator";
import { Request, Response, NextFunction } from "express";

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
      "Senha inválida, deve conter no mínimo 8 dígitos, 1 número, 1 letra maiúscula e 1 caractere especial."
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
	  default:
		return [];
	}
  }