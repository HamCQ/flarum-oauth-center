<?php

/*
 * This file is part of foskym/flarum-oauth-center.
 *
 * Copyright (c) 2023 FoskyM.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if (!$schema->hasColumn('oauth_clients', 'client_name')) {
            $schema->table('oauth_clients', function (Blueprint $table) use ($schema) {
                $table->string('client_name',512)->default(null)->nullable();;
            });
        }
        if (!$schema->hasColumn('oauth_clients', 'client_icon')) {
            $schema->table('oauth_clients', function (Blueprint $table) use ($schema) {
                $table->string('client_icon',512)->default(null)->nullable();;
            });
        }
        if (!$schema->hasColumn('oauth_clients', 'client_desc')) {
            $schema->table('oauth_clients', function (Blueprint $table) use ($schema) {
                $table->string('client_desc',1024)->default(null)->nullable();;
            });
        }
        if (!$schema->hasColumn('oauth_clients', 'client_home')) {
            $schema->table('oauth_clients', function (Blueprint $table) use ($schema) {
                $table->string('client_home',200)->default(null)->nullable();;
            });
        }
    },
    'down' => function (Builder $schema) {
        
    },
];