
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Task from './components/Task';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { useEffect, useState } from 'react';
import axios from 'axios';

export const baseUrl = 'http://localhost:8000/api/tasks';
function App() {

  const [isLoaded, setIsLoaded] = useState(false);
  const [tasksList, setTasksList] = useState([]);

  useEffect(() => {
    fetchData();

  }, []);

  const fetchData = () => {
    axios.get(baseUrl).then(res => {
      const { data } = res;
      const sortedData = data.sort((a, b) => a.position - b.position);

      setTasksList(sortedData);
      setIsLoaded(true);
    })
      .catch(err => console.log(err));
  }

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const newTasksList = Array.from(tasksList);
    const [reorderedItem] = newTasksList.splice(source.index, 1);
    newTasksList.splice(destination.index, 0, reorderedItem);

    setTasksList(newTasksList);

    updatePositions(newTasksList);
  };

  const updatePositions = async (tasks) => {
    const updates = tasks.map((task, index) => ({
      id: task.id,
      position: index + 1 // index = 0
    }));

    try {
      setIsLoaded(false);

      await axios.post('http://localhost:8000/api/tasks/update-positions', updates);
      fetchData();
    } catch (error) {
      console.error('Błąd:', error);
    }
  };

  const addTask = async () => {
    setIsLoaded(false);
    const highestPosition = tasksList.reduce((max, task) => Math.max(max, task.position), 0);
    const newTaskPosition = highestPosition + 1;

    try {
      const res = await axios.post('http://localhost:8000/api/tasks', {
        name: 'Nowe zadanie...',
        position: newTaskPosition
      });
      fetchData();
    } catch (error) {
      console.error('Błąd:', error);
      setIsLoaded(true);
    }
  };

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
                    <Button type='button' variant='success' size='sm' onClick={addTask} disabled={!isLoaded}>Dodaj</Button> <br />
                    <small>Kliknij dwukrotnie zadanie, aby zmienić jego nazwę</small>
                  </Card.Subtitle>
                  {isLoaded ? <Droppable droppableId="tasks">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {tasksList.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <Task id={task.id} name={task.name} position={task.position} fetchData={fetchData} setIsLoaded={setIsLoaded} />
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
      </DragDropContext>
    </>
  );
}

export default App;
