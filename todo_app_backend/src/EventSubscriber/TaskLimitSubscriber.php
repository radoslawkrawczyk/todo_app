<?php
namespace App\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use ApiPlatform\Core\Exception\ResourceClassNotSupportedException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Task;

class TaskLimitSubscriber implements EventSubscriberInterface
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['checkTaskLimit', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function checkTaskLimit(ViewEvent $event)
    {
        $task = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$task instanceof Task || Request::METHOD_POST !== $method) {
            return;
        }
    }
}