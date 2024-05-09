import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import Task from './components/Task';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import React, { useEffect, useState } from 'react';
import { fetchTasks, addTask, updateTaskPosition, clearError } from './features/tasksSlice';
import { useDispatch, useSelector } from 'react-redux';

import TaskModal from './components/TaskModal';

function App() {

  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  const { tasksList, isLoaded } = useSelector((state) => state.tasks);
  const { errorMessage } = useSelector(state => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const newTasksList = Array.from(tasksList);
    const [reorderedItem] = newTasksList.splice(source.index, 1);
    newTasksList.splice(destination.index, 0, reorderedItem);

    dispatch(updateTaskPosition(newTasksList));
  };

  const handleAddTask = name => dispatch(addTask(name));

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Container className="mt-5">
          <Row>
            <Col xs={12} lg={{ span: 6, offset: 3 }}>
              <Card>
                <Card.Body>
                  <Card.Title>TODO App</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted mt-3">
                    <Button type='button' variant='success' size='sm' onClick={() => setShowModal(!showModal)} disabled={!isLoaded}>Dodaj</Button> <br />
                    <small>Kliknij dwukrotnie zadanie, aby zmienić jego nazwę</small>
                    {errorMessage && (
                      <Alert variant="danger" onClose={() => dispatch(clearError())} dismissible>
                        {errorMessage}
                      </Alert>
                    )}
                  </Card.Subtitle>
                  {isLoaded ? <Droppable droppableId="tasks">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {tasksList.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <Task id={task.id} name={task.name} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable> : 'Ładowanie...'}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </DragDropContext >

      <TaskModal visible={showModal} setShowModal={setShowModal} handleAddTask={handleAddTask} />
    </>
  );
}


export default App;
