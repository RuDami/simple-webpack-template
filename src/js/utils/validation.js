import {error} from '../form/errors'

export const required = value => {
  return value ? undefined : error.required
}

export const minSymbols = length => value => {
  return value.length >= length ? undefined : error.minSymbols(length)
}

export const onlyDigits = value => {
  const pattern = /^([\d])*$/g
  return pattern.test(value) ? undefined : error.onlyDigits
}

export const phoneValidator = value => {
  const pattern = /^(\+7)?\s?\(?[1-9][0-9]{2}\)?\s?[0-9]{3}[-]?[0-9]{2}[-]?[0-9]{2}$/gm
  return pattern.test(value) ? undefined : error.phoneNotValid
}

export const emailValidator = value => {
  // eslint-disable-next-line
  const pattern = /^(([^А-Яа-я<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return pattern.test(value) ? undefined : error.email
}

export const onlyRussianSymbolsValidator = value => {
  const pattern = /^([а-яА-ЯёЁ\s-]+)$/
  return pattern.test(value) ? undefined : error.onlyRussianWords
}

export const onlyRussianSymbolsAndNumberValidator = value => {

  const pattern = /^([а-яА-ЯёЁ0-9\s\-N№".,()]+)$/

  return pattern.test(value) ? undefined : error.onlyRussianSymbolsAndNumber
}

