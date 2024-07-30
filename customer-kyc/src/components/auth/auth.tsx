import { FC, useState } from "react";
import { useNavigate } from 'react-router-dom';
import RegisterUser from "../../assets/registerUser.svg";
import LoginUser from "../../assets/loginUser.svg";
import axios from "axios";

import { baseURL } from "../../utils/constant";

type FormValuesType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

interface FieldTypes {
  name: keyof FormValuesType;
  type: string;
  placeholder: string;
}

const AuthPage: FC = () => {
  const [isSignUpPage, setIsSignUpPage] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormValuesType>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleToggleAuthPage = () => {
    setIsSignUpPage(!isSignUpPage);
  };

  const renderFormField = (props: FieldTypes): JSX.Element => {
    const { name, type, placeholder } = props;
    return (
      <input
        className="w-full px-5 py-3 rounded-lg font-medium border-2 border-transparent placeholder-gray-500 text-sm focus:outline-none bg-[#302E30] text-white focus:border-white"
        type={type}
        placeholder={placeholder}
        name={name}
        onChange={handleChange}
        value={formData[name]}
      />
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleLogIn = async() => {
    try {
        const response = await axios.post(`${baseURL}auth/login`, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status === 200) {
          const { token, userId } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId);
          navigate('/protected');
        }
      } catch (error) {
        console.error('Login error:', error);
      }
  }

  const handleSignUp = async() => {
    try {
        const response = await axios.post(
          `${baseURL}auth/signup`,
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
  
        if (response.status === 201) {
          const data = response.data;
          localStorage.setItem("token", data.token);
          localStorage.setItem('userId', data.userId);
          navigate('/protected');
          console.log("User signed up and token stored:", data.token);
        } else {
          console.error("SignUp error:", response.data);
        }
      } catch (error) {
        console.error("SignUp error:", error);
      }
  }

  const handleFormSubmit = async () => {
    if(isSignUpPage){
        await handleSignUp();
    } else {
        await handleLogIn();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-[100vh] bg-[#282D2D] px-5">
      <div className="flex flex-col items-end justify-start overflow-hidden mb-2 xl:max-w-3xl w-full"></div>
      <div className="xl:max-w-3xl bg-black w-full p-5 sm:p-10 rounded-md">
        <h1 className="text-center text-xl sm:text-3xl font-semibold text-white">
          {isSignUpPage ? "Admin Register" : "Admin Login"}
        </h1>
        <div className="w-full mt-8">
          <div className="mx-auto max-w-xs sm:max-w-md md:max-w-lg flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {isSignUpPage &&
                renderFormField({
                  name: "firstName",
                  type: "text",
                  placeholder: "Your first name",
                })}
              {isSignUpPage &&
                renderFormField({
                  name: "lastName",
                  type: "text",
                  placeholder: "Your last name",
                })}
            </div>
            {renderFormField({
              name: "email",
              type: "email",
              placeholder: "Your email",
            })}
            {renderFormField({
              name: "password",
              type: "password",
              placeholder: "Password",
            })}
            <button
              className="mt-5 tracking-wide font-semibold bg-[#E9522C] text-gray-100 w-full py-4 rounded-lg hover:bg-[#E9522C]/90 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
              onClick={handleFormSubmit}
            >
              <img
                src={isSignUpPage ? RegisterUser : LoginUser}
                className="w-6 h-6 -ml-2"
              />
              <span className="ml-3">
                {isSignUpPage ? "Register" : "Login"}
              </span>
            </button>
            <p className="mt-6 text-xs text-gray-600 text-center">
              {isSignUpPage
                ? "Already have an account?"
                : "Don't have account?"}{" "}
              <span onClick={handleToggleAuthPage}>
                <span className="text-[#E9522C] font-semibold cursor-pointer">
                  {isSignUpPage ? "Login" : "Register"}
                </span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
