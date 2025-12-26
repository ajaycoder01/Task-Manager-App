


import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import Input from "../../components/Inputs/Input";
import { Link, useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

function Signup() {
  const [profilPic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!fullName) return setError("Please enter fullname");
    if (!validateEmail(email)) return setError("Invalid email address");
    if (!password) return setError("Please enter password");

    setError(null);

    try {
      //  FORM DATA
      const formData = new FormData();
      formData.append("name", fullName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("adminInviteToken", adminInviteToken);

      //  image optional
      if (profilPic) {
        formData.append("profileImage", profilPic);
      }

      const response = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        navigate(
          role === "admin" ? "/admin/dashboard" : "/user/dashboard"
        );
      }
    } catch (error) {
      console.error("SIGNUP ERROR:", error);
      setError(
        error.response?.data?.message || "Signup failed"
      );
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-full mt-10 flex flex-col justify-center">
        <h3 className="text-lg font-semibold">Create an Account</h3>
        <p className="text-sm text-slate-700 mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignup}>
          <ProfilePhotoSelector image={profilPic} setImage={setProfilePic} />

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder = "John"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
              label="Email Address"
              value={email}
              placeholder = "john@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder = "Min 8 Characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              label="Admin Invite Token"
              value={adminInviteToken}
              placeholder = "******"
              onChange={(e) => setAdminInviteToken(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs mt-2">{error}</p>
          )}

          <button className="btn-primary mt-4" type="submit">
            SIGN UP
          </button>

          <p className="text-sm mt-3">
            Already have an account?{" "}
            <Link to="/login" className="text-primary underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Signup;
