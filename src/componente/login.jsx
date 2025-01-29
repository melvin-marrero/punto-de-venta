import "../hojasEstilo/login.css";
import { useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios"

export default function Login() {
    const {register,handleSubmit,formState: { errors } }=useForm();
    const [errorMessage, setErrorMessage]=useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Si el token ya está en localStorage, redirige automáticamente al PanelAdmin
        if (localStorage.getItem("token")) {
          navigate("/home");
        }
      }, [navigate]);

      const enviarForm = handleSubmit(async (data) => {
        try {
          const response = await axios.post("http://localhost:3000/api/auth/login", {
            email: data.email,
            contraseña: data.contraseña,
          }, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
          });
    
          // Si la respuesta es exitosa, guarda el token en localStorage
          localStorage.setItem("token", response.data.token);
          
          // Redirige al panelAdmin tras iniciar sesión
          navigate("/home");
    
        } catch (error) {
          setErrorMessage("Email o contraseña incorrectos");
          console.error("Error en el login:", error.response ? error.response.data : error.message);
        }
      });
    return (
        < div className="container-login">
        <form action="" className="form-login" onSubmit={enviarForm}>
           <label htmlFor="email">User</label>
           <input type="text" id="email" placeholder="email"
           {...register("email",{ required: "Email es requerido" })}/>
           {errors.email && <span>{errors.email.message}</span>}

           <label htmlFor="cotraseña">password</label>
           <input type="password" id="cotraseña" placeholder="password*****"
           {...register("contraseña",{ required: "Contraseña es requerida" })}/>
           {errors.contraseña && <span>{errors.contraseña.message}</span>}
           {errorMessage && <span>{errorMessage}</span>}

           <input type="submit" value={"entrar"} className="btn-inp"/>
        </form>
        <div className="conten-image">
            <h4 className="h4-logi">punto de venta</h4>
            <img src="./imagenlogo.webp" alt="imagen-logo" />
        </div>
        </div>
    )
}