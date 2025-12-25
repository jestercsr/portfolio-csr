import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { CvComponent } from './cv/cv.component';
import { ContactComponent } from './contact/contact.component';
import { TemplateComponent } from './template/template.component';
import { MentionsLegalesComponent } from './mentions-legales/mentions-legales.component';
import { TarifsComponent } from './tarifs/tarifs.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './_service/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'portfolio', component: PortfolioComponent},
    {path: 'cv', component: CvComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'template', component: TemplateComponent},
    {path: 'mentions-legales', component: MentionsLegalesComponent},
    { path: 'tarif', component: TarifsComponent },
    { path: 'auth', children: [ {path: 'login', component: LoginComponent }, {path: 'signup', component: SignupComponent}] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], },
    {path: '**', component: HomeComponent, pathMatch: 'full'}
];
