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
        if (!$schema->hasColumn('oauth_scopes', 'scope_name')) {
            $schema->table('oauth_scopes', function (Blueprint $table) use ($schema) {
                $table->string('scope_name', 512)->default(null)->nullable();
            });
        }
        if (!$schema->hasColumn('oauth_scopes', 'scope_icon')) {
            $schema->table('oauth_scopes', function (Blueprint $table) use ($schema) {
                $table->string('scope_icon', 512)->default(null)->nullable();
            });
        }
        if (!$schema->hasColumn('oauth_scopes', 'scope_desc')) {
            $schema->table('oauth_scopes', function (Blueprint $table) use ($schema) {
                $table->string('scope_desc', 1024)->default(null)->nullable();
            });
        }
    },
    'down' => function (Builder $schema) {
        
    },
];