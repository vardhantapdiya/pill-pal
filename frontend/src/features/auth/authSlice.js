import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { syncLocalToServer } from "../saved/savedSlice";

//createAsyncThunk is a fn given by redux majorly used for API calls, basically apne ko auth slice k andar,
// ek signup reducer banana hai jo api call kare, to syntactically isko bahar banate hai, "auth/signup" ka mtlb
// ye hi hai. Second argu hota hai ek callback, ki kya kaam karwana hai(api calls aur related bhaang bhosda)
// 

const getApiErrorMessage = (error) => {
  if (error.response?.status === 429) {
    return error.response.data?.message || "Too many requests. Please wait.";
  }
  return error.response?.data?.error || error.message;
};

export const signup = createAsyncThunk("auth/signup", async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/signup", { email, password });
    return { message: data.message, email };
  } catch (error) {
    // const errorMessage = error.response?.data?.error || error.message;
    // return rejectWithValue(errorMessage);
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const resendOtp = createAsyncThunk("auth/resendOtp", async ({ email }, { rejectWithValue }) => {
  try {
    const { message } = await api.post("/auth/resend-otp", { email });
    return { message: message, email };
  } catch (error) {
    // const errorMessage = error.response?.data?.error || error.message;
    // return rejectWithValue(errorMessage);
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const resetPassOtp = createAsyncThunk("auth/resetPassOtp", async({email},{rejectWithValue})=>{
  try{
    const data = await api.post("/auth/forgot-password",{email});
    return {message:data.message,email};
  }
  catch(error){
    // const errorMessage = error.response?.data?.error || error.message;
    // return rejectWithValue(errorMessage);
    return rejectWithValue(getApiErrorMessage(error));
  }
})

export const verifyOtp = createAsyncThunk("auth/verifyOtp", async ({ email, code }, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/verify-otp", { email, code });
    dispatch(setAuth({ token: data.token, email }));
    await dispatch(syncLocalToServer());
    return data;
  } catch (error) {
    // const errorMessage = error.response?.data?.error || error.message;
    // return rejectWithValue(errorMessage);
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const login = createAsyncThunk("auth/login", async ({ email, password }, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/login", { email, password });
    dispatch(setAuth({ token: data.token, email }));
    await dispatch(syncLocalToServer());
    return data;
  } catch (error) {
    // Extract the actual error message from the API response
    // const errorMessage = error.response?.data?.error || error.message;
    // return rejectWithValue(errorMessage);
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async ({ email, password,code}, { dispatch, rejectWithValue }) => {
  try {
    const { message } = await api.post("/auth/reset-password", { email:email.toLowerCase(), password,code });
    // dispatch(setAuth({ token: data.token, email }));
    // await dispatch(syncLocalToServer());
    return message;
  } catch (error) {
    // Extract the actual error message from the API response
    // const errorMessage = error.response?.data?.error || error.message;
    // return rejectWithValue(errorMessage);
    return rejectWithValue(getApiErrorMessage(error));
  }
});

const slice = createSlice({
  name: "auth",
  initialState: { token: null, email: null, status: "idle", error: null, pendingSignupEmail: null },
  reducers: {
    setAuth: (state, action) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
    },
    logout: (state) => {
      state.token = null; state.email = null;
    },
    setPendingSignupEmail: (state, action) => {
      state.pendingSignupEmail = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (b) => {
    b
      .addCase(signup.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(signup.fulfilled, (s, a) => { s.status = "succeeded"; s.pendingSignupEmail = a.payload.email; })
      .addCase(signup.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || a.error.message;
      })

      .addCase(login.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(login.fulfilled, (s) => { s.status = "succeeded"; })
      .addCase(login.rejected, (s, a) => { s.status = "failed"; s.error = a.payload || a.error.message; })

      .addCase(verifyOtp.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(verifyOtp.fulfilled, (s) => { s.status = "succeeded"; })
      .addCase(verifyOtp.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || a.error.message;
      })

      .addCase(resetPassOtp.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(resetPassOtp.fulfilled, (s, a) => { s.status = "succeeded"; s.pendingSignupEmail = a.payload.email; })
      .addCase(resetPassOtp.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || a.error.message;
      })

      .addCase(resetPassword.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(resetPassword.fulfilled, (s, a) => { s.status = "succeeded"; s.pendingSignupEmail = null; })
      .addCase(resetPassword.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || a.error.message;
      })

      .addCase(resendOtp.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(resendOtp.fulfilled, (s, a) => { s.status = "succeeded"; s.pendingSignupEmail = a.payload.email; })
      .addCase(resendOtp.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || a.error.message;
      })
  }
});

// extraReducers exact like the name, jo reducer waale kaam apan ne asyncThunk mai karwaye hai unke hone par
// 3 states hoti hai pending,fullfilled,rejected to jb aisa ho jaaye to kya karwana hai.
// Jaise ki verifyOtp ho jaaye(fullfilled) to state ka status = "succeeded" kardo, iska use apan spinner dikhate
// time kar sakta hai, har api call k liye spinner ala se karne ki bajaye, centralized way mai state k through 
// requiremet check karke spinner hatado/dikhado. Aur bhi bohot use cases hote hai.

export const { setAuth, logout, setPendingSignupEmail,clearError } = slice.actions;
export default slice.reducer;