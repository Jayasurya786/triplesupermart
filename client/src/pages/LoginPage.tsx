import React, { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Seo } from "@/seo/Seo";
import { login, registerMember } from "@/services/authService";
import { useAppDispatch } from "@/store/hooks";
import { setSession } from "@/store/slices/authSlice";

interface FormState {
  status: "idle" | "success" | "error";
  message?: string;
  user?: any;
}

async function performLoginAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    const payload = {
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    };
    const result = await login(payload);
    
    if (result.user && result.accessToken) {
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("accessToken", result.accessToken);
      if (result.refreshToken) {
        localStorage.setItem("refreshToken", result.refreshToken);
      }
      return { status: "success", message: "Login successful", user: result.user };
    }
    return { status: "error", message: "Invalid response from server" };
  } catch (error) {
    return { status: "error", message: (error as Error).message };
  }
}

async function performRegisterAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      password: String(formData.get("password") || ""),
    };
    const result = await registerMember(payload);
    
    if (result.user) {
      return { status: "success", message: "Registration successful. Please login with your credentials." };
    }
    return { status: "error", message: "Registration failed" };
  } catch (error) {
    return { status: "error", message: (error as Error).message };
  }
}

function LoginButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="button-submit"
    >
      {pending ? "Signing In..." : "Sign In"}
    </button>
  );
}

function RegisterButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
    >
      {pending ? "Registering..." : "Register"}
    </button>
  );
}

export function LoginPage() {
  const location = useLocation();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginState, loginAction] = useActionState(performLoginAction, { status: "idle" });
  const [registerState, registerAction] = useActionState(performRegisterAction, { status: "idle" });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setMode(location.pathname === "/register" ? "register" : "login");
  }, [location.pathname]);

  useEffect(() => {
    if (loginState.status === "success" && loginState.user) {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      
      if (accessToken) {
        dispatch(setSession({ 
          user: loginState.user, 
          accessToken,
          refreshToken: refreshToken || undefined
        }));
        
        // Redirect based on role
        if (loginState.user.role === "admin" || loginState.user.role === "staff") {
          navigate("/admin");
        } else {
          navigate("/portal");
        }
      }
    }
  }, [loginState.status, loginState.user, dispatch, navigate]);

  return (
    <PageShell>
      <Seo 
        title={mode === "login" ? "Login" : "Register"} 
        description={mode === "login" ? "Login to your account." : "Create a new account."}
      />
      {mode === "login" ? (
        <StyledWrapper>
          <form action={loginAction} className="form">
            <div className="flex-column">
              <label>Email</label>
            </div>
            <div className="inputForm">
              <svg height={20} viewBox="0 0 32 32" width={20} xmlns="http://www.w3.org/2000/svg">
                <g id="Layer_3" data-name="Layer 3">
                  <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
                </g>
              </svg>
              <input name="email" type="email" className="input" placeholder="Enter your Email" required />
            </div>
            <div className="flex-column">
              <label>Password</label>
            </div>
            <div className="inputForm">
              <svg height={20} viewBox="-64 0 512 512" width={20} xmlns="http://www.w3.org/2000/svg">
                <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
                <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
              </svg>
              <input name="password" type="password" className="input" placeholder="Enter your Password" required />
            </div>

            {(loginState.status === "error" || loginState.status === "success") && (
              <p className={`p message ${loginState.status === "error" ? "error" : "success"}`}>{loginState.message}</p>
            )}

            <div className="flex-row">
              <div>
                <input id="remember-me" type="checkbox" />
                <label htmlFor="remember-me">Remember me</label>
              </div>
              <span className="span">Forgot password?</span>
            </div>

            <LoginButtonWrapper />

            <p className="p">
              Don&apos;t have an account?
              <Link className="span" to="/register">
                Sign Up
              </Link>
            </p>

            <p className="p line">Or With</p>
            <div className="flex-row social-row">
              <button type="button" className="btn google">
                <svg
                  version="1.1"
                  width={20}
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  viewBox="0 0 512 512"
                  style={{ enableBackground: "new 0 0 512 512" }}
                  xmlSpace="preserve"
                >
                  <path
                    style={{ fill: "#FBBB00" }}
                    d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256 c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456 C103.821,274.792,107.225,292.797,113.47,309.408z"
                  />
                  <path
                    style={{ fill: "#518EF8" }}
                    d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451 c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535 c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z"
                  />
                  <path
                    style={{ fill: "#28B446" }}
                    d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512 c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771 c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"
                  />
                  <path
                    style={{ fill: "#F14336" }}
                    d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012 c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0 C318.115,0,375.068,22.126,419.404,58.936z"
                  />
                </svg>
                Google
              </button>
              <button type="button" className="btn apple">
                <svg
                  version="1.1"
                  height={20}
                  width={20}
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  viewBox="0 0 22.773 22.773"
                  style={{ enableBackground: "new 0 0 22.773 22.773" }}
                  xmlSpace="preserve"
                >
                  <g>
                    <g>
                      <path d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573 c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z" />
                      <path d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334 c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0 c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019 c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464 c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648 c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716z" />
                    </g>
                  </g>
                </svg>
                Apple
              </button>
            </div>
          </form>
        </StyledWrapper>
      ) : (
        <RegisterWrapper>
          <form action={registerAction} className="register-form">
            <h2>Create Account</h2>
            <p>Join Triple N Supermart and start earning rewards.</p>
            <input name="name" placeholder="Full name" required />
            <input name="email" type="email" placeholder="Email" required />
            <input name="phone" placeholder="Mobile number" required />
            <input name="password" type="password" placeholder="Create password" required />

            {registerState.status === "error" && <p className="feedback error">{registerState.message}</p>}
            {registerState.status === "success" && <p className="feedback success">{registerState.message}</p>}

            <RegisterButtonWrapper />
            <Link className="switch-btn" to="/login">Already have an account? Sign In</Link>
          </form>
        </RegisterWrapper>
      )}
    </PageShell>
  );
}

