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


