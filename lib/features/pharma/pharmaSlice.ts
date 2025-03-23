import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface PharmaState {
  excelData: any;
}

const initialState: PharmaState = {
  excelData: [],
};

const pharmaSlice = createSlice({
  name: 'pharma',
  initialState,
  reducers: {
    setExcelData: (state, action: PayloadAction<any[]>) => {
      state.excelData = action.payload;
    },
  },
});

export const { setExcelData } = pharmaSlice.actions;

export const selectExcelData = (state: RootState) => state.pharma.excelData;

export default pharmaSlice.reducer;