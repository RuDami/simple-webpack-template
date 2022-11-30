import React from "react";

export  const error = {
  required: 'Заполните все обязательные поля',
  minSymbols : (length) => `Минимальное количество символов: ${length || 0}`,
  onlyDigits: 'Допустимы только цифры',
  phoneNotValid: 'Введите номер телефона в формате +7(999) 999-99-99',
  email: 'Введите e-mail в формате user@domain.tld',
  onlyRussianWords: 'Допустимы только русская кириллица и тире.',
  onlyRussianSymbolsAndNumber: 'Допустимы только русская кириллица, №, (, ), цифры, тире, точки и запятые',
}
