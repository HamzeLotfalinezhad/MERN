import { createSlice } from "@reduxjs/toolkit";

export const recordSlice = createSlice({
  name: 'record',
  initialState: {
    record: null,
    // records: [],
  },
  reducers: {
    addRecord: (state, action) => {
      state.record = action.payload
    }
    // addRecord: (state, action) => {
    //   state.records.push(action.payload);
    // },
  }
});

export const { addRecord } = recordSlice.actions;
export const selectRecords = (state) => state.record.record;

export default recordSlice.reducer;