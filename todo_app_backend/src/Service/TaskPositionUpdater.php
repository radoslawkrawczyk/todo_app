<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use App\Entity\Task;

class TaskPositionUpdater
{
    public function __construct(private EntityManagerInterface $entityManager)
    {
    }

    public function updatePositions(array $positions): Response
    {
        foreach ($positions as $position) {
            $task = $this->entityManager->getRepository(Task::class)->find($position['id']);
            if (!$task) {
                return new Response('Task not found', Response::HTTP_NOT_FOUND);
            }
            $task->setPosition($position['position']);
            $this->entityManager->persist($task);
        }
        $this->entityManager->flush();

        return new Response(null, Response::HTTP_NO_CONTENT);
    }
}