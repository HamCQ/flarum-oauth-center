import app from 'flarum/admin/app';
import SettingsPage from './components/SettingsPage';
app.initializers.add('hamcq/flarum-oauth-center', () => {
  app.extensionData
    .for('hamcq-oauth-center')
    .registerPage(SettingsPage)
    .registerPermission(
    {
      icon: 'fas fa-user-friends',
      label: app.translator.trans('foskym-oauth-center.admin.permission.use_oauth'),
      permission: 'foskym-oauth-center.use-oauth',
    },
    'view',
    95
  );
});
