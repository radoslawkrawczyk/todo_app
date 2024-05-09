import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '..';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
    const response = await axios.get(baseUrl);
    const sortedData = response.data.sort((a, b) => a.position - b.position);
    return sortedData;
});

export const updateTaskPosition = createAsyncThunk(
    'tasks/updateTaskPosition',
    async (tasks) => {
        const updates = tasks.map((task, index) => ({
            id: task.id,
            position: index + 1,
        }));
        await axios.post(`${baseUrl}/update-positions`, updates);
        return tasks;
    }
);

export const addTask = createAsyncThunk('tasks/addTask', async () => {
    const response = await axios.post(baseUrl, {
        name: 'Nowe zadanie...',
        position: 1,
    });
    return response.data;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id) => {
    await axios.delete(`${baseUrl}/${id}`);
    return id;
});

export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ id, name }) => {
        await axios.put(`${baseUrl}/${id}`, { id, name });
        return { id, name };
    }
);

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        tasksList: [],
        isLoaded: true,
        error: null,
        updatingPositions: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.isLoaded = false;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.tasksList = action.payload;
                state.isLoaded = true;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.error = action.error.message;
                state.isLoaded = true;
            })
            .addCase(updateTaskPosition.pending, (state) => {
                state.isLoaded = false;
            })
            .addCase(updateTaskPosition.fulfilled, (state, action) => {
                state.tasksList = action.payload;
                state.isLoaded = true;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.tasksList.push(action.payload);
            })
            .addCase(deleteTask.pending, (state, action) => {
                state.isLoaded = false;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasksList = state.tasksList.filter(
                    (task) => task.id !== action.payload
                );
                state.isLoaded = true;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const { id, name } = action.payload;
                const task = state.tasksList.find((task) => task.id === id);
                if (task) {
                    task.name = name;
                }
            });
    },
});

export default tasksSlice.reducer;
