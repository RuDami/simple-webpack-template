import React from "react";
import '../../css/form/checkbox.scss'

const CheckBox = ({id, className, input, desc}) => {
 // const {id, className, input, desc} = props
 //  console.log('props', props)
  const inputClass = 'checkbox'
  return (
    <label className={inputClass} htmlFor={id}>
      <input
        {...input}
        type={'checkbox'}
        className={className}
        id={id}
      />
      <i/>
      {desc}
    </label>
  )
}
export default CheckBox
