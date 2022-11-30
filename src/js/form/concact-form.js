import React from "react";
import {render} from "react-dom";
import {Form} from 'react-final-form'
import CheckBox from "./checkbox";
import FormField from "./form-field";
import Input from "./input";
import {composeValidators, onlyRussianSymbolsAndNumberValidator, sleep} from "../utils";
import FormError from "./form-error";
import {
  emailValidator,
  formatEmail,
  formatPhone,
  formatRusSymbols,
  minSymbols,
  onlyRussianSymbolsValidator, phoneValidator,
  required
} from "../utils";
import Textarea from "./textarea";
import '../../css/form/contact-form.scss';


const ContactForm = () => {

  const onSubmit = async values => {
    await sleep(300)
    window.alert(JSON.stringify(values, 0, 2))
  }

  return (

    <div className={'container form'}>
      <div key={'info'} className={'form-info'}>
        <div key={'title'} className={'form-info-title'}>Контакты</div>
        <div key={'contacts'} className={'form-info-contacts'}>
          <a href={'#'} key={'email'} className={'form-info-contacts-email'}>office@a-rgo.ru</a>
          <a href={'#'} key={'phone'} className={'form-info-contacts-phone'}>8(812) 327-45-05</a>
        </div>
        <div key={'text'} className={'form-info-text'}>Напишите нам сообщение и мы свяжемся с вами в ближайшее
          время
        </div>
        <div key={'required'} className={'form-info-required'}>Все поля обязательны к заполнению</div>
      </div>
      <Form
        key={1}
        onSubmit={onSubmit}
        render={({handleSubmit}) => (
          <div key={'table'} className={'col-xs-12 col-md-12 col-xxl-11 col-xxxl-9 form-table'}>
            <form key={2} onSubmit={handleSubmit}>
              <div className={'row'}>
                <div className={'col-xs-12 col-md-12 col-lg-4 pe-lg-0 position-relative'}>
                  <FormField
                    id={'name'}
                    key={'name'}
                    name={'name'}
                    component={<Input/>}
                    type={'text'}
                    placeholder={'Имя'}
                    format={formatRusSymbols}
                    validate={composeValidators(required, onlyRussianSymbolsValidator, minSymbols(2))}
                  />
                  <FormError key={'nameError'} name={'name'}/>
                </div>
                <div className={'col-xs-12 col-md-6 col-lg-4 pe-md-0 ps-lg-0 position-relative'}>
                  <FormField
                    id={'phone'}
                    key={'phone'}
                    name={'phone'}
                    component={<Input/>}
                    type={'text'}
                    placeholder={'Телефон'}
                    format={formatPhone}
                    validate={composeValidators(required, phoneValidator)}
                  />
                  <FormError key={'phoneError'} name={'phone'}/>
                </div>
                <div className={'col-xs-12 col-md-6 col-lg-4 ps-md-0 position-relative'}>
                  <FormField
                    id={'email'}
                    key={'email'}
                    name={'email'}
                    component={<Input/>}
                    type={'email'}
                    placeholder={'Email'}
                    format={formatEmail}
                    validate={composeValidators(required, emailValidator)}
                  />
                  <FormError key={'emailError'} name={'email'}/>
                </div>
                <div className={'col-xs-12 col-md-12 position-relative'}>
                  <FormField
                    id={'message'}
                    key={'message'}
                    name={'message'}
                    component={<Textarea minHeight={100}/>}
                    type={'textarea'}
                    placeholder={'Сообщение'}
                    format={formatRusSymbols}
                    validate={composeValidators(required, onlyRussianSymbolsAndNumberValidator, minSymbols(2))}
                  />
                  <FormError key={'messageError'} name={'message'}/>
                </div>
                <div className={'col-xs-12 col-md-6 col-lg-8 pe-md-0 ps-md-0 d-flex align-items-md-center form-table-agreement'}>
                  <FormField
                    id={'agreement'}
                    key={'agreement'}
                    name={'agreement'}
                    component={<CheckBox/>}
                    type={'checkbox'}
                    placeholder={'Сообщение'}
                    desc={<div>Я согласен на <a key={'link'} href={'#'}>обработку персональных данных</a></div>}
                    validate={required}
                  />
                  <FormError key={'agreementError'} name={'agreement'}/>
              </div>
                  <div className={'col-xs-12 col-md-6 col-lg-4 ps-md-0'}>
                  <button key={'submit'} className={'form-table-submit'}>Отправить заявку</button>
                  </div>
              </div>
            </form>
          </div>
        )}
      />
    </div>
  )
}

render(
  <ContactForm/>
  , document.getElementById(`contact-form-app`));
