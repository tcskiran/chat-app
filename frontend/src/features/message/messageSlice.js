import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import messageService from './messageService';

const initialState = {
  messages: [],
  errorMessage: '',
  isError: false,
  isLoading: false,
  isSuccess: false,
};

export const addMessage = createAsyncThunk(
  'message/addMessage',
  async (messageData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await messageService.addMessage(messageData, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const getMessages = createAsyncThunk(
  'message/getMessages',
  async (messageData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await messageService.getMessages(messageData, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.messages = [];
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addMessage.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(addMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(getMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const { reset } = messageSlice.actions;
export default messageSlice.reducer;
