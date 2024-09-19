import React, { useEffect, useState } from 'react'
import './Register.scss'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import FormSelect from '../../components/form/form_select/FormSelect';
import FormInput from '../../components/form/input_form/FormInput';



export default function Register() {
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
        name: "",
        level: ""
    });

    const [err, setErr] = useState(null);

    const navigate = useNavigate()

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        console.log(inputs)
    };

    console.log(inputs)

    const handleClick = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:9900/api/auth/register", inputs);
            navigate("/signin");
        } catch (err) {
            setErr(err.response.data);
            console.log(err);
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0 })
    }, [])

    const formElements = [
        {
            id: 1,
            name: "username",
            placeholder: "Логін",
            type: "text",
            errorMessage:
                "Логін має бути від 3 до 30 символів, англійською та без спеціальних символів",
            pattern: "^[A-Za-z0-9]{3,30}$",
            required: true
        },
        {
            id: 2,
            name: "name",
            placeholder: "Ім'я",
            type: "text",
            errorMessage:
                "Ім'я має містити від 3 до 60 символів та не включати цифр або спеціальних символів.",
            pattern: "^[A-Za-zА-Яа-я0-9іІїЇЄє ]{3,60}$",
            required: true
        },
        {
            id: 3,
            name: "level",
            required: true,
            placeholder:"Оберіть ваш рівень кулінарії",
            opts: [
                {
                    id: 1,
                    name: "Оберіть ваш рівень кулінарії",
                    value: "",
                },
                {
                    id: 2,
                    name: "Amateur",
                    value: "Аматор",
                },
                {
                    id: 3,
                    name: "Home Cook",
                    value: "Любитель",
                },
                {
                    id: 4,
                    name: "Expert",
                    value: "Експерт",
                }
            ]
        },
        {
            id: 4,
            name: "email",
            type: "email",
            placeholder: "E-mail",
            errorMessage: "Це повинна бути дійсна електронна адреса!",
            required: true,
        },
        {
            id: 5,
            name: "password",
            type: "password",
            placeholder: "Пароль",
            errorMessage: "Пароль повинен бути довжиною 8-30 символів та містити принаймі одну літеру, цифру та спеціальний символ",
            pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$`,
            required: true,
        },

    ];

    return (
        <div className="register_page inter-regular">
            <div className="register_card">
                <div className="left">
                    <div className='content'>
                        <span className='header montserrat-alternates-bold'>Привіт, Кулінаре!</span>
                        <p>
                            Зареєструйтесь та зберігайте свої улюблені рецепти, щоб не втратити їх &#59;&#41;
                        </p>
                        <span>Вже маєте обліковий запис?</span>
                        <Link to="/signin">
                            <button className='inter-medium'>Вхід</button>
                        </Link>
                    </div>

                </div>
                <div className="right">

                    <span className='header montserrat-alternates-bold'>Реєстрація</span>
                    <form onSubmit={handleClick}>
                        {formElements.map((elem) => (
                            elem.name === "level" ?
                                <FormSelect 
                                    key={elem.id}
                                    {...elem}
                                    value={elem.value}
                                    onChange={handleChange}

                                />
                                :
                                <FormInput
                                    key={elem.id}
                                    {...elem}
                                    value={elem.value}
                                    onChange={handleChange}
                                />
                        ))}
                        <button className='inter-medium'>Реєстрація</button>

                        {err && <span className="show_error" style={{ color: "red" }}>{err}</span>}

                    </form>

                </div>
            </div>
        </div>
    )
}
