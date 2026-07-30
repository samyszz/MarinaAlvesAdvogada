import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'login',
	},
	{
		path: 'login',
		component: Login,
	},
	{
		path: 'dashboard',
		component: Dashboard,
	},
	{
		path: '**',
		redirectTo: 'login',
	},
];
