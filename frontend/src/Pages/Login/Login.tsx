import React , {useState} from 'react';
import { Link } from 'react-router-dom';
import { Logo, emailSymbol, passwordSymbol} from '../../assets';
import './Login.sass';

const Login = () => {

    const [email, setEmail] = useState<String>('')
    const [error, setError] = useState<Boolean>()

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
        console.log('e-target-value', e.target.value)

        setError(e.target.value.trim().length === 0);
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
                <form>
                    <div className="login__form-input">
                        <label className={error ? 'error-text' : undefined}>Email address</label>
                        <input className={error ? 'error-input' : undefined} type="text" onChange={e => {handleChange(e)}} placeholder='e.g.alex@email.com'/>
                        { error && <p>Can't be empty</p>}
                        <img src={emailSymbol} alt="email symbol"/>
                    </div>
                    <div className="login__form-input">
                        <label>Password</label>
                        <input type="password" placeholder='Enter your password'/>
                        <img src={passwordSymbol} alt="email symbol"/>
                    </div>
                </form>
                <div className='login__button'>
                    <button>Login</button>
                </div>
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