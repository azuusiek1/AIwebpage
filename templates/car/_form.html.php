<?php
    /** @var $car ?\App\Model\Car */
?>

<div class="form-group">
    <label for="mark">Mark</label>
    <input type="text" id="mark" name="car[mark]" value="<?= $car ? $car->getMark() : '' ?>">
</div>
<div class="form-group">
    <label for="model">Model</label>
    <textarea id="model" name="car[model]"><?= $car? $car->getModel() : '' ?></textarea>
</div>
<div class="form-group">
    <label for="year">Year</label>
    <textarea id="year" name="car[year]"><?= $car? $car->getYear() : '' ?></textarea>
</div>


<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
