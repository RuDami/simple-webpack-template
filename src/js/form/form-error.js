import React from "react";
import {Field} from 'react-final-form'
import {isEmptyObject} from '../utils/index';
import '../../css/form/form-error.scss'

export const FormErrorMessage = ({show = true, text, field, children}) => !!show && (
  <p data-field-error-message={field} className={`error form-message`}>{text}{children}</p>
)
export const FormSuccessMessage = ({show = true, text, field, children}) => !!show && (
  <p data-field-success-message={field} className={`success form-message`}>{text}{children}</p>
)
export const FormTipMessage = ({show = true, text, field, children}) => !!show && (
  <p data-field-tip-message={field} className={`tip form-message`}>{text}{children}</p>
)

const FormError = ({name, tip, successMessage}) => (
  <Field
    name={name}
    subscription={{touched: true, error: true, active: true, value: true, validating: true}}
    render={({meta: {touched, error, active, validating}, input: {value}}) => {
      const isShowErr = ((touched && (value?.length === 0 || !isEmptyObject(value))) || ((value?.length > 0 || !isEmptyObject(value)) && (active || touched))) && !!error
      const isShowTip = !!tip && (touched || active) && !error
      const isSuccess = value?.length > 0 && touched && !error && !!successMessage && !validating
      return (
        <>
          <FormErrorMessage show={isShowErr} field={name} text={error}/>
          <FormSuccessMessage show={isSuccess} field={name}
                              text={successMessage}/>
          <FormTipMessage show={isShowTip} field={name} text={tip}/>
        </>
      )
    }
    }
  />
)
export default FormError
