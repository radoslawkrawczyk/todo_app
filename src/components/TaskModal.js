import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function TaskModal(props) {
    const { visible, setShowModal, handleAddTask } = props;

    const [taskName, setTaskName] = useState('');

    const handleChange = (event) => {
        setTaskName(event.target.value);
    };

    const handleAdd = () => {
        if (taskName.trim()) {
            handleAddTask(taskName.trim());
            setTaskName('');
            handleClose();
        }
    };

    const handleClose = () => setShowModal(false);

    return (
        <>
            <Modal show={visible} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Dodaj zadanie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Nazwa</Form.Label>
                            <Form.Control type="text" placeholder="Nowe zadanie..." onChange={handleChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Anuluj
                    </Button>
                    <Button variant="primary" onClick={handleAdd}>
                        Dodaj
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default TaskModal;