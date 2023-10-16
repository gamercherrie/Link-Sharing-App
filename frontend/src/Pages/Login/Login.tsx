import React , {useState} from 'react';
import { Link } from 'react-router-dom';
import { Logo, emailSymbol, passwordSymbol} from '../../assets';
import './Login.sass';

interface IUser {
    email: string,
    password: string
    response?:string
}

const Login = () => {

    const [login, setLogin] = useState<IUser>({
        email: '',
        password: ''
    })
    const [error, setError] = useState<IUser>({
        email: '',
        password: '',
        response: ''
    })

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        const newLoginState = { ...login, [name]: value }

        console.log('prospective login state:', newLoginState);

        let newErrorState = { ...error, [name]: '' }
        console.log('newErrorstate', newErrorState)
        switch (name) {
            case 'email':
                if (!newLoginState[name])
                    newErrorState[name] = "Email can't be empty."
                break
            case 'password':
                if (!newLoginState[name])
                    newErrorState[name] = "Password can't be empty."
                break
        }
        setLogin(newLoginState)
        setError(newErrorState)
    }

    console.log('login')
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const response = await fetch('/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/JSON'},
            body: JSON.stringify(login)
        })
        const status = await response.text()
        setError(prevState => ({...prevState, response: status}))
        console.log(response)
    }

    return(
    <div className='login'>
        <div className="login__header">
            <img src={Logo} alt="devlink logo"></img>
        </div>
        <div className="login__container">
            <div className="login__details">
                <p><span>Login</span> Add your details below to get back into the app</p>
            </div>
            <div className="login__form">
                <form onSubmit={handleSubmit}>
                    <div className="login__form-input">
                        <label className={error.email ? 'error-text' : undefined}>Email address</label>
                        <input className={error.email ? 'error-input' : undefined} name="email" type="text" onChange={handleChange} placeholder='e.g.alex@email.com'/>
                        { error.email && <p>{error.email}</p>}
                        <img src={emailSymbol} alt="email symbol"/>
                    </div>
                    <div className="login__form-input">
                        <label>Password</label>
                        <input type="password" placeholder='Enter your password' name="password" onChange={handleChange}/>
                        <img src={passwordSymbol} alt="email symbol"/>
                        {error.password && <p>{error.password}</p>}
                    </div>
                    <div className='login__button'>
                        <input value="Login" type="submit" name="button"/>
                    </div>
                    {error.response && <span className='submission-error'>{error.response}</span>}
                </form>
                <div className='login__no-account'>
                    <p>Don't have an account?</p>
                    <Link to="/register">Create account</Link>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Login;