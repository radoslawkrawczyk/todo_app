import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { baseUrl } from "../App";
import axios from "axios";

function Task(props) {
    const { id, name, setIsLoaded, fetchData } = props;

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(name);

    const deleteTask = () => {
        setIsLoaded(false);
        axios.delete(`${baseUrl}/${id}`).then(() => {
            fetchData();
        }).catch(err => {
            console.log(err);
        })
    }

    const updateTask = (id, editedName) => {
        setIsLoaded(false);
        axios.put(`${baseUrl}/${id}`, {
            id,
            name: editedName
        }).then(() => {

            fetchData();
        }).catch(err => {
            console.log(err);
            setIsLoaded(true);

        })
    }

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
            if (!event.target.value.trim()) {
                setEditedName(name);
            }
            updateTask(id, editedName.trim() ? editedName : name);
            setIsEditing(false);
        }
    };

    const handleBlur = () => {
        if (!editedName.trim()) {
            setEditedName(name);
        }
        if (editedName.trim() !== editedName) {
            updateTask(id, editedName.trim() ? editedName : name);
        }
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
                <Button variant="danger" size="sm" onClick={deleteTask}>
                    Usuń
                </Button>
            </div>
        </div>
    </>
}


export default Task;