function LoginButtonWrapper() {
  const { pending } = useFormStatus();
  return <LoginButton pending={pending} />;
}

function RegisterButtonWrapper() {
  const { pending } = useFormStatus();
  return <RegisterButton pending={pending} />;
}

const PageShell = styled.div`
  min-height: calc(100vh - 120px);
  display: grid;
  place-items: center;
  padding: 24px;

  @media (max-width: 640px) {
    padding: 18px 16px;
  }
`;

const StyledWrapper = styled.div`
  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: linear-gradient(180deg, #ffffff 0%, #f5fbf7 100%);
    border: 1px solid #d8f6e4;
    padding: 30px;
    width: min(450px, 100%);
    max-width: 450px;
    border-radius: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    box-shadow: 0 20px 45px rgba(31, 122, 74, 0.16);
  }

  ::placeholder {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    color: #5e7d6d;
  }

  .form button {
    align-self: stretch;
    width: 100%;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
  }

  .flex-row > div > label {
    color: #0d2b1c;
    font-weight: 600;
  }

  .inputForm {
    border: 1.5px solid #b1ebca;
    border-radius: 10px;
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    transition: 0.2s ease-in-out;
    background-color: #ffffff;
  }

  .input {
    margin-left: 10px;
    border-radius: 10px;
    border: none;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    color: #0f1b14;
  }

  .input:focus {
    outline: none;
  }

  .inputForm:focus-within {
    border: 1.5px solid #2aa369;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
  }

  .flex-row > div > label {
    font-size: 14px;
    color: #185c39;
    font-weight: 400;
    margin-left: 6px;
  }

  .social-row {
    display: flex;
    gap: 12px;
  }

  @media (max-width: 640px) {
    .form {
      padding: 22px;
      gap: 12px;
    }

    .flex-row {
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
    }

    .span {
      margin-left: 0;
    }

    .social-row {
      flex-direction: column;
    }
  }

  .span {
    font-size: 14px;
    margin-left: 5px;
    color: #1f7a4a;
    font-weight: 500;
    cursor: pointer;
  }

  .button-submit {
    margin: 20px 0 10px 0;
    background-color: #1f7a4a;
    border: none;
    color: white;
    font-size: 15px;
    font-weight: 500;
    border-radius: 10px;
    height: 50px;
    width: 100%;
    cursor: pointer;
  }

  .button-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .p {
    text-align: center;
    color: #185c39;
    font-size: 14px;
    margin: 5px 0;
  }

  .message {
    text-align: left;
    margin-top: 2px;
  }

  .message.error {
    color: #f87171;
  }

  .message.success {
    color: #4ade80;
  }

  .line {
    position: relative;
    margin-top: 10px;
  }

  .line::before,
  .line::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 34%;
    border-top: 1px solid #b1ebca;
  }

  .line::before {
    left: 0;
  }

  .line::after {
    right: 0;
  }

  .btn {
    margin-top: 10px;
    width: 100%;
    height: 50px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    gap: 10px;
    border: 1px solid #b1ebca;
    background-color: #ffffff;
    color: #12402a;
    cursor: pointer;
    transition: 0.2s ease-in-out;
  }

  .btn:hover {
    border: 1px solid #2aa369;
    background-color: #eefbf3;
  }

  .social-row {
    gap: 12px;
  }

  svg {
    fill: #1f7a4a;
    flex-shrink: 0;
  }
`;

const RegisterWrapper = styled.div`
  width: min(450px, 100%);
  max-width: 450px;

  .register-form {
    display: grid;
    gap: 12px;
    background: linear-gradient(180deg, #ffffff 0%, #f5fbf7 100%);
    border: 1px solid #d8f6e4;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 20px 45px rgba(31, 122, 74, 0.16);
  }

  h2 {
    margin: 0;
    color: #0d2b1c;
    font-size: 24px;
  }

  p {
    margin: 0 0 8px;
    color: #185c39;
    font-size: 14px;
  }

  input {
    border: 1.5px solid #b1ebca;
    border-radius: 10px;
    height: 50px;
    padding: 0 12px;
    background: #ffffff;
    color: #0f1b14;
  }

  input:focus {
    outline: none;
    border-color: #2aa369;
  }

  .feedback {
    margin: 0;
  }

  .feedback.error {
    color: #f87171;
  }

  .feedback.success {
    color: #4ade80;
  }

  .switch-btn {
    border: 0;
    background: transparent;
    color: #1f7a4a;
    cursor: pointer;
    padding: 0;
    font-size: 14px;
    justify-self: center;
    text-align: center;
  }

  .button-submit {
    align-self: stretch;
    margin: 8px 0 4px;
    background-color: #1f7a4a;
    border: none;
    color: white;
    font-size: 15px;
    font-weight: 500;
    border-radius: 10px;
    height: 50px;
    width: 100%;
    cursor: pointer;
  }

  @media (max-width: 640px) {
    .register-form {
      padding: 22px;
      gap: 12px;
    }

    h2 {
      font-size: 22px;
    }

    input {
      height: 48px;
    }
  }
`