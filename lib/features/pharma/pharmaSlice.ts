import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface PharmaState {
  excelData: {
    medicine: any[],
    distributor: any[],
    purchase: any[],
    sales: any[],
    stock: any[]
  };
}

const initialState: PharmaState = {
  excelData: {
    medicine: [],
    distributor: [],
    purchase: [],
    sales: [],
    stock: []
  },
};

const pharmaSlice = createSlice({
  name: 'pharma',
  initialState,
  reducers: {
    setExcelData: (state, action: PayloadAction<{
      medicine: any[],
      distributor: any[],
      purchase: any[],
      sales: any[],
      stock: any[]
    }>) => {
      state.excelData = action.payload;
    },
  },
});

export const { setExcelData } = pharmaSlice.actions;

export const selectExcelData = (state: RootState) => state.pharma.excelData;

export default pharmaSlice.reducer;