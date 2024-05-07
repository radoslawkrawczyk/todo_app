<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;
use App\Entity\Task;
use Doctrine\ORM\EntityManagerInterface;

#[AsController]
class UpdateTaskPositionsController extends AbstractController
{
    public function __construct(private EntityManagerInterface $entityManager)
    {
    }

    public function updatePositions(Request $request): Response
    {
        $positions = json_decode($request->getContent(), true);
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

