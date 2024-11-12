import { server } from "@/config";
import { userExists } from "@/redux/reducers/authSlice";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Logging In...");

    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username,
          password: password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      dispatch(userExists(data.user));

      toast.success(data?.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("avatar", avatar);
    formData.append("name", name);
    formData.append("username", username);
    formData.append("password", password);

    try {
      const { data } = await axios.post(`${server}/api/v1/user/new`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(userExists(data.user));

      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleLogin = () => setIsLogin((prev) => !prev);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form
          onSubmit={isLogin ? handleLogin : handleSignUp}
          className="space-y-4"
        >
          {!isLogin && (
            <>
              <div className="mb-4 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-600 mb-2">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <label className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                  Upload Avatar
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleAvatarChange}
                    accept="image/*"
                  />
                </label>
              </div>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
              />
            </>
          )}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <div className="mt-4 text-center text-gray-400">
          <span>OR</span>
        </div>
        <button
          onClick={toggleLogin}
          className="w-full text-blue-400 mt-4 hover:underline"
        >
          {isLogin ? "Sign Up Instead" : "Login Instead"}
        </button>
      </div>
    </div>
  );
}

export default Login;
