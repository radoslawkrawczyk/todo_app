<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\TaskRepository;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Validator\Constraints as Assert;


#[ORM\Entity(repositoryClass: TaskRepository::class)]
#[ApiResource(
    order: ["position" => "ASC"]
)]


class Task
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 150, nullable: false)]
    #[Assert\NotBlank(message: "Nazwa nie może być pusta")]
    #[Assert\Length(
        min: 2,
        max: 150,
        minMessage: "Minimalny limit znaków na nazwę: {{ limit }}",
        maxMessage: "Maksymalny limit znaków na nazwę: {{ limit }}"
    )]
    private string $name;

    #[Gedmo\SortablePosition]
    #[ORM\Column(nullable: false)]
    #[Assert\LessThanOrEqual(
        value: 10,
        message: "Maksymalna pozycja na liście: {{ compared_value }}"
    )]
    private int $position;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getPosition(): ?int
    {
        return $this->position;
    }

    public function setPosition(int $position): static
    {
        $this->position = $position;

        return $this;
    }
}
