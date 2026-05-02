<?php

declare(strict_types=1);

namespace App\Enums;

enum Difficulty: string
{
    case Easy = 'easy';
    case Normal = 'normal';
    case Hard = 'hard';
}
