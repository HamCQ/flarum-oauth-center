<?php

/*
 * This file is part of foskym/flarum-oauth-center.
 *
 * Copyright (c) 2023 FoskyM.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */
namespace FoskyM\OAuthCenter\Controllers;
use Flarum\User\User;
use Flarum\Http\RequestUtil;
use FoskyM\OAuthCenter\OAuth;
use Illuminate\Support\Arr;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Laminas\Diactoros\Response\JsonResponse;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Group\Group;

class ApiUserController implements RequestHandlerInterface
{
    protected $settings;
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        
        $actor = $actor->toArray();
        $data = [
            'id' => isset($actor['id'])?$actor['id']:0,
            'username' => isset($actor['username'])?$actor['username']:'',
            'avatar_url' => isset($actor['avatar_url'])?$actor['avatar_url']:'',
            'email' => isset($actor['email'])?$actor['email']:'',
            'is_email_confirmed' => isset($actor['is_email_confirmed'])?$actor['is_email_confirmed']:0,
            'joined_at' => isset($actor['joined_at'])?$actor['joined_at']:'',
            'last_seen_at' => isset($actor['last_seen_at'])?$actor['last_seen_at']:'',
            'discussion_count' => isset($actor['discussion_count'])?$actor['discussion_count']:0,
            'comment_count' => isset($actor['comment_count'])?$actor['comment_count']:0,
        ];
        return new JsonResponse($data);
    }
}
