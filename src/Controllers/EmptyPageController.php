<?php

namespace FoskyM\OAuthCenter\Controllers;

use Flarum\Frontend\Document;
use Psr\Http\Message\ServerRequestInterface;

class EmptyPageController
{
    public function __invoke(Document $document, ServerRequestInterface $request)
    {
        return $document;
    }
}