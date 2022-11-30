import React, {Fragment} from "react";
import '../../css/form/input.scss'
import {sleep} from "../utils";

const Input = ({input, placeholder, id, className, desc, disabled, type, readOnly}) => {
  const inputClass = 'input'


  return (
    <>
      <input
        {...input}
        disabled={disabled}
        readOnly={readOnly}
        className={`${inputClass} ${className}`}
        placeholder={placeholder}
        id={id}
        type={type}
        value={input.value ? input.value : ''}
        onChange={e => {
          input?.onChange(e)
          if(e?.nativeEvent.inputType === 'insertFromPaste') {
            input?.onChange(e)
          }
        }}
        onKeyUp={async e => {
          input?.onKeyUp && input?.onKeyUp(e)
          await sleep(800);
          input.onChange(e)
        }}
        onBlur={e => {
          input.onChange(e)
          input?.onBlur && input.onBlur(e)
        }}
      />
      {desc}
    </>
  )

}
export default Input
