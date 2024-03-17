import React from 'react'

function Register() {
    const [name,setName]=useState()
const [mobileNumber,setMobileNumber]=useState()
const [email,setEmail]=useState()
const [password,setPassword]=useState()
const [loginEmail,setLoginEmail]=useState()
const [loginPassword,setLoginPassword]=useState()

const navigate=useNavigate()

  const [formPosition, setFormPosition] = useState({ login: '50px', register: '-400px', btn: '0' });
  const register = () => {
    setFormPosition({ login: '-400px', register: '50px', btn: '110px' });
  };

  const login = () => {
    setFormPosition({ login: '50px', register: '450px', btn: '0' });
  };

  const handleloginSubmit=(e)=>{
    e.preventDefault()
    console.log(loginEmail)
    axios.post('https://backend-1-1trx.onrender.com/login',{loginEmail,loginPassword})
    .then(result => {
        console.log(result)
        if(result.data==="Success"){
          navigate('/home')
        }
        })
    .catch(err=>console.log(err))
     
  }

  const handleregisterSubmit=(e)=>{
    e.preventDefault()
    axios.post('https://backend-1-1trx.onrender.com/user',{name,mobileNumber,email,password})
    .then(result => console.log(result))
    .catch(err=>console.log(err))
     
  }

  return (
    <div className="head">
      <div className="fbox">
        <div className="button-box">
          <div id="btn" style={{ left: formPosition.btn }}></div>
          <button type="button" className="toggle-button" onClick={login}>Log In</button>
          <button type="button" className="toggle-button" onClick={register}>Register</button>
        </div>
        <div className="social-icons">
          <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="Google Icon" />
        </div>
        <form onSubmit={handleloginSubmit} id="login" className="input-details" style={{ left: formPosition.login }}>
          <input type="text" id="UserIdl" className="input-field" placeholder="Email Id" onChange={(e)=> setLoginEmail(e.target.value)} required />
          <input type="text" id="passwordl" className="input-field" placeholder="Enter the Password" onChange={(e)=> setLoginPassword(e.target.value)} required />
          <input type="checkbox" id="agreel" className="chck-box" /><span>Remember Password</span>
          <button type="submit" id="submitl" className="sbt-btn">Log in</button>
        </form>
        <form onSubmit={handleregisterSubmit} id="register" className="input-details" style={{ left: formPosition.register }}>
          <input type="text" id="UserIdr" className="input-field" placeholder="User Name" onChange={(e)=> setName(e.target.value)} required />
          <input type="email" id="emailr" className="input-field" placeholder="Email Id" onChange={(e)=> setEmail(e.target.value)} required />
          <input type="text" id="numberr" className="input-field" placeholder="Enter PhoneNumber" onChange={(e)=> setMobileNumber(e.target.value)}/>
          <input type="text" id="passwordr" className="input-field" placeholder="Enter the Password" onChange={(e)=> setPassword(e.target.value)} required />
          <input type="checkbox" id="agreer" className="chck-box" /><span>Agree to the terms and conditions</span>
          <button type="submit" id="submitr" className="sbt-btn">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register