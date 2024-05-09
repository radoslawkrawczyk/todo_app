import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { deleteTask, updateTask } from "../features/tasksSlice";

function Task(props) {
    const { id, name, setIsLoaded, fetchData } = props;

    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(name);

    const handleDelete = () => {
        dispatch(deleteTask(id));
    };

    const handleUpdate = () => {
        if (editedName.trim()) {
            dispatch(updateTask({ id, name: editedName.trim() }));
        }
        setIsEditing(false);
    };

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleChange = (event) => {
        if (event.target.value.length <= 150) {
            setEditedName(event.target.value);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleUpdate();
        }
    };

    const handleBlur = () => {
        if (!editedName.trim()) {
            setEditedName(name);
        }
        handleUpdate();
        setIsEditing(false);
    };

    return <>
        <div style={{ border: '1px solid black', borderRadius: '5px', padding: '2px', margin: '5px auto', minHeight: '36px' }}>
            <span onDoubleClick={handleDoubleClick}>
                {isEditing ? (
                    <input
                        type="text"
                        value={editedName}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        onBlur={handleBlur}
                        autoFocus
                    />
                ) : (
                    <span>{name}</span>
                )}
            </span>
            <div className="float-end">
                <span style={{ color: '#ababab', marginRight: '5px' }}>id: {id}</span>
                <Button variant="danger" size="sm" onClick={handleDelete}>
                    Usuń
                </Button>
            </div>
        </div>
    </>
}

export default Task;