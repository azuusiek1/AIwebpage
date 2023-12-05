<?php
namespace App\Model;

use App\Service\Config;

class Car
{
    private ?int $id = null;
    private ?string $mark = null;
    private ?string $model = null;
    private ?int $year = null;
    public function getModel(): ?string
    {
        return $this->model;
    }
    public function setModel(?string $model): void
    {
        $this->model = $model;
    }
    public function getMark(): ?string
    {
        return $this->mark;
    }

    public function setMark(?string $mark): void
    {
        $this->mark = $mark;
    }

    public function getYear(): ?int
    {
        return $this->year;
    }

    public function setYear(?int $year): void
    {
        $this->year = $year;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Car
    {
        $this->id = $id;

        return $this;
    }


    public static function fromArray($array): Car
    {
        $Car = new self();
        $Car->fill($array);

        return $Car;
    }

    public function fill($array): Car
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['mark'])) {
            $this->setMark($array['mark']);
        }
        if (isset($array['model'])) {
            $this->setModel($array['model']);
        }
        if (isset($array['year'])) {
            $this->setYear($array['year']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM car';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $Cars = [];
        $CarsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($CarsArray as $CarArray) {
            $Cars[] = self::fromArray($CarArray);
        }

        return $Cars;
    }

    public static function find($id): ?Car
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM car WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $CarArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $CarArray) {
            return null;
        }
        $Car = Car::fromArray($CarArray);

        return $Car;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO car (mark, model, year) VALUES (:mark, :model, :year)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'mark' => $this->getMark(),
                'model' => $this->getModel(),
                'year' => $this->getYear()
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE car SET mark = :mark, model = :model, year = :year WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':mark' => $this->getMark(),
                ':model' => $this->getModel(),
                ':year' => $this->getYear(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM car WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setMark(null);
        $this->setModel(null);
        $this->setYear(null);
    }
}
