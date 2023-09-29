import React, { FormEvent, useState } from 'react'
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
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(validate()){
            //make a POST

        }
    }

    const validate = () : Boolean => {
        let isValid = true

        setError(prev => {
            const stateObj: IAccount = {
                email: '',
                password: '',
                confirmPassword: ''
            };
            
            for(let name in account){
                switch(name){
                    case "email":
                        if(!account[name]){
                            stateObj[name] = "Can't be empty"
                            isValid = false
                        }
                        break
                    case "password":
                        if(!account[name]){
                            stateObj[name] = "Please enter password"
                        } else if (account.confirmPassword && account[name] !== account.confirmPassword){
                            stateObj['confirmPassword'] = "Password do not match. Please check again."
                        } else if(account.password && account.password.length < 8) {
                            stateObj[name] = "Your password must be atleast 8 characters."
                        }
                        break
                    case "confirmPassword":
                        if(!account[name]){
                            stateObj[name] = "This field cannot be empty"
                        }
                        break
                    default:
                        stateObj['email'] = ''
                        stateObj['password'] = ''
                        stateObj['confirmPassword'] = ''
                        break
                }
            }

            return stateObj

        })

        return isValid

    }
    console.log('set-acc', account)

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
                            <label>Email address</label>
                            <input name="email" type="text" onChange={e => handleChange(e)} value={account.email} placeholder='e.g.alex@email.com'/>
                            <img src={emailSymbol} alt="email symbol"/>
                            {error.email && <span className='text-danger'>{error.email}</span>}
                        </div>
                        <div className="create-account__form-input">
                            <label>Create Password</label>
                            <input name="password" type="password" onChange={e => handleChange(e)} value={account.password}placeholder='Atleast 8 characters'/>
                            <img src={passwordSymbol} alt="email symbol"/>
                            {error.password && <span className='text-danger'>{error.password}</span>}
                        </div>
                        <div className="create-account__form-input">
                            <label>Confirm Password</label>
                            <input name="confirmPassword" type="password" onChange={e => handleChange(e)} value={account.confirmPassword} placeholder='Atleast 8 characters'/>
                            <img src={passwordSymbol} alt="email symbol"/>
                            {error.confirmPassword && <span className='text-danger'>{error.confirmPassword}</span>}
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