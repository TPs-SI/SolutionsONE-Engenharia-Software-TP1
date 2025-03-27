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

