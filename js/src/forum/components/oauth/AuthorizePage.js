import app from 'flarum/forum/app';
import {extend} from 'flarum/common/extend';
import Page from 'flarum/common/components/Page';
import IndexPage from 'flarum/forum/components/IndexPage';
import LogInModal from 'flarum/forum/components/LogInModal';
import extractText from 'flarum/common/utils/extractText';
import Tooltip from 'flarum/common/components/Tooltip';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import avatar from 'flarum/common/helpers/avatar';

import ScopeComponent from '../ScopeComponent';

export default class AuthorizePage extends IndexPage {
  params = [];
  client = null;
  scopes = null;
  client_scope = [];
  loading = true;
  is_authorized = false;
  submit_loading = false;
  display_mode = 'box';

  oninit(vnode) {
    super.oninit(vnode);
    if (!app.session.user) {
      setTimeout(() => app.modal.show(LogInModal), 500);
    }

    this.display_mode = app.forum.attribute('foskym-oauth-center.display_mode') || 'box';

    const params = m.route.param();

    if (params.client_id == null || params.response_type == null || params.redirect_uri == null) {
      m.route.set('/');
      return;
    }

    this.params = params;

    Promise.all([
      app.store.find('oauth-clients', params.client_id),
      app.store.find('oauth-scopes')
    ]).then(([client, scopes]) => {
      if (!client) {
        m.route.set('/');
        return;
      }

      this.client = client;
      this.scopes = scopes;

      let uris = this.client.redirect_uri().split(' ');

      if (app.forum.attribute('foskym-oauth-center.require_exact_redirect_uri') && !uris.includes(params.redirect_uri)) {
        m.route.set('/');
        return;
      }

      if (!app.forum.attribute('foskym-oauth-center.allow_implicit') && params.response_type === 'token') {
        m.route.set('/');
        return;
      }

      if (app.forum.attribute('foskym-oauth-center.enforce_state') && params.state == null) {
        m.route.set('/');
        return;
      }

      let scopes_temp = params.scope ? params.scope.split(' ') : (this.client.scope() || '').split(' ');

      let default_scopes = this.scopes.filter(scope => scope.is_default() === 1).map(scope => scope.scope());

      this.client_scope = scopes_temp.filter((scope, index) => scopes_temp.indexOf(scope) === index);
      this.client_scope = this.client_scope.concat(default_scopes).filter(scope => scope !== '');

      this.loading = false;
      m.redraw();
    });
  }

  setTitle() {
    app.setTitle(extractText(app.translator.trans('foskym-oauth-center.forum.page.title.authorize')));
    app.setTitleCount(0);
  }

  view() {
    if (!this.client || this.loading) {
      return <LoadingIndicator/>;
    }
    return (
      <div className="AuthorizePage">
        <div className="container">
          <div class="oauth-area">
            <div class={'oauth-main oauth-' + this.display_mode}>
              <div class="oauth-header">
                <h2>{app.forum.attribute('title')}</h2>
                <p>
                  {app.translator.trans('foskym-oauth-center.forum.authorize.access')} <Tooltip text={this.client.client_desc()} position="bottom">
                    <a href={this.client.client_home()} target="_blank">{this.client.client_name()}</a>
                  </Tooltip>
                </p>

              </div>
              <div class="oauth-body">

                <div class="oauth-user">
                  {avatar(app.session.user, {className: 'oauth-avatar'})}
                  <div class="oauth-username">
                    <b>{app.session.user.username()}</b>
                    <span>{app.session.user.displayName()}</span>
                  </div>
                </div>

                <div class="oauth-info">
                  <Tooltip text={app.forum.attribute('title')}>
                    <img src={app.forum.attribute('faviconUrl')} alt="favicon"/>
                  </Tooltip>
                  <i class="fas fa-exchange-alt fa-2x"></i>
                  <Tooltip text={this.client.client_desc()}>
                    <img src={this.client.client_icon()} alt="client_icon"/>
                  </Tooltip>
                  <h3>{this.client.client_name()}</h3>
                  <p>{this.client.client_desc()}</p>
                </div>
                <div class="oauth-scope-area">
                  <h3>{app.translator.trans('foskym-oauth-center.forum.authorize.require_these_scopes')}</h3>
                  {
                    this.client_scope
                      .filter(scope => scope)
                      .map(scope => {
                        let scope_info = this.scopes.find(s => s.scope() === scope);
                        return scope_info && <ScopeComponent scope={scope_info} client={this.client} />;
                      })
                  }
                </div>
                <form class="oauth-form" method="post" id="oauth-form" action="/oauth/authorize" onsubmit={this.onsubmit.bind(this)}>
                  {Object.keys(this.params).map(key => (
                    <input type="hidden" name={key} value={this.params[key]} />
                  ))}
                  <input type="hidden" name="is_authorized" value={this.is_authorized}/>
                  <div class="oauth-form-item oauth-btn-group" style="text-align:center; justify-content: center;">
                    <Button className="Button" type="submit" style="width: 30%;" onclick={this.deny.bind(this)}
                            loading={this.submit_loading}>
                      {app.translator.trans('foskym-oauth-center.forum.authorize.deny')}
                    </Button>
                    <Button className="Button Button--primary" type="submit" style="width: 30%; margin-left: 20px;"
                            onclick={this.agree.bind(this)} loading={this.submit_loading}>
                      {app.translator.trans('foskym-oauth-center.forum.authorize.agree')}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  deny(e) {
    this.is_authorized = false;
  }
  agree(e) {
    this.is_authorized = true;
  }

  onsubmit(e) {
    e.preventDefault();
    if(!this.is_authorized){
      window.location.href = "/"
      return;
    }
    document.getElementsByName("is_authorized").value = this.is_authorized
    this.submit_loading = true;
    if (app.forum.attribute('foskym-oauth-center.authorization_method_fetch')) {
      app.request({
        method: 'POST',
        url: '/oauth/authorize/fetch',
        body: {
          ...this.params,
          is_authorized: this.is_authorized,
        }
      }).then((params) => {
        window.location.href = params.location;
        this.submit_loading = false;
      });
    } else {
      document.getElementById('oauth-form').submit();
      this.submit_loading = false;
    }
  }
}
