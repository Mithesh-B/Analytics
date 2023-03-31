import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  startDate: null,
  endDate: null,
};

const dateRangeSlice = createSlice({
  name: 'dateRange',
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
  },
});

export const { setDateRange } = dateRangeSlice.actions;


export const selectEndDate = state => state.dateRange.endDate;
export const selectStartDate = state => state.dateRange.startDate;

export default dateRangeSlice.reducer;