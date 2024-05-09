<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use App\Service\TaskPositionUpdater;
use Symfony\Component\HttpFoundation\Response;

class TaskPositionUpdateController
{
    private TaskPositionUpdater $taskPositionUpdater;

    public function __construct(TaskPositionUpdater $taskPositionUpdater)
    {
        $this->taskPositionUpdater = $taskPositionUpdater;
    }

    public function __invoke(Request $request): Response
    {
        $positions = json_decode($request->getContent(), true);
        return $this->taskPositionUpdater->updatePositions($positions);
    }
}
