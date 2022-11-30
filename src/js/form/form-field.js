import React from "react";
import {Field} from 'react-final-form'
// import './form-field.scss'

const FormField = ({component, children, miniField, type, allowRecord = false, className, ...other}) => {


  return (
    <Field {...other}
           type={type}
           render={(props) => {
             const {meta: {touched, error, active, data}} = props
             if (props) {
               const formFieldClass = miniField ? 'form-field-mini ' : 'form-field'
               const isTouch = touched ? 'touch' : ''
               const isFocus = active ? 'focus' : ''
               const isError = touched && !active && error ? 'isError error' : ''
               const isGood = touched && !error ? 'success isSuccess' : ''
               const isAllowRecord = allowRecord ? 'ym-record-keys ym-show-content' : ''
               const classes = `${isTouch} ${isFocus} ${isError} ${isGood} ${isAllowRecord}`
               return (
                 <div className={`${formFieldClass} ${classes}`}>
                   {
                     typeof component !== 'string' ?
                       React.cloneElement(component, {
                         className: `${className ? className : ''} ${classes}`,
                         type, ...props
                       }) :
                       <Field  type={type} {...other} className={`${className ? className : ''} ${classes}`}/>
                   }
                   {children}
                   {touched && data.warning && (<span>{data.warning}</span>)}
                 </div>
               )
             }
             return null
           }}
    />
  )
}
export default FormField
