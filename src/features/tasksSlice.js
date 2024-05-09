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


export const addTask = createAsyncThunk('tasks/addTask', async (taskName, { getState }) => {
    const state = getState();
    const { tasksList } = state.tasks;

    const highestPosition = tasksList.reduce((max, task) => Math.max(max, task.position), 0);
    const newTaskPosition = highestPosition + 1;

    const response = await axios.post(`${baseUrl}`, {
        name: taskName || 'Nowe zadanie...',
        position: newTaskPosition,
    });

    return response.data;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id, { dispatch, getState }) => {
    await axios.delete(`${baseUrl}/${id}`);
    const { tasksList } = getState().tasks;
    const updatedTasks = tasksList.filter(task => task.id !== id);
    dispatch(updateTaskPosition(updatedTasks));
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
        errorMessage: null,
    },
    reducers: {
        clearError: (state) => {
            state.errorMessage = null;
        }
    },
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
            .addCase(updateTask.pending, (state, action) => {
                state.isLoaded = false;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const { id, name } = action.payload;
                const task = state.tasksList.find((task) => task.id === id);
                if (task) {
                    task.name = name;
                }
                state.isLoaded = true;
            })
            .addCase(addTask.rejected, (state, action) => {
                console.log('Rejected action:', action);
                if (action.payload && action.payload.data) {
                    state.errorMessage = action.payload.data.detail;
                } else {
                    state.errorMessage = action.error.message;
                }
                state.isLoaded = true;
            });
    },
});
export const { clearError } = tasksSlice.actions;

export default tasksSlice.reducer;
