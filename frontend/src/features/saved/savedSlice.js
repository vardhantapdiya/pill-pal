import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import api from "../../api/axios";

// GET all saved from DB
export const fetchSaved = createAsyncThunk("saved/fetch", async () => {
  const { data } = await api.get("/saved");
  return data; // array
});

// POST save to DB
export const saveToServer = createAsyncThunk("saved/saveToServer", async ({ medicineName, alternative }) => {
  const { data } = await api.post("/saved/save", { medicineName, alternative });
  return data.saved;
});

// DELETE from DB
export const deleteSaved = createAsyncThunk("saved/deleteSaved", async (id) => {
  await api.delete(`/saved/${id}`);
  return id;
});

// After login/verify: move local -> server
//second argument is the thunkAPI object which contains getState and dispatch, we have destructured it.
export const syncLocalToServer = createAsyncThunk("saved/syncLocalToServer", async (_, { getState, dispatch }) => {
  const { saved, auth } = getState(); //saved and auth slice
  if (!auth.token || saved.local.length === 0) return [];

  const results = [];
  for (const item of saved.local) {
    try {
      const savedDoc = await dispatch(saveToServer(item)).unwrap();
      // The .unwrap() method is used to get the resolved value of the saveToServer thunk's promise. 
      // It also allows any errors from the inner thunk to be re-thrown, though the outer try...catch block 
      // gracefully handles any potential failures (e.g., a network error or a server validation issue).
      results.push(savedDoc);
    } catch {}
  }
  // clear local after successful attempts
  dispatch(clearLocal());
  // refresh from DB
  await dispatch(fetchSaved());
  return results;
});

const slice = createSlice({
  name: "saved",
  initialState: { items: [], local: [], status: "idle", error: null },
  reducers: {
    addLocal: (state, action) => {
      // shape: { medicineName, alternative: {name, price, link} }
      // .some can be used on arrays when we neeed to find exact one result. It returns true if that happens,
      // and stops, thus making it more efficient than filter when we want only one object.
      const exists = state.local.some(
        (x) => x.medicineName === action.payload.medicineName && x.alternative?.name === action.payload.alternative?.name
      );
      if (!exists) state.local.push(action.payload);
    },
    clearLocal: (state) => { state.local = []; },
  },
  extraReducers: (b) => {
    b
      .addCase(fetchSaved.pending, (s)=>{ s.status="loading"; s.error=null; })
      .addCase(fetchSaved.fulfilled, (s,a)=>{ s.status="succeeded"; s.items=a.payload; })
      .addCase(fetchSaved.rejected, (s,a)=>{ s.status="failed"; s.error=a.error.message; })

      .addCase(saveToServer.fulfilled, (s,a)=>{ s.items.unshift(a.payload); })
      // .unshift is used to add something at the first index of the array, we are using it here to add
      // our saved object on first index after saving it to the database. We are doing this so that we don't
      // have to call fetch after saving an object to see it. We save in db through api and add that saved data
      // in current state so that it becomes visible at first index without calling fetch again.

      .addCase(deleteSaved.fulfilled, (s,a)=>{ s.items = s.items.filter(i=> i._id !== a.payload); });
  }
});

export const { addLocal, clearLocal } = slice.actions;
export default slice.reducer;

// selector: is a card saved? (local or server)
export const makeSelectIsSaved = (medicineName, altName) => createSelector(
  (state)=>state.saved,
  (saved)=> {
    const inLocal = saved.local.some(x => x.medicineName === medicineName && x.alternative?.name === altName);
 const inServer = saved.items.some(x => 
      (x.medicine?.name === medicineName || x.medicine?.normalized === medicineName.toLowerCase()) 
      && x.name === altName
    );
    return inLocal || inServer;
  }
);
