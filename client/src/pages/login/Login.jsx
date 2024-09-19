import React, { useContext, useEffect, useState } from 'react'
import './Login.scss'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../stores/authStore';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

export default function Login() {


    const [inputs, setInputs] = useState({
        username: "",
        password: "",
    });


    const [err, setErr] = useState(null);

    const navigate = useNavigate()

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const { currentUser, login, logout } = useAuthStore();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(inputs);
        } catch (err) {
            setErr("Невірний логін чи пароль");
        }
    };


    useEffect(() => {
        if (currentUser) {
            navigate("/");
        }

    }, [currentUser]);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0 })
    }, [])

    return (
        <div className="login_page inter-regular">
            <div className="login_card">
                <div className="left">
                    <div className='content'>
                        <span className='header montserrat-alternates-bold'>Привіт, Кулінаре!</span>
                        <p>
                            Увійдіть та збережіть свої улюблені рецепти, щоб не втратити їх &#59;&#41;
                        </p>
                        <span>Ще не маєте облікового запису?</span>
                        <Link to="/signup">
                            <button className='inter-medium'>Реєстрація</button>
                        </Link>
                    </div>

                </div>
                <div className="right">

                    <span className='header montserrat-alternates-bold'>Вхід до акаунту</span>
                    <form>
                        <input
                            type="text"
                            placeholder="Логін"
                            name="username"
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            name="password"
                            onChange={handleChange}
                        />
                        <button className='inter-medium' onClick={handleLogin}>Вхід</button>
                        {err && <div className='show_error'><PriorityHighIcon style={{ color: "#e700000" }} /><div>{err}</div></div>}
                    </form>
                </div>
            </div>
        </div>
    )
}
