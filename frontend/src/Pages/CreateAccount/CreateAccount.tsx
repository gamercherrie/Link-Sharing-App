import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Logo, emailSymbol, passwordSymbol} from '../../assets';
import './CreateAccount.sass'

interface IAccount {
    email: string,
    password: string,
    confirmPassword: string
}
const CreateAccount = () => {

    const [account, setAccount] = useState<IAccount>({
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [error, setError] = useState<IAccount>({
        email: '',
        password: '',
        confirmPassword: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)  => {
        const {name, value} = e.target
        setAccount(prevData => ({...prevData, [name]: value}))
        validateCurrentInput(name as keyof IAccount, value)
    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(validate()){
            const response = await fetch('/add-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/JSON'},
                body: JSON.stringify(account)
            })

        }
    }

    const validateCurrentInput = (name?: keyof IAccount, value?: string) => {
        let isValid = true

        setError(prev => {
            

            const stateObj: IAccount = name ? {...prev, [name]: ''} :  {...prev}

            const validateField = (fieldName: string, fieldValue: string) => {
                switch(fieldName){
                    case "email":
                        if(!account[fieldName]){
                            stateObj[fieldName] = "Can't be empty"
                            isValid = false
                        }
                        break
                    case "password":
                        if(!account[fieldName]){
                            stateObj[fieldName] = "Please enter password"
                        } else if (account.confirmPassword && account[fieldName] !== account.confirmPassword){
                            stateObj['confirmPassword'] = "Password do not match."
                        } else if(account.password && account.password.length < 8) {
                            stateObj[fieldName] = "Your password must be atleast 8 characters."
                        }
                        break
                    case "confirmPassword":
                        if(!account[fieldName]){
                            stateObj[fieldName] = "This field cannot be empty"
                        }
                        break
                    default:
                        stateObj['email'] = ''
                        stateObj['password'] = ''
                        stateObj['confirmPassword'] = ''
                        break
                }
            }

            if(name && value){
                validateField(name, value)
            }else{
                for(let fieldName in account){
                    validateField(fieldName, account[fieldName as keyof IAccount])
                }
            }

            return stateObj
        })

        return isValid
    }

    const validate = () : Boolean => {
        return validateCurrentInput()

    }

    return (
        <div className="create-account">
            <div className="create-account__header">
                <img src={Logo} alt="devlink logo"></img>
            </div>
            <div className="create-account__container">
                <div className="create-account__details">
                    <p><span>Create Account</span> Let's get you started sharing your links!</p>
                </div>
                <div className="create-account__form">
                    <form onSubmit={handleSubmit}>
                        <div className="create-account__form-input">
                            <label className={error.email ? 'error-text' : undefined}>Email address</label>
                            <input className={error.email ? 'error-input' : undefined} name="email" type="text" onChange={e => handleChange(e)} value={account.email} placeholder='e.g.alex@email.com'/>
                            <img src={emailSymbol} alt="email symbol"/>
                            {error.email && <span>{error.email}</span>}
                        </div>
                        <div className="create-account__form-input">
                            <label className={error.password ? 'error-text' : undefined}>Create Password</label>
                            <input className={error.password ? 'error-input' : undefined} name="password" type="password" onChange={e => handleChange(e)} value={account.password}placeholder='Atleast 8 characters'/>
                            <img src={passwordSymbol} alt="email symbol"/>
                            {error.password && <span>{error.password}</span>}
                        </div>
                        <div className="create-account__form-input">
                            <label className={error.confirmPassword ? 'error-text' : undefined}>Confirm Password</label>
                            <input className={error.confirmPassword ? 'error-input' : undefined} name="confirmPassword" type="password" onChange={e => handleChange(e)} value={account.confirmPassword} placeholder='Atleast 8 characters'/>
                            <img src={passwordSymbol} alt="email symbol"/>
                            {error.confirmPassword && <span>{error.confirmPassword}</span>}
                        </div>
                        <p>Password must contain at least 8 characters</p>
                        <div className='create-account__button'>
                            <input type="submit" value="Create new account" name="button"/>
                        </div>
                    </form>
                    <div className='create-account__no-account'>
                        <p>Already have an account?</p>
                        <Link to="/login">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateAccount